import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogComment extends Document {
  blog: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  content: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogCommentSchema = new Schema<IBlogComment>(
  {
    blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const BlogComment: Model<IBlogComment> =
  mongoose.models.BlogComment || mongoose.model<IBlogComment>("BlogComment", BlogCommentSchema);

export default BlogComment;
