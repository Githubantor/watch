import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Watch from "@/lib/models/watch";

export async function GET() {
  try {
    await connectDB();
    const watches = await Watch.find().sort({ createdAt: -1 });
    return Response.json(watches);
  } catch {
    return Response.json({ error: "Failed to fetch watches" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const watch = await Watch.create(body);
    return Response.json(watch, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create watch" }, { status: 500 });
  }
}
