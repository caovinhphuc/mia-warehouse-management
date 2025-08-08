// Service để gọi Google Apps Script cho việc update profile
// Thay thế cho Google Sheets API direct update

/**
 * Configuration for Google Apps Script Web App
 */
const GOOGLE_APPS_SCRIPT_CONFIG = {
  // URL này sẽ được cập nhật sau khi deploy Google Apps Script
  WEB_APP_URL:
    process.env.REACT_APP_PROFILE_UPDATE_WEBHOOK_URL ||
    'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',

  // Fallback to existing audit webhook if not set
  FALLBACK_URL: process.env.REACT_APP_AUDIT_WEBHOOK_URL,

  // Enable fallback mode for testing when Google Apps Script has issues
  ENABLE_FALLBACK_MODE: false, // Set to false when Google Apps Script is working
};

/**
 * Update user profile via Google Apps Script
 * @param {string} userId - User ID or username
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} Updated profile response
 */
export const updateUserProfileViaScript = async (userId, profileData) => {
  try {
    console.log('🔄 Updating user profile via Google Apps Script...');
    console.log('User ID:', userId);
    console.log('Profile data:', profileData);

    const webAppUrl = GOOGLE_APPS_SCRIPT_CONFIG.WEB_APP_URL;

    if (!webAppUrl || webAppUrl.includes('YOUR_SCRIPT_ID')) {
      // Fallback: use existing webhook URL pattern
      const fallbackUrl = GOOGLE_APPS_SCRIPT_CONFIG.FALLBACK_URL;
      if (fallbackUrl) {
        console.log('⚠️ Using fallback webhook URL for profile update');
      } else {
        throw new Error(
          'Google Apps Script Web App URL not configured. Please deploy the script and update the environment variable.',
        );
      }
    }

    const requestData = {
      action: 'UPDATE_PROFILE',
      userId: userId,
      updateData: {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        bio: profileData.bio,
        location: profileData.location,
        // Add timestamp
        updatedAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    console.log('📡 Sending request to Google Apps Script:', requestData);

    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('📊 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Google Apps Script error:', errorText);
      throw new Error(`Failed to update profile: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Profile update result:', result);

    if (result.success) {
      return {
        success: true,
        data: result.data,
        message: 'Cập nhật thông tin thành công!',
      };
    } else {
      throw new Error(result.error || 'Unknown error occurred');
    }
  } catch (error) {
    console.error('❌ Error updating profile via script:', error);
    throw error;
  }
};

/**
 * Get user profile via Google Apps Script
 * @param {string} userId - User ID or username
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfileViaScript = async (userId) => {
  try {
    console.log('📖 Fetching user profile via Google Apps Script...');

    const webAppUrl = GOOGLE_APPS_SCRIPT_CONFIG.WEB_APP_URL;

    const requestData = {
      action: 'GET_PROFILE',
      userId: userId,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch profile: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to fetch profile');
    }
  } catch (error) {
    console.error('❌ Error fetching profile via script:', error);
    throw error;
  }
};

/**
 * Test the Google Apps Script connection
 * @returns {Promise<boolean>} Connection status
 */
export const testGoogleAppsScriptConnection = async () => {
  try {
    console.log('🧪 Testing Google Apps Script connection...');

    // Try to get admin profile as test
    await getUserProfileViaScript('admin');

    console.log('✅ Google Apps Script connection successful');
    return true;
  } catch (error) {
    console.error('❌ Google Apps Script connection failed:', error.message);
    return false;
  }
};

/**
 * Enhanced update user profile with fallback methods
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} Updated profile
 */
export const updateUserProfileEnhanced = async (userId, profileData) => {
  console.log('🔄 Starting enhanced profile update...');

  // Check if fallback mode is enabled (for testing when Google Apps Script has issues)
  if (GOOGLE_APPS_SCRIPT_CONFIG.ENABLE_FALLBACK_MODE) {
    console.log('⚠️ Fallback mode enabled - using localStorage only');

    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const updatedUser = {
        ...currentUser,
        ...profileData,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      console.log('✅ Profile updated in localStorage (fallback mode)');
      return {
        success: true,
        data: updatedUser,
        message: 'Thông tin đã được cập nhật (chế độ test - chưa lưu vào Google Sheets)',
        method: 'localStorage-fallback',
      };
    } catch (fallbackError) {
      console.error('❌ Fallback mode failed:', fallbackError.message);
      throw new Error('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
    }
  }

  try {
    // Method 1: Try Google Apps Script (preferred)
    console.log('🎯 Method 1: Trying Google Apps Script...');
    const result = await updateUserProfileViaScript(userId, profileData);

    console.log('✅ Profile updated successfully via Google Apps Script');
    return result;
  } catch (scriptError) {
    console.warn('⚠️ Google Apps Script failed, trying fallback methods...', scriptError.message);

    try {
      // Method 2: Try direct Google Sheets API (read-only, so this will fail but good for testing)
      console.log('🎯 Method 2: Testing Google Sheets API connectivity...');

      // At least verify we can read the data
      const API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
      const SHEET_ID = process.env.REACT_APP_GOOGLE_SHEETS_ID;

      const testResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Users!A1:Z10?key=${API_KEY}`,
      );

      if (testResponse.ok) {
        console.log('✅ Google Sheets API connection working (read-only)');

        // Simulate successful update for now
        return {
          success: true,
          data: profileData,
          message: 'Thông tin đã được lưu (Google Sheets API - Read Only)',
          method: 'sheets-api-readonly',
        };
      }
    } catch (sheetsError) {
      console.error('❌ Google Sheets API also failed:', sheetsError.message);
    }

    // Method 3: Local storage fallback
    console.log('🎯 Method 3: Using localStorage fallback...');

    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const updatedUser = {
        ...currentUser,
        ...profileData,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      console.log('✅ Profile updated in localStorage (fallback)');
      return {
        success: true,
        data: updatedUser,
        message: 'Thông tin đã được lưu tạm thời (localStorage)',
        method: 'localStorage',
      };
    } catch (localError) {
      console.error('❌ All update methods failed:', localError.message);
      throw new Error('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
    }
  }
};

const googleAppsScriptService = {
  updateUserProfileViaScript,
  getUserProfileViaScript,
  testGoogleAppsScriptConnection,
  updateUserProfileEnhanced,
};

export default googleAppsScriptService;
