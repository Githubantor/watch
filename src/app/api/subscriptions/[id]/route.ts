import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscription from "@/lib/models/subscription";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const sub = await Subscription.findById(id);
    if (!sub) {
      return Response.json({ error: "Subscription not found" }, { status: 404 });
    }
    return Response.json(sub);
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
    if (body.status === "cancelled" && !body.cancelledAt) {
      body.cancelledAt = new Date();
    }
    const sub = await Subscription.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!sub) {
      return Response.json({ error: "Subscription not found" }, { status: 404 });
    }
    return Response.json(sub);
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
    const sub = await Subscription.findByIdAndDelete(id);
    if (!sub) {
      return Response.json({ error: "Subscription not found" }, { status: 404 });
    }
    return Response.json({ message: "Subscription deleted successfully" });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
