// src/services/authApi.js
const SHEET_API_URL =
  'https://script.google.com/macros/s/AKfycbwQdC5ZTkD71xEDWPApkkbp5oyS7M4ijwmcCFKAtYqin75dssevjkfFgpEq1O2Xyils/exec'; // 👈 thay bằng URL Google Script Web App

export async function login({ username, password }) {
  const response = await fetch(SHEET_API_URL, {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: { 'Content-Type': 'application/json' },
  });

  return await response.json();
}
