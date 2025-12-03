#!/usr/bin/env node

/**
 * 🔓 Reset Login Block Script
 * Xóa login block để có thể đăng nhập lại ngay lập tức
 */

console.log('🔓 Reset Login Block...\n');

// Instructions for user
console.log('📋 Để reset login block, mở browser console và chạy:');
console.log('');
console.log('   localStorage.removeItem("loginBlock");');
console.log('');
console.log('Hoặc mở Developer Tools (F12) > Console và paste command trên.\n');

console.log('✅ Sau đó refresh trang và đăng nhập lại.\n');

// Alternative: Create a bookmarklet
const bookmarklet = `javascript:(function(){localStorage.removeItem('loginBlock');alert('Login block đã được reset! Refresh trang để áp dụng.');})();`;

console.log('📖 Hoặc tạo bookmarklet:');
console.log('   1. Copy code này:');
console.log(`   ${bookmarklet}`);
console.log('   2. Tạo bookmark mới trong browser');
console.log('   3. Paste code vào URL của bookmark');
console.log('   4. Click bookmark khi cần reset\n');

