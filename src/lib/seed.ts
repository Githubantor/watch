import connectDB from "@/lib/mongodb";
import Watch from "@/lib/models/watch";
import { products } from "@/lib/products";

export async function seedIfEmpty() {
  const db = await connectDB();
  if (!db) return;
  const count = await Watch.countDocuments();
  if (count > 0) return;
  await Watch.insertMany(
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
}
