import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRevenue extends Document {
  amount: number;
  source: "adsense" | "amazon" | "ott_affiliate" | "sponsorship";
  entityId?: mongoose.Types.ObjectId;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RevenueSchema = new Schema<IRevenue>(
  {
    amount: { type: Number, required: true },
    source: { 
      type: String, 
      required: true, 
      enum: ["adsense", "amazon", "ott_affiliate", "sponsorship"] 
    },
    entityId: { type: Schema.Types.ObjectId },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Revenue: Model<IRevenue> =
  mongoose.models.Revenue || mongoose.model<IRevenue>("Revenue", RevenueSchema);

export default Revenue;
