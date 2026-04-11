import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { createAdvancedSearch, type SearchOptions } from "@/lib/advanced-search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const includeCategory = searchParams.get("category") !== "false";
  const includeColors = searchParams.get("colors") !== "false";
  const fuzzyThreshold = Number(searchParams.get("fuzzy")) || 0.4;
  const limit = Math.min(Number(searchParams.get("limit")) || 24, 100);

  if (!q) {
    return NextResponse.json([]);
  }

  await connectDB();
  
  // Get all products for advanced search
  const allProducts = await Product.find({}).lean();
  
  // Create advanced search instance
  const searchEngine = createAdvancedSearch(allProducts);
  
  // Perform search with options
  const searchOptions: SearchOptions = {
    query: q,
    includePartial: true,
    includeCategory,
    includeColors,
    fuzzyThreshold
  };
  
  const searchResults = searchEngine.search(q, searchOptions);
  
  // Return limited results with products and scores
  const results = searchResults.slice(0, limit).map(result => ({
    ...result.product,
    _searchScore: result.score,
    _matchDetails: result.matchDetails
  }));

  return NextResponse.json(results);
}
