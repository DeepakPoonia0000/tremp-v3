"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogSelectorProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  maxSelections?: number;
  showPublishedOnly?: boolean;
}

export function BlogSelector({ 
  selectedIds, 
  onSelectionChange, 
  maxSelections = 3,
  showPublishedOnly = true 
}: BlogSelectorProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, [showPublishedOnly]);

  async function fetchBlogs() {
    try {
      setLoading(true);
      const url = `/api/blogs?published=${showPublishedOnly}&limit=50`;
      const response = await fetch(url);
      const data = await response.json();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const displayedBlogs = showAll ? filteredBlogs : filteredBlogs.slice(0, 8);

  const handleToggleBlog = (blogId: string, checked: boolean) => {
    if (checked) {
      if (selectedIds.length < maxSelections) {
        onSelectionChange([...selectedIds, blogId]);
      }
    } else {
      onSelectionChange(selectedIds.filter(id => id !== blogId));
    }
  };

  const getSelectedBlogs = () => {
    return blogs.filter(blog => selectedIds.includes(blog._id));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="blog-search">Search Blogs</Label>
        <Input
          id="blog-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, excerpt, category, author, or tags..."
          className="mt-1"
        />
      </div>

      <div>
        <Label>Selected Blogs ({selectedIds.length}/{maxSelections})</Label>
        <div className="mt-2 space-y-2">
          {getSelectedBlogs().map(blog => (
            <div key={blog._id} className="flex items-start gap-3 p-3 border rounded">
              {blog.featuredImage && (
                <img 
                  src={blog.featuredImage} 
                  alt={blog.title}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{blog.title}</div>
                <div className="text-sm text-muted-foreground">
                  {blog.author} • {blog.category}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {blog.excerpt}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleToggleBlog(blog._id, false)}
                className="shrink-0"
              >
                Remove
              </Button>
            </div>
          ))}
          {selectedIds.length === 0 && (
            <div className="text-sm text-muted-foreground">No blogs selected</div>
          )}
        </div>
      </div>

      <div>
        <Label>Available Blogs</Label>
        <div className="mt-2 space-y-2 max-h-80 overflow-y-auto border rounded p-2">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading blogs...</div>
          ) : displayedBlogs.length === 0 ? (
            <div className="text-sm text-muted-foreground">No blogs found</div>
          ) : (
            displayedBlogs.map(blog => {
              const isSelected = selectedIds.includes(blog._id);
              const isDisabled = !isSelected && selectedIds.length >= maxSelections;
              
              return (
                <div key={blog._id} className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded">
                  <Checkbox
                    id={`blog-${blog._id}`}
                    checked={isSelected}
                    disabled={isDisabled}
                    onCheckedChange={(checked) => handleToggleBlog(blog._id, checked as boolean)}
                    className="mt-1"
                  />
                  {blog.featuredImage && (
                    <img 
                      src={blog.featuredImage} 
                      alt={blog.title}
                      className="w-12 h-12 object-cover rounded flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <label 
                      htmlFor={`blog-${blog._id}`}
                      className={`text-sm font-medium cursor-pointer block truncate ${isDisabled ? 'text-muted-foreground' : ''}`}
                    >
                      {blog.title}
                    </label>
                    <div className="text-xs text-muted-foreground">
                      {blog.author} • {blog.category}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {blog.excerpt}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {filteredBlogs.length > 8 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="mt-2"
          >
            {showAll ? "Show Less" : `Show All (${filteredBlogs.length})`}
          </Button>
        )}
      </div>
    </div>
  );
}
