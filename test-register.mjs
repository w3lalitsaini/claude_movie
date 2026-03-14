import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/atozmovies';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db();
    
    // Clean old
    await db.collection('otps').deleteMany({ email: 'test_user500@example.com' });
    await db.collection('users').deleteMany({ email: 'test_user500@example.com' });
    
    // Hash password & otp
    const hashedOtp = await bcrypt.hash('123456', 10);
    
    // Insert OTP
    await db.collection('otps').insertOne({
      email: 'test_user500@example.com',
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5*60*1000)
    });
    
    console.log('Inserted OTP, now calling API...');

    const res = await fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test_user500@example.com',
        password: 'password123',
        otp: '123456'
      })
    });
    
    console.log('API Status:', res.status);
    const data = await res.json();
    console.log('API Response:', data);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();

