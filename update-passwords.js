// ============================================================
// update-passwords.js
// Script untuk update password hash di database
// Run: node update-passwords.js
// ============================================================

const bcrypt = require('bcrypt');
const pool = require('./config/db');

async function updatePasswords() {
  try {
    console.log('========================================');
    console.log('Update Password Hash untuk Users');
    console.log('========================================\n');

    const plainPassword = 'password123';
    const saltRounds = 10;

    console.log('Generating password hash...');
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    
    console.log('Plain Password:', plainPassword);
    console.log('Hashed Password:', hashedPassword);
    console.log('\nUpdating database...');

    // Update semua user dengan password yang sama
    const [result] = await pool.query(
      'UPDATE users SET password = ? WHERE username IN (?, ?, ?)',
      [hashedPassword, 'admin', 'kasir1', 'kasir2']
    );

    console.log(`✅ ${result.affectedRows} users updated successfully!\n`);

    // Verify by listing users
    const [users] = await pool.query('SELECT id, username, nama_lengkap, role FROM users');
    
    console.log('Current Users:');
    console.log('========================================');
    users.forEach(user => {
      console.log(`${user.username} (${user.role}) - ${user.nama_lengkap}`);
    });
    console.log('========================================');
    console.log('\n✅ All passwords updated to: password123');
    console.log('You can now login with these credentials.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating passwords:', error.message);
    process.exit(1);
  }
}

updatePasswords();
