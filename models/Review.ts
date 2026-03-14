import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  movie: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  title?: string;
  content?: string;
  isApproved: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    title: { type: String, required: false, trim: true, default: "" },
    content: { type: String, required: false, default: "" },
    isApproved: { type: Boolean, default: true },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ReviewSchema.index({ movie: 1, user: 1 }, { unique: true });

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
