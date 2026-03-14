
import mongoose from 'mongoose';
const uri = 'mongodb+srv://sainilalit082_db_user:LbDGhuMIZaLvrdUs@cluster01.wvaap9s.mongodb.net/?appName=Cluster01';

async function run() {
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    
    // List indexes
    console.log('Indexes before:');
    const indexes = await db.collection('users').indexes();
    console.log(indexes.map(i => i.name));
    
    // Drop username_1 if it exists
    if (indexes.some(i => i.name === 'username_1')) {
      console.log('Dropping username_1 index...');
      await db.collection('users').dropIndex('username_1');
      console.log('Dropped!');
    }
    
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}
run();

