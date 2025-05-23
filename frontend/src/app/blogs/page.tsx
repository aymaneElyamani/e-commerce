"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { JSX } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const blogs = [
  {
    id: "1",
    title: "Top 10 Fashion Trends of 2025",
    summary: "Explore the hottest fashion styles and what to expect in the coming seasons.",
    image: "/fashion1.png",
    date: "May 1, 2025",
    href: "/blogs/top-10-fashion-trends-2025",
    tags: ["Fashion", "Trends"],
  },
  {
    id: "2",
    title: "How to Choose Outfits for Any Occasion",
    summary: "A quick guide to mastering outfits whether it's casual, formal or festive.",
    image: "/fashion2.jpg",
    date: "April 25, 2025",
    href: "/blogs/how-to-choose-outfits",
    tags: ["Style", "Guide"],
  },
  {
    id: "3",
    title: "Sustainable Fashion: Why It Matters",
    summary: "Understand how sustainable clothing is reshaping the fashion industry.",
    image: "/fashion3.jpg",
    date: "April 15, 2025",
    href: "/blogs/sustainable-fashion",
    tags: ["Eco", "Lifestyle"],
  },
];

export default function BlogGridWithSidebar(): JSX.Element {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-10">
      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Link href={blog.href}>
              <div className="h-60 w-full bg-cover bg-center" style={{ backgroundImage: `url(${blog.image})` }}></div>
              <div className="p-5">
                <p className="text-sm text-gray-500 mb-1">{blog.date}</p>
                <h2 className="text-xl font-semibold text-primary mb-2">{blog.title}</h2>
                <p className="text-sm text-gray-700 mb-3 line-clamp-3">{blog.summary}</p>
                <div className="flex gap-2 flex-wrap">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
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
                className="rounded-full text-xs px-3 border-primary text-primary hover:bg-primary hover:text-white"
              >
                #{tag}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-primary mb-4">About Us</h3>
          <p className="text-sm text-gray-600">
            We are a community of fashion lovers sharing tips and guides for sustainable, trendy living. Stay inspired with our latest blogs.
          </p>
        </div>
      </aside>
    </div>
  );
}
