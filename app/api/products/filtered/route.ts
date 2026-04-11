import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

interface FilterOptions {
  search?: string;
  category?: string;
  colors?: string[];
  sizes?: string[];
  priceRange?: [number, number];
  inStock?: boolean;
  featured?: boolean;
  sortBy?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Parse filter parameters
  const search = searchParams.get("search")?.trim() || "";
  const category = searchParams.get("category") || "";
  const colors = searchParams.get("colors")?.split(",").filter(Boolean) || [];
  const sizes = searchParams.get("sizes")?.split(",").filter(Boolean) || [];
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || Infinity;
  const inStock = searchParams.get("inStock") === "true";
  const featured = searchParams.get("featured") === "true";
  const sortBy = searchParams.get("sortBy") || "newest";
  const limit = Math.min(Number(searchParams.get("limit")) || 48, 100);

  await connectDB();

  try {
    // Build filter object
    const filter: Record<string, any> = {};

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Colors filter
    if (colors.length > 0) {
      filter.colors = { $in: colors };
    }

    // Sizes filter
    if (sizes.length > 0) {
      filter.sizes = { $in: sizes };
    }

    // Price range filter
    if (minPrice > 0 || maxPrice < Infinity) {
      filter.price = {};
      if (minPrice > 0) filter.price.$gte = minPrice;
      if (maxPrice < Infinity) filter.price.$lte = maxPrice;
    }

    // Stock filter
    if (inStock) {
      filter.stock = { $gt: 0 };
    }

    // Featured filter
    if (featured) {
      filter.isFeatured = true;
    }

    // Build sort object
    let sort: Record<string, any> = {};
    switch (sortBy) {
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "oldest":
        sort = { createdAt: 1 };
        break;
      case "price-low":
        sort = { price: 1 };
        break;
      case "price-high":
        sort = { price: -1 };
        break;
      case "name-asc":
        sort = { name: 1 };
        break;
      case "name-desc":
        sort = { name: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Add text score if searching
    const projection = search ? { score: { $meta: "textScore" } } : {};

    // Execute query
    let products;
    if (search) {
      products = await Product.find(filter, projection)
        .sort({ score: { $meta: "textScore" }, ...sort })
        .limit(limit)
        .lean();
    } else {
      products = await Product.find(filter)
        .sort(sort)
        .limit(limit)
        .lean();
    }

    // Get available filter options
    const [categories, availableColors, availableSizes, priceStats] = await Promise.all([
      Product.distinct("category"),
      Product.distinct("colors"),
      Product.distinct("sizes"),
      Product.aggregate([
        { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } }
      ])
    ]);

    return NextResponse.json({
      products,
      filters: {
        categories,
        availableColors,
        availableSizes,
        priceRange: {
          min: priceStats[0]?.min || 0,
          max: priceStats[0]?.max || 1000
        }
      },
      total: products.length
    });

  } catch (error) {
    console.error("Error in filtered products API:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
