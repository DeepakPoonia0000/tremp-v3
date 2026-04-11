import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { getSearchSuggestions } from "@/lib/advanced-search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const limit = Math.min(Number(searchParams.get("limit")) || 5, 10);

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  await connectDB();
  
  // Get all products for suggestions
  const allProducts = await Product.find({}).lean();
  
  // Get search suggestions
  const suggestions = getSearchSuggestions(allProducts, q, limit);

  return NextResponse.json(suggestions);
}
