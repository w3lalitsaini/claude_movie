import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMovie extends Document {
  title: string;
  slug: string;
  description: string;
  poster: string;
  backdrop: string;
  gallery: string[];
  trailerUrl: string;
  releaseYear: number;
  duration: number;
  rating: number;
  imdbRating: number;
  genres: string[];
  language: string;
  quality: string[];
  category: string;
  cast: { name: string; character: string; photo: string }[];
  director: string;
  downloadLinks: { quality: string; size: string; url: string }[];
  isTrending: boolean;
  isFeatured: boolean;
  isTopRated: boolean;
  views: number;
  reviewCount: number;
  status: "active" | "inactive";
  platform: string;
  metaTitle: string;
  metaDescription: string;
  aiMetadata?: {
    seoScore: number;
    trendScore: number;
    revenueGenerated: number;
    lastAgentAction: string;
  };
  humanApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    poster: { type: String, required: true },
    backdrop: { type: String, default: "" },
    gallery: [{ type: String }],
    trailerUrl: { type: String, default: "" },
    releaseYear: { type: Number, required: true },
    duration: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 10 },
    imdbRating: { type: Number, default: 0, min: 0, max: 10 },
    genres: [{ type: String }],
    language: { type: String, default: "Hindi" },
    quality: [{ type: String }],
    category: {
      type: String,
      enum: ["bollywood", "hollywood", "south-hindi", "dual-audio", "web-series"],
      required: true,
    },
    cast: [
      {
        name: { type: String },
        character: { type: String },
        photo: { type: String },
      },
    ],
    director: { type: String, default: "" },
    downloadLinks: [
      {
        quality: { type: String },
        size: { type: String },
        url: { type: String },
      },
    ],
    isTrending: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isTopRated: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    platform: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    aiMetadata: {
      seoScore: { type: Number, default: 0 },
      trendScore: { type: Number, default: 0 },
      revenueGenerated: { type: Number, default: 0 },
      lastAgentAction: { type: String, default: "" },
    },
    humanApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

MovieSchema.index({ title: "text", description: "text" }, { default_language: "none", language_override: "dummy_field" });
MovieSchema.index({ category: 1 });
MovieSchema.index({ genres: 1 });
MovieSchema.index({ isTrending: 1 });
MovieSchema.index({ isFeatured: 1 });
MovieSchema.index({ createdAt: -1 });

const Movie: Model<IMovie> =
  mongoose.models.Movie || mongoose.model<IMovie>("Movie", MovieSchema);

export default Movie;
