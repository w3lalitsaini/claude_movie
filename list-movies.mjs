import mongoose from 'mongoose';
import Movie from './models/Movie.js'; // Using .js for compatibility with ESM if needed, or I'll just use the file path
import connectDB from './lib/db.js';
import * as dotenv from 'dotenv';
dotenv.config();

async function listMovies() {
  try {
    await connectDB();
    const movies = await Movie.find().sort({ createdAt: -1 }).limit(10).select('title slug releaseYear category');
    console.log(JSON.stringify(movies, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

listMovies();
