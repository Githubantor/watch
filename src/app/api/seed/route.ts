import connectDB from "@/lib/mongodb";
import Watch from "@/lib/models/watch";
import { products } from "@/lib/products";

export async function POST() {
  try {
    const db = await connectDB();
    if (!db) return Response.json({ error: "Database unavailable" }, { status: 503 });
    await Watch.deleteMany({});
    const watches = await Watch.insertMany(
      products.map((p) => ({
        name: p.name,
        collection: p.collection,
        price: p.price,
        description: p.description,
        specs: p.specs,
        image: p.image,
        accent: p.accent,
        featured: p.featured,
      }))
    );
    return Response.json({ message: "Database seeded", count: watches.length });
  } catch {
    return Response.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
