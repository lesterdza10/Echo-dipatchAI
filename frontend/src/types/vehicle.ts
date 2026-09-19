export type VehicleType = "compactor" | "pickup" | "mini-truck" | "dump-truck";

export interface IVehicle {
    owner: string;
    type: VehicleType;
    vehicleModel: string;
    number: string;
    imageUrl?: string;
    baseFare?: number;
    pricePerKm?: number;
    waitingCharge?: number;
    status: "approved" | "pending" | "rejected";
    rejectionReason?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
