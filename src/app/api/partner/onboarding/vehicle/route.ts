import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import User from "@/models/usermodel";
import Vehicle from "@/models/vehicle.model";


const regex = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/i;
export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 400,
      });
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const { type, number, vehicleModel } = await request.json();
    if (!type || !number || !vehicleModel) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 },
      );
    }
    if (!regex.test(number)) {
      return new Response(JSON.stringify({ message: "Invalid vehicle number" }), {
        status: 400,
      });
    }
    const vehicle_number = number.toUpperCase();
    const duplicateVehicle = await Vehicle.findOne({ number: vehicle_number });
    if (duplicateVehicle) {
      return new Response(JSON.stringify({ message: "Vehicle number already exists" }), {
        status: 400,
      });
    }



    let vehicle = await Vehicle.findOne({ owner: session.user.id });
    if (vehicle) {
      vehicle.type = type;
      vehicle.number = vehicle_number;
      vehicle.vehicleModel = vehicleModel;
      vehicle.status = "pending";
      await vehicle.save();
      return new Response(JSON.stringify({ message: "Vehicle updated successfully" }), {
        status: 200,
      });
    }
    vehicle = await Vehicle.create({
      type,
      number: vehicle_number,
      vehicleModel,
    });

    if (!user?.partnerOnboardingSteps || user.partnerOnboardingSteps < 1) {
      user.partnerOnboardingSteps = 1;
    }
    user.role = "partner";
    await user.save();


    return new Response(JSON.stringify({ message: "Vehicle created successfully" }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
export async function GET(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 400,
      });
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    let vehicle = await Vehicle.findOne({ owner: session.user.id });
    if (vehicle) {
      return new Response(JSON.stringify({ vehicle }), {
        status: 200,
      });
    }
  }
  catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });

  }
}
