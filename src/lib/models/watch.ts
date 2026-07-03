import mongoose, { Schema } from "mongoose";

export interface IWatch {
  name: string;
  collection: string;
  price: number;
  description: string;
  specs: string[];
  image: string;
  accent: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WatchSchema = new Schema<IWatch>(
  {
    name: { type: String, required: true },
    collection: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    specs: [{ type: String }],
    image: { type: String, required: true },
    accent: { type: String, required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

const Watch = mongoose.models.Watch ?? mongoose.model<IWatch>("Watch", WatchSchema);

export default Watch;
