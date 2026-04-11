"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Search, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/utils/cn";

export interface FilterOptions {
  search: string;
  category: string;
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
  inStock: boolean;
  featured: boolean;
  sortBy: string;
}

interface AdvancedProductFiltersProps {
  categories: string[];
  availableColors: string[];
  availableSizes: string[];
  priceRange: { min: number; max: number };
  currentFilters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  totalProducts: number;
}

export function AdvancedProductFilters({
  categories,
  availableColors,
  availableSizes,
  priceRange,
  currentFilters,
  onFiltersChange,
  onClearFilters,
  totalProducts,
}: AdvancedProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState({
    category: true,
    price: true,
    colors: false,
    sizes: false,
    features: false,
  });

  const [localFilters, setLocalFilters] = useState<FilterOptions>(currentFilters);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleColor = (color: string) => {
    const newColors = localFilters.colors.includes(color)
      ? localFilters.colors.filter(c => c !== color)
      : [...localFilters.colors, color];
    updateFilter('colors', newColors);
  };

  const toggleSize = (size: string) => {
    const newSizes = localFilters.sizes.includes(size)
      ? localFilters.sizes.filter(s => s !== size)
      : [...localFilters.sizes, size];
    updateFilter('sizes', newSizes);
  };

  const hasActiveFilters = 
    localFilters.search ||
    localFilters.category ||
    localFilters.colors.length > 0 ||
    localFilters.sizes.length > 0 ||
    localFilters.priceRange[0] > priceRange.min ||
    localFilters.priceRange[1] < priceRange.max ||
    localFilters.inStock ||
    localFilters.featured;

  const activeFilterCount = [
    localFilters.search,
    localFilters.category,
    localFilters.colors.length > 0,
    localFilters.sizes.length > 0,
    localFilters.priceRange[0] > priceRange.min || localFilters.priceRange[1] < priceRange.max,
    localFilters.inStock,
    localFilters.featured
  ].filter(Boolean).length;

  const toggleSection = (section: keyof typeof isExpanded) => {
    setIsExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={localFilters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="font-medium">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto font-medium"
          onClick={() => toggleSection('category')}
        >
          Category
          {isExpanded.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isExpanded.category && (
          <div className="space-y-2 mt-3">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={localFilters.category === category}
                  onChange={(e) => updateFilter('category', e.target.checked ? category : '')}
                  className="rounded border-gray-300"
                />
                <span className="text-sm capitalize">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto font-medium"
          onClick={() => toggleSection('price')}
        >
          Price Range
          {isExpanded.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isExpanded.price && (
          <div className="space-y-3 mt-3">
            <div className="space-y-2">
              <Label className="text-sm">Min Price: ${localFilters.priceRange[0]}</Label>
              <Input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={localFilters.priceRange[0]}
                onChange={(e) => updateFilter('priceRange', [Number(e.target.value), localFilters.priceRange[1]])}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Max Price: ${localFilters.priceRange[1]}</Label>
              <Input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={localFilters.priceRange[1]}
                onChange={(e) => updateFilter('priceRange', [localFilters.priceRange[0], Number(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Colors Filter */}
      <div className="space-y-3">
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto font-medium"
          onClick={() => toggleSection('colors')}
        >
          Colors
          {isExpanded.colors ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isExpanded.colors && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {availableColors.map((color) => (
              <label key={color} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.colors.includes(color)}
                  onChange={() => toggleColor(color)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm capitalize">{color}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sizes Filter */}
      <div className="space-y-3">
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto font-medium"
          onClick={() => toggleSection('sizes')}
        >
          Sizes
          {isExpanded.sizes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isExpanded.sizes && (
          <div className="grid grid-cols-3 gap-2 mt-3">
            {availableSizes.map((size) => (
              <label key={size} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.sizes.includes(size)}
                  onChange={() => toggleSize(size)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{size}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Features Filter */}
      <div className="space-y-3">
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto font-medium"
          onClick={() => toggleSection('features')}
        >
          Features
          {isExpanded.features ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isExpanded.features && (
          <div className="space-y-2 mt-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.inStock}
                onChange={(e) => updateFilter('inStock', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">In Stock Only</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.featured}
                onChange={(e) => updateFilter('featured', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Featured Products</span>
            </label>
          </div>
        )}
      </div>

      {/* Sort Options */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Sort By</Label>
        <select
          value={localFilters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Showing {totalProducts} products
        </p>
      </div>
    </div>
  );
}
