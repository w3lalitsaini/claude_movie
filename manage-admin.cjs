const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, default: 'user' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function run() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not defined');
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI);
  let admin = await User.findOne({ role: 'admin' });
  
  if (!admin) {
    console.log('No admin found, creating one...');
    admin = await User.create({
      name: 'AI Manager',
      email: 'ai_manager@cineverse.com',
      role: 'admin'
    });
    console.log('Admin created:', admin._id);
  } else {
    console.log('Admin found:', admin._id);
  }
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
