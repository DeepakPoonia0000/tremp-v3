"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: string;
}

interface ProductSelectorProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  maxSelections?: number;
}

export function ProductSelector({ selectedIds, onSelectionChange, maxSelections = 10 }: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await fetch("/api/products?limit=50");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedProducts = showAll ? filteredProducts : filteredProducts.slice(0, 10);

  const handleToggleProduct = (productId: string, checked: boolean) => {
    if (checked) {
      if (selectedIds.length < maxSelections) {
        onSelectionChange([...selectedIds, productId]);
      }
    } else {
      onSelectionChange(selectedIds.filter(id => id !== productId));
    }
  };

  const getSelectedProducts = () => {
    return products.filter(product => selectedIds.includes(product._id));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="product-search">Search Products</Label>
        <Input
          id="product-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or category..."
          className="mt-1"
        />
      </div>

      <div>
        <Label>Selected Products ({selectedIds.length}/{maxSelections})</Label>
        <div className="mt-2 space-y-2">
          {getSelectedProducts().map(product => (
            <div key={product._id} className="flex items-center justify-between p-2 border rounded">
              <div className="flex-1">
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-muted-foreground">${product.price} - {product.category}</div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleToggleProduct(product._id, false)}
              >
                Remove
              </Button>
            </div>
          ))}
          {selectedIds.length === 0 && (
            <div className="text-sm text-muted-foreground">No products selected</div>
          )}
        </div>
      </div>

      <div>
        <Label>Available Products</Label>
        <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border rounded p-2">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading products...</div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-sm text-muted-foreground">No products found</div>
          ) : (
            displayedProducts.map(product => {
              const isSelected = selectedIds.includes(product._id);
              const isDisabled = !isSelected && selectedIds.length >= maxSelections;
              
              return (
                <div key={product._id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded">
                  <Checkbox
                    id={`product-${product._id}`}
                    checked={isSelected}
                    disabled={isDisabled}
                    onCheckedChange={(checked) => handleToggleProduct(product._id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={`product-${product._id}`}
                      className={`text-sm font-medium cursor-pointer ${isDisabled ? 'text-muted-foreground' : ''}`}
                    >
                      {product.name}
                    </label>
                    <div className="text-xs text-muted-foreground">
                      ${product.price} - {product.category}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {filteredProducts.length > 10 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="mt-2"
          >
            {showAll ? "Show Less" : `Show All (${filteredProducts.length})`}
          </Button>
        )}
      </div>
    </div>
  );
}
