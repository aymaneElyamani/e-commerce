"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { JSX, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/useAuthStore";
import { getBlogs } from "@/services/blog";

function formatDate(iso?: string | null) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return "";
  }
}

export default function BlogGridWithSidebar(): JSX.Element {
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const authHeader = useMemo(() => ({ token: token ?? undefined }), [token]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBlogs(authHeader);
        if (!cancelled) setBlogs(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load blogs");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [authHeader]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-10">
      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && (
          <div className="col-span-full text-sm text-muted-foreground">Loading blogs...</div>
        )}
        {error && (
          <div className="col-span-full text-sm text-red-600">{error}</div>
        )}
        {!loading && !error && blogs.length === 0 && (
          <div className="col-span-full text-sm text-muted-foreground">No blogs found.</div>
        )}

        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            className="bg-card border border-border rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Link href={`/blogs/${blog.id}`}>
              <div
                className="h-60 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${blog.image_url ?? "/img/blog/placeholder.jpg"})` }}
              ></div>
              <div className="p-5">
                <p className="text-sm text-muted-foreground mb-1">{formatDate(blog.created_at)}</p>
                <h2 className="text-xl font-semibold text-primary mb-2">{blog.title}</h2>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {blog.content}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Sidebar */}
      <aside className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-primary mb-4">Search</h3>
          <Input placeholder="Search blogs..." className="rounded-xl" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-primary mb-4">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {["Fashion", "Eco", "Guide", "Women", "Kids", "Men"].map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                className="rounded-full text-xs px-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                #{tag}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-primary mb-4">About Us</h3>
          <p className="text-sm text-muted-foreground">
            We are a community of fashion lovers sharing tips and guides for sustainable, trendy living. Stay inspired with our latest blogs.
          </p>
        </div>
      </aside>
    </div>
  );
}
