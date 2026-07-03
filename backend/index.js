require("dotenv").config({ path: require("path").join(__dirname, "..", ".env.local") });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { execSync } = require("child_process");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

function resolveSRVviaNslookup(hostname) {
  const out = execSync(`nslookup -type=SRV _mongodb._tcp.${hostname}`, {
    encoding: "utf8",
    timeout: 5000,
  });
  const results = [];
  for (const line of out.split("\n")) {
    const match = line.match(/svr hostname\s*=\s*(\S+)/i);
    if (match) {
      results.push({ target: match[1].replace(/\.$/, ""), port: 27017 });
    }
  }
  return results;
}

function parseSRVUri(uri) {
  const match = uri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)(?:\/([^?]+))?(?:\?(.+))?$/);
  if (!match) return null;
  return {
    user: match[1],
    pass: match[2],
    host: match[3],
    db: match[4] || "watch-dealer",
  };
}

function buildDirectURI(hosts, user, pass, db) {
  const hostStr = hosts.map((h) => `${h.target}:${h.port}`).join(",");
  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hostStr}/${db}?ssl=true&authSource=admin&retryWrites=true&w=majority`;
}

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("MONGODB_URI environment variable is not set");
    process.exit(1);
  }

  let uri = MONGODB_URI;
  const parsed = parseSRVUri(MONGODB_URI);

  if (parsed) {
    try {
      const hosts = resolveSRVviaNslookup(parsed.host);
      if (hosts.length > 0) {
        uri = buildDirectURI(hosts, parsed.user, parsed.pass, parsed.db);
        console.log("SRV resolved via nslookup, using direct connection");
      }
    } catch {
      console.warn("nslookup failed, using SRV URI directly");
    }
  }

  await mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    family: 4,
  });
  console.log("Connected to MongoDB");
}

const WatchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    collection: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    specs: [{ type: String }],
    image: { type: String, required: true },
    accent: { type: String, required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Watch = mongoose.models.Watch || mongoose.model("Watch", WatchSchema);

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

const SubscriptionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "cancelled", "paused"],
      default: "active",
    },
    subscribedAt: { type: Date, default: Date.now },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Subscription =
  mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);

app.get("/api/watches", async (req, res) => {
  try {
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
    res.json(mapped);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/watches", async (req, res) => {
  try {
    const watch = await Watch.create(req.body);
    res.status(201).json(watch);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/watches/:id", async (req, res) => {
  try {
    const watch = await Watch.findById(req.params.id);
    if (!watch) return res.status(404).json({ error: "Watch not found" });
    res.json(watch);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/watches/:id", async (req, res) => {
  try {
    const watch = await Watch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!watch) return res.status(404).json({ error: "Watch not found" });
    res.json(watch);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/watches/:id", async (req, res) => {
  try {
    const watch = await Watch.findByIdAndDelete(req.params.id);
    if (!watch) return res.status(404).json({ error: "Watch not found" });
    res.json({ message: "Watch deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
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
    res.json(mapped);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/subscriptions", async (req, res) => {
  try {
    const subs = await Subscription.find().sort({ subscribedAt: -1 }).lean();
    const mapped = subs.map((s) => ({
      id: s._id.toString(),
      email: s.email,
      name: s.name,
      status: s.status,
      subscribedAt: s.subscribedAt,
      cancelledAt: s.cancelledAt,
    }));
    res.json(mapped);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/subscriptions", async (req, res) => {
  try {
    const sub = await Subscription.create(req.body);
    res.status(201).json(sub);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/subscriptions/:id", async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ error: "Subscription not found" });
    res.json(sub);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/subscriptions/:id", async (req, res) => {
  try {
    const body = req.body;
    if (body.status === "cancelled" && !body.cancelledAt) {
      body.cancelledAt = new Date();
    }
    const sub = await Subscription.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!sub) return res.status(404).json({ error: "Subscription not found" });
    res.json(sub);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/subscriptions/:id", async (req, res) => {
  try {
    const sub = await Subscription.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ error: "Subscription not found" });
    res.json({ message: "Subscription deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error("Failed to start server:", e.message);
    process.exit(1);
  }
}

start();
