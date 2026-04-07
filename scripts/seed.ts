import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../lib/mongodb";
import Product from "../models/Product";
import Collection from "../models/Collection";
import HomepageConfig from "../models/HomepageConfig";
import User from "../models/User";
async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Set MONGODB_URI in .env.local before running seed.");
  }
  await connectDB();

  await User.findOneAndUpdate(
    { email: "twoobgmi@gmail.com" },
    {
      $setOnInsert: {
        email: "twoobgmi@gmail.com",
        name: "Admin",
        role: "admin",
      },
    },
    { upsert: true }
  );

  const summer = await Collection.findOneAndUpdate(
    { slug: "summer-essentials" },
    {
      $set: {
        name: "Summer Essentials",
        slug: "summer-essentials",
        description: "Light layers for warm days.",
        bannerImage: "",
        season: "summer",
        isActive: true,
        sortOrder: 1,
        metaTitle: "Summer Essentials",
        metaDescription: "Summer clothing collection",
        products: [],
      },
    },
    { upsert: true, new: true }
  );

  const productsData = [
    {
      name: "Organic Cotton Tee",
      slug: "organic-cotton-tee",
      description: "Soft everyday tee in organic cotton.",
      price: 48,
      comparePrice: 64,
      category: "tops",
      sizes: ["S", "M", "L", "XL"],
      colors: ["White", "Black", "Sage"],
      stock: 40,
      tags: ["basics", "cotton"],
      isFeatured: true,
    },
    {
      name: "Relaxed Linen Shirt",
      slug: "relaxed-linen-shirt",
      description: "Breathable linen for city heat.",
      price: 89,
      category: "tops",
      sizes: ["S", "M", "L"],
      colors: ["Natural", "Navy"],
      stock: 25,
      tags: ["linen", "summer"],
      isFeatured: true,
    },
    {
      name: "Tailored Trousers",
      slug: "tailored-trousers",
      description: "Tapered leg, stretch comfort.",
      price: 120,
      category: "bottoms",
      sizes: ["30", "32", "34", "36"],
      colors: ["Charcoal", "Sand"],
      stock: 18,
      tags: ["tailored"],
      isFeatured: false,
    },
  ];

  const productIds: mongoose.Types.ObjectId[] = [];
  for (const p of productsData) {
    const doc = await Product.findOneAndUpdate(
      { slug: p.slug },
      {
        $set: {
          ...p,
          images: [],
          collections: [summer._id],
        },
      },
      { upsert: true, new: true }
    );
    productIds.push(doc._id);
  }

  await Collection.updateOne(
    { _id: summer._id },
    { $set: { products: productIds } }
  );

  const heroId = crypto.randomUUID();
  await HomepageConfig.findOneAndUpdate(
    {},
    {
      $set: {
        sections: [
          {
            id: heroId,
            type: "hero",
            order: 0,
            isVisible: true,
            data: {
              headline: "Elevated everyday wear",
              subheadline: "Thoughtfully made clothing for modern life.",
              ctaText: "Shop the collection",
              ctaHref: "/products",
            },
          },
          {
            id: crypto.randomUUID(),
            type: "featured-collections",
            order: 1,
            isVisible: true,
            data: {
              collectionIds: [String(summer._id)],
              layout: "grid",
            },
          },
          {
            id: crypto.randomUUID(),
            type: "featured-products",
            order: 2,
            isVisible: true,
            data: {
              productIds: productIds.map(String),
              limit: 6,
            },
          },
          {
            id: crypto.randomUUID(),
            type: "newsletter",
            order: 3,
            isVisible: true,
            data: {},
          },
        ],
      },
    },
    { upsert: true }
  );

  console.info("Seed complete:", {
    products: productsData.map((p) => p.slug),
    collection: summer.slug,
  });
}

main()
  .then(() => mongoose.connection.close())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
