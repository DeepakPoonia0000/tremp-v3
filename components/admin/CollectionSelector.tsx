"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Collection {
  _id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
  season: string;
  isActive: boolean;
  sortOrder: number;
}

interface CollectionSelectorProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  maxSelections?: number;
}

export function CollectionSelector({ selectedIds, onSelectionChange, maxSelections = 6 }: CollectionSelectorProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  async function fetchCollections() {
    try {
      setLoading(true);
      const response = await fetch("/api/collections");
      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.season.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedCollections = showAll ? filteredCollections : filteredCollections.slice(0, 8);

  const handleToggleCollection = (collectionId: string, checked: boolean) => {
    if (checked) {
      if (selectedIds.length < maxSelections) {
        onSelectionChange([...selectedIds, collectionId]);
      }
    } else {
      onSelectionChange(selectedIds.filter(id => id !== collectionId));
    }
  };

  const getSelectedCollections = () => {
    return collections.filter(collection => selectedIds.includes(collection._id));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="collection-search">Search Collections</Label>
        <Input
          id="collection-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, description, or season..."
          className="mt-1"
        />
      </div>

      <div>
        <Label>Selected Collections ({selectedIds.length}/{maxSelections})</Label>
        <div className="mt-2 space-y-2">
          {getSelectedCollections().map(collection => (
            <div key={collection._id} className="flex items-center justify-between p-2 border rounded">
              <div className="flex-1">
                <div className="font-medium">{collection.name}</div>
                <div className="text-sm text-muted-foreground">
                  {collection.season} - {collection.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleToggleCollection(collection._id, false)}
              >
                Remove
              </Button>
            </div>
          ))}
          {selectedIds.length === 0 && (
            <div className="text-sm text-muted-foreground">No collections selected</div>
          )}
        </div>
      </div>

      <div>
        <Label>Available Collections</Label>
        <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border rounded p-2">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading collections...</div>
          ) : displayedCollections.length === 0 ? (
            <div className="text-sm text-muted-foreground">No collections found</div>
          ) : (
            displayedCollections.map(collection => {
              const isSelected = selectedIds.includes(collection._id);
              const isDisabled = !isSelected && selectedIds.length >= maxSelections;
              
              return (
                <div key={collection._id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded">
                  <Checkbox
                    id={`collection-${collection._id}`}
                    checked={isSelected}
                    disabled={isDisabled}
                    onCheckedChange={(checked) => handleToggleCollection(collection._id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={`collection-${collection._id}`}
                      className={`text-sm font-medium cursor-pointer ${isDisabled ? 'text-muted-foreground' : ''}`}
                    >
                      {collection.name}
                    </label>
                    <div className="text-xs text-muted-foreground">
                      {collection.season} - {collection.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {filteredCollections.length > 8 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="mt-2"
          >
            {showAll ? "Show Less" : `Show All (${filteredCollections.length})`}
          </Button>
        )}
      </div>
    </div>
  );
}
