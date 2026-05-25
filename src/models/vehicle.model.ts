import mongoose from "mongoose";
type vehicleType = "bike" | "car" | "van" | "truck" | "loading" | "Jeep";
interface IVehicle {
  owner: mongoose.Types.ObjectId;
  type: vehicleType;
  vehicleModel: string;
  number: string;
  imageUrl?: string;
  baseFare?: number;
  pricePerKm?: number;
  waitingCharge?: number;
  status: "approved" | "pending" | "rejected";
  rejectionReason?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const vehicleSchema = new mongoose.Schema<IVehicle>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["bike", "car", "van", "truck", "loading", "Jeep"],
      required: true,
    },
    vehicleModel: { type: String, required: true },
    number: { type: String, required: true, unique: true },
    imageUrl: { type: String },
    baseFare: { type: Number },
    pricePerKm: { type: Number },
    waitingCharge: { type: Number },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
const Vehicle =
  mongoose.models.Vehicle || mongoose.model<IVehicle>("Vehicle", vehicleSchema);
export default Vehicle;
