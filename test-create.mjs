
import mongoose from 'mongoose';
const uri = 'mongodb+srv://sainilalit082_db_user:LbDGhuMIZaLvrdUs@cluster01.wvaap9s.mongodb.net/?appName=Cluster01';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  isVerified: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  banReason: { type: String, default: '' },
  bio: { type: String, default: '' },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function run() {
  try {
    await mongoose.connect(uri);
    await User.deleteMany({ email: 'test_create@example.com' });
    
    console.log('Creating user...');
    const user = await User.create({
      name: 'Test Create',
      email: 'test_create@example.com',
      password: 'hashedpassword123',
      isVerified: true,
    });
    console.log('Success:', user._id);
  } catch (err) {
    console.error('Error creating user:', err.message);
    if (err.errors) {
      console.error(err.errors);
    }
  } finally {
    await mongoose.disconnect();
  }
}
run();

