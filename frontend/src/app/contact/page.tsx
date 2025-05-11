'use client'

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", form)
  }

  return (
    <section className="min-h-screen w-full px-6 py-16 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Image */}
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/img/contact.jpg"
            alt="Contact Us"
            width={600}
            height={600}
            className="w-full h-auto rounded-2xl shadow-lg object-cover"
          />
        </motion.div>

        {/* Right Form */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-6 shadow-xl border-none">
            <CardContent className="p-0 space-y-6">
              <h2 className="text-3xl font-bold text-[#285a43]">Contact Us</h2>
              <p className="text-gray-600">
                Got a question or feedback? Fill in the form and our team will get back to you.
              </p>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <Textarea
                  name="message"
                  placeholder="Your Message..."
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
                <Button type="submit" className="bg-[#285a43] hover:bg-[#1e4734] text-white w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
