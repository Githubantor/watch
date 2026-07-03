import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/order";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const order = await Order.findById(id);
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }
    return Response.json(order);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();
    const order = await Order.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }
    return Response.json(order);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }
    return Response.json({ message: "Order deleted successfully" });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
