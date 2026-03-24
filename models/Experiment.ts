import mongoose, { Schema, Document } from "mongoose";

export interface IExperiment extends Document {
  entityId: mongoose.Types.ObjectId;
  type: "title" | "thumbnail" | "meta";
  variationA: string;
  variationB: string;
  viewsA: number;
  viewsB: number;
  clicksA: number;
  clicksB: number;
  winner?: "A" | "B";
  isActive: boolean;
}

const ExperimentSchema = new Schema<IExperiment>(
  {
    entityId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["title", "thumbnail", "meta"], required: true },
    variationA: { type: String, required: true },
    variationB: { type: String, required: true },
    viewsA: { type: Number, default: 0 },
    viewsB: { type: Number, default: 0 },
    clicksA: { type: Number, default: 0 },
    clicksB: { type: Number, default: 0 },
    winner: { type: String, enum: ["A", "B"] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Experiment || mongoose.model<IExperiment>("Experiment", ExperimentSchema);
