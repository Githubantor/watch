import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Watch from "@/lib/models/watch";
import { seedIfEmpty } from "@/lib/seed";

export async function GET() {
  try {
    await connectDB();
    await seedIfEmpty();
    const watches = await Watch.find().sort({ createdAt: -1 }).lean();
    const mapped = watches.map((w) => ({
      id: w._id.toString(),
      name: w.name,
      collection: w.collection,
      price: w.price,
      description: w.description,
      specs: w.specs,
      image: w.image,
      accent: w.accent,
      featured: w.featured,
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
    const watch = await Watch.create(body);
    return Response.json(watch, { status: 201 });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
