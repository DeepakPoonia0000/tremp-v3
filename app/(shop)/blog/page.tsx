import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemListSchema } from "@/components/seo/ItemListSchema";
import { BreadcrumbListSchema } from "@/components/seo/BreadcrumbListSchema";
import type { Blog } from "@/types/blog";

async function getBlogs(searchParams: { category?: string; page?: string }) {
  const params = new URLSearchParams(searchParams as any);
  const category = params.get("category");
  const page = Math.max(Number(params.get("page")) || 1, 1);
  const limit = 12;
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/blogs?published=true&category=${category || ""}&page=${page}&limit=${limit}`
  );
  const data = await response.json();
  
  return {
    blogs: data.blogs || [],
    pagination: data.pagination || { page, limit, total: 0, pages: 0 },
  };
}

export default async function BlogPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const { blogs, pagination } = await getBlogs(searchParams || {});
  
  return (
    <div className="container mx-auto py-8">
      {/* Structured Data */}
      <BreadcrumbListSchema
        breadcrumbs={[
          { name: "Home", url: "https://tremp.example.com" },
          { name: "Blog", url: "https://tremp.example.com/blog" },
        ]}
      />
      <ItemListSchema
        name={searchParams?.category ? `${searchParams.category} Blog Posts` : "Blog Posts"}
        description={`Latest ${searchParams?.category ? `${searchParams.category} ` : ""}articles, tutorials, and insights from our team.`}
        items={blogs.map((blog, index) => ({
          position: index + 1,
          name: blog.title,
          url: `https://tremp.example.com/blog/${blog.slug}`,
          image: blog.featuredImage,
        }))}
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground text-lg">
          Read the latest articles, tutorials, and insights from our team.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={!searchParams?.category ? "default" : "outline"}
            size="sm"
            asChild
          >
            <a href="/blog">All</a>
          </Button>
          <Button 
            variant={searchParams?.category === "general" ? "default" : "outline"}
            size="sm"
            asChild
          >
            <a href="/blog?category=general">General</a>
          </Button>
          <Button 
            variant={searchParams?.category === "tutorial" ? "default" : "outline"}
            size="sm"
            asChild
          >
            <a href="/blog?category=tutorial">Tutorials</a>
          </Button>
          <Button 
            variant={searchParams?.category === "news" ? "default" : "outline"}
            size="sm"
            asChild
          >
            <a href="/blog?category=news">News</a>
          </Button>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold mb-4">No blog posts found</h3>
          <p className="text-muted-foreground">
            {searchParams?.category 
              ? `No posts found in the "${searchParams.category}" category.`
              : "No published blog posts yet."
            }
          </p>
        </div>
      ) : (
        <>
          {/* Blog Posts Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {blogs.map((blog) => (
              <Card key={blog._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  {blog.featuredImage && (
                    <img 
                      src={blog.featuredImage} 
                      alt={blog.title}
                      className="w-full h-48 object-cover rounded mb-4"
                    />
                  )}
                  <CardTitle className="text-xl mb-2">
                    <a 
                      href={`/blog/${blog.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {blog.title}
                    </a>
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>By {blog.author}</span>
                      <span>•</span>
                      <span>{blog.category}</span>
                      <span>•</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="line-clamp-3 text-sm">
                      {blog.excerpt}
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`/blog/${blog.slug}`}>Read More</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              {pagination.page > 1 && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`/blog?page=${pagination.page - 1}${searchParams?.category ? `&category=${searchParams.category}` : ""}`}>
                    Previous
                  </a>
                </Button>
              )}
              
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.pages}
              </span>
              
              {pagination.page < pagination.pages && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`/blog?page=${pagination.page + 1}${searchParams?.category ? `&category=${searchParams.category}` : ""}`}>
                    Next
                  </a>
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
