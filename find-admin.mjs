import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// Minimal user schema to find admin
const UserSchema = new mongoose.Schema({
  email: String,
  role: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function run() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not defined');
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI);
  const admin = await User.findOne({ role: 'admin' });
  if (admin) {
    console.log(JSON.stringify(admin, null, 2));
  } else {
    console.log('No admin found');
  }
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
