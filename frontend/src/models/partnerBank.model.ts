import mongoose from "mongoose";
export interface IPartnerBank {
  owner: mongoose.Types.ObjectId;
  accountHolderName: string;
  upi?: string;
  accountNumber: string;
  ifscCode: string;
  status: "not_added" | "added" | "verified";
  createdAt: Date;
  updatedAt: Date;
}
const PartnerBankSchema = new mongoose.Schema<IPartnerBank>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["not_added", "added", "verified"],
      default: "not_added",
    },
    accountHolderName: { type: String, required: true },
    upi: { type: String },
    accountNumber: { type: String, required: true, unique: true },
    ifscCode: { type: String, required: true, uppercase: true },
  },
  { timestamps: true },
);
const PartnerBank =
  mongoose.models.PartnerBank ||
  mongoose.model<IPartnerBank>("PartnerBank", PartnerBankSchema);
export default PartnerBank;
