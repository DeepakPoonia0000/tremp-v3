import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlogPostingSchema } from "@/components/seo/BlogPostingSchema";
import { BreadcrumbListSchema } from "@/components/seo/BreadcrumbListSchema";
import type { Blog } from "@/types/blog";

async function getBlog(slug: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blogs?published=true&limit=1`);
  const data = await response.json();
  const blog = data.blogs?.find((b: Blog) => b.slug === slug);
  
  if (!blog) {
    return null;
  }
  
  return blog;
}

async function getRelatedBlogs(category: string, currentSlug: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/blogs?published=true&category=${category}&limit=3`
  );
  const data = await response.json();
  
  return data.blogs?.filter((b: Blog) => b.slug !== currentSlug) || [];
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug);
  
  if (!blog) {
    notFound();
  }

  const relatedBlogs = blog.category ? await getRelatedBlogs(blog.category, blog.slug) : [];

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Structured Data */}
      <BlogPostingSchema
        headline={blog.title}
        description={blog.excerpt}
        content={blog.content}
        images={blog.featuredImage ? [blog.featuredImage] : []}
        author={blog.author}
        publisherName="Tremp"
        publisherLogo="https://tremp.example.com/logo.png"
        datePublished={blog.createdAt}
        dateModified={blog.updatedAt}
        url={`https://tremp.example.com/blog/${blog.slug}`}
        wordCount={blog.content.split(/\s+/).length}
        keywords={blog.tags}
      />
      <BreadcrumbListSchema
        breadcrumbs={[
          { name: "Home", url: "https://tremp.example.com" },
          { name: "Blog", url: "https://tremp.example.com/blog" },
          { name: blog.title, url: `https://tremp.example.com/blog/${blog.slug}` },
        ]}
      />

      {/* Blog Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span>By {blog.author}</span>
          <span>•</span>
          <span>{blog.category}</span>
          <span>•</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        {blog.featuredImage && (
          <img 
            src={blog.featuredImage} 
            alt={blog.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
          />
        )}
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </div>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span 
                key={tag}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedBlogs.map((relatedBlog) => (
              <Card key={relatedBlog._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  {relatedBlog.featuredImage && (
                    <img 
                      src={relatedBlog.featuredImage} 
                      alt={relatedBlog.title}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                  )}
                  <h3 className="font-semibold mb-2">
                    <a 
                      href={`/blog/${relatedBlog.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {relatedBlog.title}
                    </a>
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {relatedBlog.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span>{relatedBlog.author}</span>
                    <span>•</span>
                    <span>{new Date(relatedBlog.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={`/blog/${relatedBlog.slug}`}>Read More</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Back to Blog */}
      <div className="mt-12 text-center">
        <Button variant="outline" asChild>
          <a href="/blog">← Back to Blog</a>
        </Button>
      </div>
    </div>
  );
}
