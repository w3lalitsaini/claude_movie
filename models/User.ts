import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: "user" | "admin" | "moderator";
  watchlist: mongoose.Types.ObjectId[];
  favorites: mongoose.Types.ObjectId[];
  isVerified: boolean;
  isBanned: boolean;
  banReason: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin", "moderator"], default: "user" },
    watchlist: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
    favorites: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String, default: "" },
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
