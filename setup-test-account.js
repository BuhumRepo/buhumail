// Quick script to create test account
const testAccount = {
  email: 'test@buhumail.com',
  password: 'Test123456',
  name: 'Test User'
};

console.log('='.repeat(50));
console.log('TEST ACCOUNT CREDENTIALS');
console.log('='.repeat(50));
console.log('Email:    ', testAccount.email);
console.log('Password: ', testAccount.password);
console.log('Name:     ', testAccount.name);
console.log('='.repeat(50));
console.log('\nTo login:');
console.log('1. Go to http://localhost:3000/login');
console.log('2. Use the credentials above');
console.log('3. Click "Sign In"');
console.log('\nAlternatively, register manually at:');
console.log('http://localhost:3000/register');
console.log('='.repeat(50));
