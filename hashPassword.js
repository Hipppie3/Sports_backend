import bcrypt from 'bcrypt';

const password = 'daniel';
bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});
