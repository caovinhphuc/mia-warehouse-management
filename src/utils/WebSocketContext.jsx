/**
 * WebSocket Context Provider for real-time communication
 * Handles WebSocket connections with auto-reconnect and message handling
 *
 * @module utils/WebSocketContext
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

// ==================== CONTEXT DEFINITION ====================
const WebSocketContext = createContext();

// ==================== CONNECTION STATES ====================
const ConnectionState = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting',
  ERROR: 'error',
};

// ==================== MESSAGE TYPES ====================
const MessageTypes = {
  METRICS_UPDATE: 'METRICS_UPDATE',
  ORDER_UPDATE: 'ORDER_UPDATE',
  INVENTORY_UPDATE: 'INVENTORY_UPDATE',
  ALERT: 'ALERT',
  STAFF_UPDATE: 'STAFF_UPDATE',
  SYSTEM_STATUS: 'SYSTEM_STATUS',
  HEARTBEAT: 'HEARTBEAT',
  USER_ACTION: 'USER_ACTION',
};

// ==================== PROVIDER COMPONENT ====================
export const WebSocketProvider = ({ children }) => {
  const [connectionState, setConnectionState] = useState(
    ConnectionState.DISCONNECTED
  );
  const [lastMessage, setLastMessage] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [messageHistory, setMessageHistory] = useState([]);

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const messageHandlersRef = useRef({});
  const reconnectAttemptsRef = useRef(0);

  // Configuration
  const config = {
    url: process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws',
    maxReconnectAttempts: 3, // Reduced from 10
    reconnectInterval: 5000,
    heartbeatInterval: 30000,
    messageHistoryLimit: 100,
    enableWebSocket: process.env.REACT_APP_ENABLE_WEBSOCKET === 'true', // WebSocket optional
  };

  // ==================== MESSAGE HANDLERS ====================
  const registerMessageHandler = useCallback((messageType, handler) => {
    if (!messageHandlersRef.current[messageType]) {
      messageHandlersRef.current[messageType] = [];
    }
    messageHandlersRef.current[messageType].push(handler);

    // Return unregister function
    return () => {
      messageHandlersRef.current[messageType] = messageHandlersRef.current[
        messageType
      ].filter((h) => h !== handler);
    };
  }, []);

  const unregisterMessageHandler = useCallback((messageType, handler) => {
    if (messageHandlersRef.current[messageType]) {
      messageHandlersRef.current[messageType] = messageHandlersRef.current[
        messageType
      ].filter((h) => h !== handler);
    }
  }, []);

  // ==================== MESSAGE PROCESSING ====================
  const processMessage = useCallback(
    (message) => {
      try {
        const parsedMessage =
          typeof message === 'string' ? JSON.parse(message) : message;

        // Update message history
        setMessageHistory((prev) => {
          const newHistory = [
            {
              ...parsedMessage,
              timestamp: new Date().toISOString(),
              id: Date.now() + Math.random(),
            },
            ...prev.slice(0, config.messageHistoryLimit - 1),
          ];
          return newHistory;
        });

        // Update last message
        setLastMessage(parsedMessage);

        // Call registered handlers
        const handlers = messageHandlersRef.current[parsedMessage.type] || [];
        handlers.forEach((handler) => {
          try {
            handler(parsedMessage);
          } catch (error) {
            console.error('Error in message handler:', error);
          }
        });

        // Handle system messages
        switch (parsedMessage.type) {
          case MessageTypes.HEARTBEAT:
            // Respond to heartbeat - send directly via WebSocket
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(
                JSON.stringify({
                  type: MessageTypes.HEARTBEAT,
                  timestamp: new Date().toISOString(),
                  response: true,
                })
              );
            }
            break;

          case MessageTypes.SYSTEM_STATUS:
            console.log('System status update:', parsedMessage.data);
            break;

          default:
            // Regular message processing
            break;
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error, message);
      }
    },
    [config.messageHistoryLimit]
  );

  // ==================== CONNECTION MANAGEMENT ====================
  const connect = useCallback(() => {
    // Check if WebSocket is enabled
    if (!config.enableWebSocket) {
      console.log('WebSocket is disabled via configuration');
      setConnectionState(ConnectionState.DISCONNECTED);
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    try {
      setConnectionState(ConnectionState.CONNECTING);
      wsRef.current = new WebSocket(config.url);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setConnectionState(ConnectionState.CONNECTED);
        setReconnectAttempts(0);
        reconnectAttemptsRef.current = 0;

        // Start heartbeat
        startHeartbeat();

        // Send connection message
        sendMessage({
          type: 'CONNECTION',
          timestamp: new Date().toISOString(),
          clientInfo: {
            userAgent: navigator.userAgent,
            url: window.location.href,
          },
        });
      };

      wsRef.current.onmessage = (event) => {
        processMessage(event.data);
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setConnectionState(ConnectionState.DISCONNECTED);
        stopHeartbeat();

        // Auto-reconnect unless explicitly closed or WebSocket disabled
        if (
          config.enableWebSocket &&
          event.code !== 1000 &&
          reconnectAttemptsRef.current < config.maxReconnectAttempts
        ) {
          scheduleReconnect();
        }
      };

      wsRef.current.onerror = (error) => {
        if (config.enableWebSocket) {
          console.error('WebSocket error:', error);
        } else {
          console.log('WebSocket error (disabled):', error);
        }
        setConnectionState(ConnectionState.ERROR);
      };
    } catch (error) {
      if (config.enableWebSocket) {
        console.error('Failed to create WebSocket connection:', error);
        setConnectionState(ConnectionState.ERROR);
        scheduleReconnect();
      } else {
        console.log('WebSocket connection failed (disabled):', error);
        setConnectionState(ConnectionState.DISCONNECTED);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    processMessage,
    config.enableWebSocket,
    config.maxReconnectAttempts,
    config.url,
  ]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnect');
    }
    stopHeartbeat();
    clearReconnectTimeout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (!config.enableWebSocket) {
      console.log('WebSocket reconnection skipped (disabled)');
      return;
    }

    if (reconnectAttemptsRef.current >= config.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    const delay = Math.min(
      config.reconnectInterval * Math.pow(2, reconnectAttemptsRef.current),
      30000 // Max 30 seconds
    );

    console.log(
      `Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1})`
    );
    setConnectionState(ConnectionState.RECONNECTING);
    setReconnectAttempts(reconnectAttemptsRef.current + 1);

    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectAttemptsRef.current++;
      connect();
    }, delay);
  }, [
    connect,
    config.enableWebSocket,
    config.maxReconnectAttempts,
    config.reconnectInterval,
  ]);

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // ==================== HEARTBEAT MANAGEMENT ====================
  const startHeartbeat = useCallback(() => {
    stopHeartbeat(); // Clear any existing interval

    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        sendMessage({
          type: MessageTypes.HEARTBEAT,
          timestamp: new Date().toISOString(),
        });
      }
    }, config.heartbeatInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // ==================== MESSAGE SENDING ====================
  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        const messageToSend = {
          ...message,
          id: Date.now() + Math.random(),
          timestamp: message.timestamp || new Date().toISOString(),
        };

        wsRef.current.send(JSON.stringify(messageToSend));
        return true;
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
        return false;
      }
    } else {
      console.warn('WebSocket not connected, message queued:', message);
      // In a production app, you might want to queue messages and send when reconnected
      return false;
    }
  }, []);

  // ==================== LIFECYCLE MANAGEMENT ====================
  useEffect(() => {
    // Auto-connect on mount
    connect();

    // Handle visibility change - reconnect when tab becomes visible
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        connectionState === ConnectionState.DISCONNECTED
      ) {
        connect();
      }
    };

    // Handle online/offline events
    const handleOnline = () => {
      if (connectionState === ConnectionState.DISCONNECTED) {
        connect();
      }
    };

    const handleOffline = () => {
      disconnect();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup on unmount
    return () => {
      disconnect();
      clearReconnectTimeout();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [connect, disconnect, clearReconnectTimeout, connectionState]); // Include all dependencies

  // ==================== UTILITY FUNCTIONS ====================
  const getConnectionInfo = useCallback(() => {
    return {
      state: connectionState,
      reconnectAttempts,
      isConnected: connectionState === ConnectionState.CONNECTED,
      lastMessage,
      messageCount: messageHistory.length,
    };
  }, [connectionState, reconnectAttempts, lastMessage, messageHistory.length]);

  const clearMessageHistory = useCallback(() => {
    setMessageHistory([]);
  }, []);

  // ==================== HIGH-LEVEL MESSAGE FUNCTIONS ====================
  const sendMetricsUpdate = useCallback(
    (metrics) => {
      return sendMessage({
        type: MessageTypes.METRICS_UPDATE,
        data: metrics,
      });
    },
    [sendMessage]
  );

  const sendOrderUpdate = useCallback(
    (order) => {
      return sendMessage({
        type: MessageTypes.ORDER_UPDATE,
        data: order,
      });
    },
    [sendMessage]
  );

  const sendInventoryUpdate = useCallback(
    (inventory) => {
      return sendMessage({
        type: MessageTypes.INVENTORY_UPDATE,
        data: inventory,
      });
    },
    [sendMessage]
  );

  const sendAlert = useCallback(
    (alert) => {
      return sendMessage({
        type: MessageTypes.ALERT,
        data: alert,
      });
    },
    [sendMessage]
  );

  const sendUserAction = useCallback(
    (action) => {
      return sendMessage({
        type: MessageTypes.USER_ACTION,
        data: {
          ...action,
          userId: 'current-user', // Would be actual user ID
          sessionId: 'current-session', // Would be actual session ID
        },
      });
    },
    [sendMessage]
  );

  // ==================== CONTEXT VALUE ====================
  const contextValue = {
    // State
    connectionState,
    lastMessage,
    messageHistory,
    reconnectAttempts,

    // Connection management
    connect,
    disconnect,
    getConnectionInfo,

    // Message handling
    sendMessage,
    registerMessageHandler,
    unregisterMessageHandler,
    clearMessageHistory,

    // High-level functions
    sendMetricsUpdate,
    sendOrderUpdate,
    sendInventoryUpdate,
    sendAlert,
    sendUserAction,

    // Constants
    MessageTypes,
    ConnectionState,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

// ==================== HOOK ====================
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

// ==================== UTILITY HOOKS ====================

/**
 * Hook to listen for specific message types
 */
export const useWebSocketMessage = (messageType, handler) => {
  const { registerMessageHandler } = useWebSocket();

  useEffect(() => {
    const unregister = registerMessageHandler(messageType, handler);
    return unregister;
  }, [registerMessageHandler, messageType, handler]);
};

/**
 * Hook to send messages with automatic retry
 */
export const useWebSocketSender = () => {
  const { sendMessage, connectionState } = useWebSocket();

  const sendWithRetry = useCallback(
    async (message, maxRetries = 3) => {
      const attemptSend = () => {
        return new Promise((resolve, reject) => {
          if (connectionState === ConnectionState.CONNECTED) {
            const success = sendMessage(message);
            if (success) {
              resolve(true);
            } else {
              reject(new Error('Failed to send message'));
            }
          } else {
            reject(new Error('WebSocket not connected'));
          }
        });
      };

      for (let attempts = 0; attempts < maxRetries; attempts++) {
        try {
          await attemptSend();
          return true;
        } catch (error) {
          if (attempts >= maxRetries - 1) {
            throw error;
          }

          // Wait before retry
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (attempts + 1))
          );
        }
      }

      return false;
    },
    [sendMessage, connectionState]
  );

  return { sendWithRetry };
};

export default WebSocketContext;
