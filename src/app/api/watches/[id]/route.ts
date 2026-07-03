import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Watch from "@/lib/models/watch";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const watch = await Watch.findById(id);

    if (!watch) {
      return Response.json({ error: "Watch not found" }, { status: 404 });
    }

    return Response.json(watch);
  } catch {
    return Response.json({ error: "Failed to fetch watch" }, { status: 500 });
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
    const watch = await Watch.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!watch) {
      return Response.json({ error: "Watch not found" }, { status: 404 });
    }

    return Response.json(watch);
  } catch {
    return Response.json({ error: "Failed to update watch" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const watch = await Watch.findByIdAndDelete(id);

    if (!watch) {
      return Response.json({ error: "Watch not found" }, { status: 404 });
    }

    return Response.json({ message: "Watch deleted successfully" });
  } catch {
    return Response.json({ error: "Failed to delete watch" }, { status: 500 });
  }
}
