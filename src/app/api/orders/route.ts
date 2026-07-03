import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/order";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    const mapped = orders.map((o) => ({
      id: o._id.toString(),
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      items: o.items,
      total: o.total,
      status: o.status,
      shippingAddress: o.shippingAddress,
      createdAt: o.createdAt,
    }));
    return Response.json(mapped);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const order = await Order.create(body);
    return Response.json(order, { status: 201 });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
