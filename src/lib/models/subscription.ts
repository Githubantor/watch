import mongoose, { Schema } from "mongoose";

export interface ISubscription {
  email: string;
  name: string;
  status: "active" | "cancelled" | "paused";
  subscribedAt: Date;
  cancelledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    email: { type: String, required: true },
    name: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "cancelled", "paused"],
      default: "active",
    },
    subscribedAt: { type: Date, default: Date.now },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

const Subscription =
  mongoose.models.Subscription ?? mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export default Subscription;
