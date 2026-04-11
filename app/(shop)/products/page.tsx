"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/products/ProductGrid";
import { AdvancedProductFilters, type FilterOptions } from "@/components/products/AdvancedProductFilters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image: string;
  category: string;
  colors: string[];
  sizes: string[];
  stock: number;
  isFeatured: boolean;
}

interface FilterData {
  categories: string[];
  availableColors: string[];
  availableSizes: string[];
  priceRange: { min: number; max: number };
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filterData, setFilterData] = useState<FilterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    category: "",
    colors: [],
    sizes: [],
    priceRange: [0, 1000],
    inStock: false,
    featured: false,
    sortBy: "newest"
  });

  // Initialize filters from URL params
  useEffect(() => {
    const initialFilters: FilterOptions = {
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      colors: searchParams.get("colors")?.split(",") || [],
      sizes: searchParams.get("sizes")?.split(",") || [],
      priceRange: [
        Number(searchParams.get("minPrice")) || 0,
        Number(searchParams.get("maxPrice")) || 1000
      ],
      inStock: searchParams.get("inStock") === "true",
      featured: searchParams.get("featured") === "true",
      sortBy: searchParams.get("sortBy") || "newest"
    };
    setFilters(initialFilters);
  }, [searchParams]);

  // Fetch filter data and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Build query string
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.category) params.set("category", filters.category);
        if (filters.colors.length > 0) params.set("colors", filters.colors.join(","));
        if (filters.sizes.length > 0) params.set("sizes", filters.sizes.join(","));
        if (filters.priceRange[0] > 0) params.set("minPrice", filters.priceRange[0].toString());
        if (filters.priceRange[1] < 1000) params.set("maxPrice", filters.priceRange[1].toString());
        if (filters.inStock) params.set("inStock", "true");
        if (filters.featured) params.set("featured", "true");
        if (filters.sortBy !== "newest") params.set("sortBy", filters.sortBy);

        const response = await fetch(`/api/products/filtered?${params.toString()}`);
        const data = await response.json();

        if (data.error) {
          console.error("API Error:", data.error);
          return;
        }

        // Transform products
        const transformedProducts = data.products.map((p: any) => ({
          id: String(p._id),
          name: p.name,
          slug: p.slug,
          price: p.price,
          comparePrice: p.comparePrice,
          image: p.images?.[0] || "",
          category: p.category,
          colors: p.colors || [],
          sizes: p.sizes || [],
          stock: p.stock || 0,
          isFeatured: p.isFeatured || false
        }));

        setProducts(transformedProducts);
        setFilterData(data.filters);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    
    // Update URL without page reload
    const params = new URLSearchParams();
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.colors.length > 0) params.set("colors", newFilters.colors.join(","));
    if (newFilters.sizes.length > 0) params.set("sizes", newFilters.sizes.join(","));
    if (newFilters.priceRange[0] > 0) params.set("minPrice", newFilters.priceRange[0].toString());
    if (newFilters.priceRange[1] < 1000) params.set("maxPrice", newFilters.priceRange[1].toString());
    if (newFilters.inStock) params.set("inStock", "true");
    if (newFilters.featured) params.set("featured", "true");
    if (newFilters.sortBy !== "newest") params.set("sortBy", newFilters.sortBy);

    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {
      search: "",
      category: "",
      colors: [],
      sizes: [],
      priceRange: [filterData?.priceRange.min || 0, filterData?.priceRange.max || 1000],
      inStock: false,
      featured: false,
      sortBy: "newest"
    };
    handleFiltersChange(clearedFilters);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
        <p className="mt-1 text-muted-foreground">
          {products.length} products found
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          {filterData && (
            <AdvancedProductFilters
              categories={filterData.categories}
              availableColors={filterData.availableColors}
              availableSizes={filterData.availableSizes}
              priceRange={filterData.priceRange}
              currentFilters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              totalProducts={products.length}
            />
          )}
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No products found matching your criteria.
              </p>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="mt-4"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </div>
  );
}
