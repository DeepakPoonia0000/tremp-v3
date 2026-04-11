import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductGrid } from "@/components/products/ProductGrid";
import { createAdvancedSearch, type SearchOptions } from "@/lib/advanced-search";
import type { Metadata } from "next";

export const revalidate = 30;

type Props = { searchParams: Promise<{ q?: string; category?: string; colors?: string; fuzzy?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, category = "true", colors = "true", fuzzy = "0.4" } = await searchParams;
  const query = q?.trim() ?? "";
  
  await connectDB();
  
  let products: any[] = [];
  let raw: any[] = [];
  
  if (query) {
    // Get all products for advanced search
    const allProducts = await Product.find({}).lean();
    
    // Create advanced search instance
    const searchEngine = createAdvancedSearch(allProducts);
    
    // Perform search with options
    const searchOptions: SearchOptions = {
      query,
      includePartial: true,
      includeCategory: category !== "false",
      includeColors: colors !== "false",
      fuzzyThreshold: Number(fuzzy) || 0.4
    };
    
    const searchResults = searchEngine.search(query, searchOptions);
    
    // Get top 48 results
    raw = searchResults.slice(0, 48);
    
    // Format products for display
    products = raw.map(result => ({
      id: String(result.product._id),
      name: result.product.name,
      slug: result.product.slug,
      price: result.product.price,
      comparePrice: result.product.comparePrice,
      image: result.product.images[0],
    }));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {raw.length} products found
        </p>
        
        {/* Search options info */}
        {query && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted px-2 py-1">
              Category: {category !== "false" ? "Enabled" : "Disabled"}
            </span>
            <span className="rounded-full bg-muted px-2 py-1">
              Colors: {colors !== "false" ? "Enabled" : "Disabled"}
            </span>
            <span className="rounded-full bg-muted px-2 py-1">
              Fuzzy: {fuzzy}
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {query ? "No matches found. Try different keywords or check spelling." : "Enter a search query to find products."}
            </p>
            {query && (
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Tips for better search:</p>
                <ul className="mt-2 list-disc list-inside">
                  <li>Try partial words (e.g., &quot;shir&quot; for &quot;shirt&quot;)</li>
                  <li>Search by colors (e.g., &quot;blue&quot;, &quot;red&quot;)</li>
                  <li>Search by categories (e.g., &quot;tops&quot;, &quot;bottoms&quot;)</li>
                  <li>Check for spelling errors - we handle fuzzy matching!</li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Show top matches with scores for debugging (optional) */}
            {process.env.NODE_ENV === "development" && raw.slice(0, 3).map((result, index) => (
              <div key={index} className="mb-2 text-xs text-muted-foreground">
                {result.product.name} - Score: {result.score}
              </div>
            ))}
            <ProductGrid products={products} />
          </div>
        )}
      </div>
    </div>
  );
}
