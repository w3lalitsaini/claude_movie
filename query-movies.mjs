import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const MovieSchema = new mongoose.Schema({
  title: String,
  slug: String,
  releaseYear: Number,
  category: String,
  isTrending: Boolean,
  status: String,
}, { timestamps: true });

const Movie = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);

async function run() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not defined');
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI);
  const movies = await Movie.find().sort({ createdAt: -1 }).limit(10);
  console.log(JSON.stringify(movies, null, 2));
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
