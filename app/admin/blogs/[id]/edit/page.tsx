"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Blog, BlogFormData } from "@/types/blog";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "Admin",
    category: "general",
    tags: "",
    featuredImage: "",
    isPublished: false,
  });

  useEffect(() => {
    if (params.id) {
      fetchBlog(params.id as string);
    }
  }, [params.id]);

  async function fetchBlog(id: string) {
    try {
      setFetchLoading(true);
      const response = await fetch(`/api/blogs/${id}`);
      
      if (response.ok) {
        const blog: Blog = await response.json();
        setFormData({
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          author: blog.author,
          category: blog.category,
          tags: blog.tags.join(", "),
          featuredImage: blog.featuredImage,
          isPublished: blog.isPublished,
        });
      } else {
        alert("Blog post not found");
        router.push("/admin/blogs");
      }
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      alert("Failed to fetch blog post");
      router.push("/admin/blogs");
    } finally {
      setFetchLoading(false);
    }
  }

  function handleChange(field: keyof BlogFormData, value: string | boolean) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/blogs/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/blogs");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update blog post");
      }
    } catch (error) {
      console.error("Failed to update blog:", error);
      alert("Failed to update blog post");
    } finally {
      setLoading(false);
    }
  }

  if (fetchLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading blog post...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        <p className="text-muted-foreground mt-2">
          Update your blog post content and settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Details</CardTitle>
          <CardDescription>
            Modify the information for your blog post.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter blog post title"
                  required
                />
              </div>
              
              <div className="sm:col-span-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="url-friendly-slug"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Input
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleChange("excerpt", e.target.value)}
                  placeholder="Brief description of the blog post"
                  required
                />
              </div>

              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleChange("author", e.target.value)}
                  placeholder="Author name"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  placeholder="Blog category"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <Input
                  id="featuredImage"
                  value={formData.featuredImage}
                  onChange={(e) => handleChange("featuredImage", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="content">Content *</Label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  placeholder="Write your blog post content here..."
                  rows={15}
                  className="w-full p-3 border rounded-md resize-vertical"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => handleChange("isPublished", e.target.checked)}
                />
                <Label htmlFor="isPublished">Published</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/blogs")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Blog Post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
