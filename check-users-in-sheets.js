#!/usr/bin/env node

/**
 * 🔍 Check Users in Google Sheets
 * Kiểm tra danh sách users trong Google Sheets để tìm username/password đúng
 */

const https = require('https');

const CONFIG = {
  SHEET_ID: '1m2B2ODXuuatnW0EKExdVeCa1WwvF52bZOhS7DGqG6Vg',
  API_KEY: 'AIzaSyB_MwjhFxQtxnihpZTa95XH0BCI9MXihh8',
};

function fetchGoogleSheets(range) {
  return new Promise((resolve, reject) => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${range}?key=${CONFIG.API_KEY}`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function checkUsers() {
  console.log('🔍 Kiểm tra users trong Google Sheets...\n');
  console.log(`📊 Sheet ID: ${CONFIG.SHEET_ID}\n`);

  try {
    const data = await fetchGoogleSheets('Users!A:H');

    if (!data.values || data.values.length === 0) {
      console.log('❌ Không có dữ liệu users trong Google Sheets');
      console.log('💡 Bạn cần tạo user trong sheet Users!');
      return;
    }

    console.log(`✅ Tìm thấy ${data.values.length - 1} user(s) (không tính header)\n`);
    console.log('📋 Danh sách users:\n');

    const headers = data.values[0];
    console.log('Headers:', headers.join(' | '));
    console.log('-'.repeat(80));

    data.values.slice(1).forEach((row, index) => {
      const user = {
        username: row[0] || '',
        password: row[1] ? '***' + row[1].slice(-2) : '',
        fullName: row[2] || '',
        email: row[3] || '',
        role: row[4] || '',
      };

      console.log(`\nUser ${index + 1}:`);
      console.log(`  Username: ${user.username}`);
      console.log(`  Password: ${user.password} (${row[1] ? row[1].length + ' ký tự' : 'trống'})`);
      console.log(`  Full Name: ${user.fullName}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('🎯 Credentials để thử đăng nhập:\n');

    data.values.slice(1).forEach((row) => {
      const username = row[0] || '';
      const password = row[1] || '';
      if (username && password) {
        console.log(`   Username: ${username}`);
        console.log(`   Password: ${password}`);
        console.log('');
      }
    });

  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra:', error.message);
    console.log('\n💡 Có thể:');
    console.log('   - API key không đúng');
    console.log('   - Sheet ID không đúng');
    console.log('   - Sheet "Users" không tồn tại');
    console.log('   - Quyền truy cập bị giới hạn');
  }
}

// Run check
checkUsers();
