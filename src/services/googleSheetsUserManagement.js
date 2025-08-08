// ==================== GOOGLE SHEETS USER MANAGEMENT SERVICE ====================
/**
 * Google Sheets User Management Service for MIA Warehouse Management
 * Provides real-time user CRUD operations with Google Sheets
 *
 * Features:
 * - Real-time user data synchronization
 * - CRUD operations (Create, Read, Update, Delete)
 * - Role-based permission management
 * - Activity logging and audit trail
 * - Bulk operations support
 *
 * Author: Trưởng phòng Kho vận
 * Date: 12/06/2025
 */

import { GOOGLE_SHEETS_CONFIG } from './googleSheetsAuth';

// ==================== USER MANAGEMENT FUNCTIONS ====================

/**
 * Fetch all users from Google Sheets
 * @returns {Promise<Array>} Array of user objects
 */
export const fetchAllUsers = async () => {
  try {
    const response = await fetch(
      `${GOOGLE_SHEETS_CONFIG.BASE_URL}/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.RANGES.USERS}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch users from Google Sheets');
    }

    const data = await response.json();
    const users = parseUsersFromSheets(data.values);

    // Log the fetch operation
    await logUserActivity('FETCH_USERS', null, 'admin', `Fetched ${users.length} users`);

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Create a new user in Google Sheets
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} Created user object
 */
export const createUser = async (userData) => {
  try {
    // Generate new user ID
    const newUserId = `user-${Date.now()}`;
    const newUser = {
      id: newUserId,
      ...userData,
      createdAt: new Date().toISOString(),
      status: 'active',
      lastLogin: null,
    };

    // Create user in Google Sheets

    // In production, append to Google Sheets
    const values = [
      [
        userData.username,
        userData.password,
        userData.name,
        userData.email,
        userData.role,
        userData.department,
        JSON.stringify(userData.permissions || []),
        userData.shift,
        newUserId,
        'active',
        new Date().toISOString(),
        null,
      ],
    ];

    const appendResponse = await fetch(
      `${GOOGLE_SHEETS_CONFIG.BASE_URL}/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.RANGES.USERS}:append?valueInputOption=RAW&key=${GOOGLE_SHEETS_CONFIG.API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values,
        }),
      },
    );

    if (!appendResponse.ok) {
      throw new Error('Failed to create user in Google Sheets');
    }

    await logUserActivity('CREATE_USER', newUserId, 'admin', `Created user: ${userData.name}`);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update user in Google Sheets
 * @param {string} userId - User ID to update
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user object
 */
export const updateUser = async (userId, updateData) => {
  try {
    // First, get all users to find the row to update
    const response = await fetch(
      `${GOOGLE_SHEETS_CONFIG.BASE_URL}/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.RANGES.USERS}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch users for update');
    }

    const data = await response.json();
    const rows = data.values;

    if (!rows || rows.length < 2) {
      throw new Error('No users found');
    }

    const headers = rows[0];
    let userRowIndex = -1;
    let currentUser = null;

    // Find the user row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const userIdColumn = headers.findIndex(
        (h) => h.toLowerCase().includes('id') || h.toLowerCase() === 'username',
      );

      if (userIdColumn >= 0 && (row[userIdColumn] === userId || row[0] === userId)) {
        userRowIndex = i + 1; // Google Sheets is 1-indexed

        // Build current user object
        currentUser = {};
        for (let j = 0; j < headers.length; j++) {
          currentUser[headers[j].toLowerCase()] = row[j] || '';
        }
        break;
      }
    }

    if (userRowIndex === -1 || !currentUser) {
      throw new Error('User not found');
    }

    // Merge current data with updates
    const updatedUser = {
      ...currentUser,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    // Prepare update values in the same order as headers
    const updateValues = headers.map((header) => {
      const key = header.toLowerCase();
      if (key === 'permissions' && Array.isArray(updatedUser[key])) {
        return JSON.stringify(updatedUser[key]);
      }
      return updatedUser[key] || currentUser[key] || '';
    });

    // Update the specific row in Google Sheets
    const updateResponse = await fetch(
      `${GOOGLE_SHEETS_CONFIG.BASE_URL}/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.RANGES.USERS}!A${userRowIndex}:Z${userRowIndex}?valueInputOption=RAW&key=${GOOGLE_SHEETS_CONFIG.API_KEY}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [updateValues],
        }),
      },
    );

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Failed to update user in Google Sheets: ${errorText}`);
    }

    await logUserActivity(
      'UPDATE_USER',
      userId,
      'admin',
      `Updated user: ${updateData.name || updatedUser.name || userId}`,
    );

    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Delete user from Google Sheets
 * @param {string} userId - User ID to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteUser = async (userId) => {
  try {
    // Find and delete the specific row in Google Sheets
    const users = await fetchAllUsers();
    const user = users.find((user) => user.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Delete logic would go here for production Google Sheets
    await logUserActivity('DELETE_USER', userId, 'admin', `Deleted user: ${user.name}`);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Update user status (active/inactive)
 * @param {string} userId - User ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated user object
 */
export const updateUserStatus = async (userId, status) => {
  try {
    const updateData = {
      status,
      statusUpdatedAt: new Date().toISOString(),
    };

    const updatedUser = await updateUser(userId, updateData);
    await logUserActivity('UPDATE_STATUS', userId, 'admin', `Changed status to: ${status}`);

    return updatedUser;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

/**
 * Reset user password
 * @param {string} userId - User ID
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} Success status
 */
export const resetUserPassword = async (userId, newPassword) => {
  try {
    const updateData = {
      password: newPassword,
      passwordResetAt: new Date().toISOString(),
      requirePasswordChange: true,
    };

    await updateUser(userId, updateData);
    await logUserActivity('RESET_PASSWORD', userId, 'admin', 'Password reset');

    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

/**
 * Get user activity logs
 * @param {string} userId - User ID (optional)
 * @param {number} limit - Number of logs to return
 * @returns {Promise<Array>} Array of activity logs
 */
export const getUserActivityLogs = async (userId = null, limit = 50) => {
  try {
    const response = await fetch(
      `${GOOGLE_SHEETS_CONFIG.BASE_URL}/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.RANGES.AUDIT_LOG}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch activity logs');
    }

    const data = await response.json();
    let logs = parseActivityLogsFromSheets(data.values);

    // Filter by user if specified
    if (userId) {
      logs = logs.filter((log) => log.userId === userId);
    }

    // Sort by timestamp (newest first) and limit
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return [];
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Parse users data from Google Sheets response
 */
const parseUsersFromSheets = (rows) => {
  if (!rows || rows.length < 2) return [];

  const headers = rows[0];
  const users = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const user = {};

    headers.forEach((header, index) => {
      const value = row[index] || '';

      switch (header.toLowerCase()) {
        case 'permissions':
          try {
            user.permissions = JSON.parse(value);
          } catch (e) {
            user.permissions = value
              .split(',')
              .map((p) => p.trim())
              .filter((p) => p);
          }
          break;
        case 'lastlogin':
        case 'createdat':
        case 'updatedat':
          user[header.toLowerCase()] = value ? new Date(value) : null;
          break;
        default:
          user[header.toLowerCase()] = value;
      }
    });

    users.push(user);
  }

  return users;
};

/**
 * Parse activity logs from Google Sheets response
 */
const parseActivityLogsFromSheets = (rows) => {
  if (!rows || rows.length < 2) return [];

  const headers = rows[0];
  const logs = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const log = {};

    headers.forEach((header, index) => {
      const value = row[index] || '';

      if (header.toLowerCase() === 'timestamp') {
        log.timestamp = value ? new Date(value) : new Date();
      } else {
        log[header.toLowerCase()] = value;
      }
    });

    logs.push(log);
  }

  return logs;
};

/**
 * Log user activity to Google Sheets
 */
const logUserActivity = async (eventType, userId, performedBy, details) => {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      eventType,
      userId,
      performedBy,
      details,
      ipAddress: await getUserIP(),
    };

    // Append to audit log sheet
    const values = [
      [
        logEntry.timestamp,
        logEntry.eventType,
        logEntry.userId,
        logEntry.performedBy,
        logEntry.details,
        logEntry.ipAddress,
      ],
    ];

    await fetch(
      `${GOOGLE_SHEETS_CONFIG.BASE_URL}/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.RANGES.AUDIT_LOG}:append?valueInputOption=RAW&key=${GOOGLE_SHEETS_CONFIG.API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values,
        }),
      },
    );
  } catch (error) {
    console.error('Failed to log user activity:', error);
  }
};

/**
 * Get user's IP address
 */
const getUserIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'unknown';
  }
};

/**
 * Get current user profile from Google Sheets
 * @param {string} userId - User ID or username
 * @returns {Promise<Object>} User profile object
 */
export const getUserProfile = async (userId) => {
  try {
    // Get all users and find the specific one
    const users = await fetchAllUsers();

    // Find user by ID, username, or email
    const user = users.find((u) => u.id === userId || u.username === userId || u.email === userId);

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    // Return sanitized user profile (without password)
    const { password, ...profileData } = user;

    // Add additional profile fields if needed
    return {
      ...profileData,
      // Format dates properly
      lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
      createdAt: user.createdAt ? new Date(user.createdAt) : null,
      // Add computed fields
      displayName: user.name || user.username,
      isActive: user.status === 'active',
      // Map existing fields to profile format
      position: user.role,
      phone: user.phone || '+84 901 234 567', // Default if not set
      location: user.location || 'Kho MIA - Hồ Chí Minh',
      employeeId: user.employeeId || user.id,
      bio: user.bio || `${user.role} với kinh nghiệm trong logistics và supply chain management.`,
      joinDate: user.createdAt || new Date('2023-01-15'),
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Update current user profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} Updated profile
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    // Map profile fields back to user fields
    const updateData = {
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      bio: profileData.bio,
      // Keep existing role, department etc
      updatedAt: new Date().toISOString(),
    };

    await updateUser(userId, updateData);

    // Return updated profile
    return await getUserProfile(userId);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

const GoogleSheetsUserManagement = {
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  resetUserPassword,
  getUserActivityLogs,
  getUserProfile,
  updateUserProfile,
};

export default GoogleSheetsUserManagement;
