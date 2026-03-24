import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MovieSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  poster: String,
  releaseYear: Number,
  genres: [String],
  category: String,
  isTrending: Boolean,
  status: { type: String, default: 'active' },
  metaTitle: String,
  metaDescription: String,
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  excerpt: String,
  content: String,
  featuredImage: String,
  author: mongoose.Types.ObjectId,
  tags: [String],
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
}, { timestamps: true });

const UserSchema = new mongoose.Schema({ email: String, role: String });

const Movie = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);
const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function run() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI missing');
  await mongoose.connect(MONGODB_URI);

  const admin = await User.findOne({ role: 'admin' });
  if (!admin) throw new Error('No admin user found');

  console.log('Uploading poster to Cloudinary...');
  // Assuming the image path from earlier
  const imagePath = 'C:\\Users\\saini\\.gemini\\antigravity\\brain\\fffe905b-a583-44cb-bb3d-329b44ccecdc\\project_hail_mary_poster_1774264913047.png';
  const uploadResult = await cloudinary.uploader.upload(imagePath, { folder: 'cineverse' });
  const posterUrl = uploadResult.secure_url;
  console.log('Poster uploaded:', posterUrl);

  console.log('Creating movie...');
  const movie = await Movie.create({
    title: 'Project Hail Mary',
    slug: 'project-hail-mary',
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. With his life on the line and his memories slowly returning, he must use every bit of his scientific knowledge and wit to save the world.',
    poster: posterUrl,
    releaseYear: 2026,
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    category: 'hollywood',
    isTrending: true,
    metaTitle: 'Project Hail Mary (2026) - Watch Online and Download',
    metaDescription: 'Discover the sci-fi event of 2026. Watch Project Hail Mary online and learn why it is a must-watch for every science fiction fan.',
  });
  console.log('Movie created:', movie.title);

  console.log('Creating blog post...');
  const blog = await Blog.create({
    title: 'Why Project Hail Mary is the Science Fiction Event of 2026',
    slug: 'why-project-hail-mary-is-the-scifi-event-of-2026',
    excerpt: 'An in-depth look at why Andy Weir’s latest adaptation is set to redefine sci-fi cinema this year.',
    content: `
      <h2>The Return of Andy Weir</h2>
      <p>Following the massive success of <i>The Martian</i>, expectations were sky-high for any future Andy Weir adaptations. <i>Project Hail Mary</i> does not just meet those expectations; it orbits them.</p>
      
      <h2>A Visual Masterpiece</h2>
      <p>Starring Ryan Gosling and directed by Phil Lord and Christopher Miller, the film brings the vastness of interstellar space to life with stunning realism.</p>
      
      <h2>Why You Should Watch It</h2>
      <p>From the hard-science challenges to the emotional core of the story, Project Hail Mary is a celebration of human (and non-human) ingenuity.</p>
      
      <p>Check out our latest movie listing for Project Hail Mary and stay tuned for more updates!</p>
    `,
    featuredImage: posterUrl,
    author: admin._id,
    tags: ['Sci-Fi', 'Andy Weir', 'Ryan Gosling', '2026 Movies'],
    status: 'published',
  });
  console.log('Blog created:', blog.title);

  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
