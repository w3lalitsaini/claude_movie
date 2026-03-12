import mongoose, { Schema, Document } from "mongoose";

export interface IMedia extends Document {
  url: string;
  name: string;
  size: number;
  publicId: string;
  format: string;
  createdAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    publicId: { type: String, required: true },
    format: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.Media ||
  mongoose.model<IMedia>("Media", MediaSchema);
