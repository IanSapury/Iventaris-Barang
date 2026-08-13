// ============================================================
// generate-password.js
// Script untuk generate password hash bcrypt
// Usage: node generate-password.js
// ============================================================

const bcrypt = require('bcrypt');

async function generatePassword() {
  const password = 'password123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('========================================');
  console.log('Password Hash Generator');
  console.log('========================================');
  console.log('Plain Password:', password);
  console.log('Bcrypt Hash:', hash);
  console.log('========================================');
  console.log('\nUpdate SQL command:');
  console.log(`UPDATE users SET password = '${hash}' WHERE username IN ('admin', 'kasir1', 'kasir2');`);
  console.log('========================================');
}

generatePassword();
