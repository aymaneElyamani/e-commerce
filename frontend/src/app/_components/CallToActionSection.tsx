'use client'

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { JSX, useState } from "react"
import { toast } from "sonner"


export const CallToActionSection = (): JSX.Element => {
   const [form, setForm] = useState({
      name: "",
      email: "",
      message: ""
    })
  
    const [loading, setLoading] = useState(false)
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setForm(prev => ({ ...prev, [name]: value }))
    }
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
  
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        })
  
        if (res.ok) {
          toast.success("Message sent successfully!")
          setForm({ name: "", email: "", message: "" })
        } else {
          toast.error("Failed to send message. Please try again.")
        }
      } catch (error) {
        console.error("Error submitting form:", error)
        toast.error("Something went wrong. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  return (
    <section className="relative w-full h-[400px] bg-[url(/emailp.png)] bg-cover bg-center">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between max-w-[1240px] mx-auto px-6 h-full">
        <div className="max-w-full md:max-w-[570px] mt-[100px] md:mt-0 font-bold text-background text-2xl sm:text-3xl md:text-[32px] tracking-normal leading-snug md:leading-[48px]">
          Enter Your Email Address For Our Mailing Promo Or Other Interesting Things
        </div>

        <div className="flex flex-col sm:flex-row mt-6 md:mt-0 w-full md:w-auto gap-4 sm:gap-6">
           {/* Right Form */}
                 <motion.div
                   initial={{ opacity: 0, x: 60 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.6 }}
                 >
                   <Card className="p-6 border-none bg-transparent"> {/* shadow-xl removed */}
                     <CardContent className="p-0 space-y-6">
                       <h2 className="text-3xl font-bold text-background">Contact Us</h2>
                       <p className="text-background">
                         Got a question or feedback? Fill in the form and our team will get back to you.
                       </p>
                       <form className="space-y-4" onSubmit={handleSubmit}>
                         <Input
                           type="text"
                           className="bg-background/10 rounded-[5px] border border-background/60 backdrop-blur-[2.5px] backdrop-brightness-[100%] opacity-80 font-medium text-background text-base placeholder:text-background placeholder:opacity-80 focus-visible:ring-0 focus-visible:ring-offset-0"
                           name="name"
                           placeholder="Your Name"
                           value={form.name}
                           onChange={handleChange}
                           required
                         />
                         <Input
                           type="email"
                              className="bg-background/10 rounded-[5px] border border-background/60 backdrop-blur-[2.5px] backdrop-brightness-[100%] opacity-80 font-medium text-background text-base placeholder:text-background placeholder:opacity-80 focus-visible:ring-0 focus-visible:ring-offset-0"
                           name="email"
                           placeholder="Your Email"
                           value={form.email}
                           onChange={handleChange}
                           required
                         />
                         <Textarea
                            className="bg-background/10 rounded-[5px] border border-background/60 backdrop-blur-[2.5px] backdrop-brightness-[100%] opacity-80 font-medium text-background text-base placeholder:text-background placeholder:opacity-80 focus-visible:ring-0 focus-visible:ring-offset-0"
                           name="message"
                           placeholder="Your Message..."
                           rows={5}
                           value={form.message}
                           onChange={handleChange}
                           required
                         />
                         <Button
                           type="submit"
                           className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
                           disabled={loading}
                         >
                           {loading ? "Sending..." : "Send Message"}
                         </Button>
                       </form>
                     </CardContent>
                   </Card>
                 </motion.div>
        </div>
      </div>
    </section>
  );
};
