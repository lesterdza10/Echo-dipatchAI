import mongoose from "mongoose";
export interface IPartnerDocs {
    owner: mongoose.Types.ObjectId;
    status: "approved" | "pending" | "rejected"
    aadharUrl: string;
    rcUrl: string;
    licenceUrl: string;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}
const PartnerDocsSchema = new mongoose.Schema<IPartnerDocs>({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["approved", "pending", "rejected"], default: "pending" },
    rejectionReason: { type: String },
    aadharUrl: { type: String, required: true },
    rcUrl: { type: String, required: true },
    licenceUrl: { type: String, required: true },
}, { timestamps: true })
const PartnerDocs = mongoose.models.PartnerDocs || mongoose.model<IPartnerDocs>("PartnerDocs", PartnerDocsSchema);
export default PartnerDocs