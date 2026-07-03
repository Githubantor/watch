import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscription from "@/lib/models/subscription";

export async function GET() {
  try {
    await connectDB();
    const subs = await Subscription.find().sort({ subscribedAt: -1 }).lean();
    const mapped = subs.map((s) => ({
      id: s._id.toString(),
      email: s.email,
      name: s.name,
      status: s.status,
      subscribedAt: s.subscribedAt,
      cancelledAt: s.cancelledAt,
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
    const sub = await Subscription.create(body);
    return Response.json(sub, { status: 201 });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
