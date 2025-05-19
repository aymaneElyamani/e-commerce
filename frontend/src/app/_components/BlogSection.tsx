import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";
import { JSX } from "react";

export const BlogSection = (): JSX.Element => {
  // Blog post data for mapping
  const blogPosts = [
    {
      id: 1,
      title: "More productive with an atmosphere of greenery",
      excerpt:
        "An atmosphere of greenery can increase productivity in the workplace. Studies show that plants improve air quality and decrease stress...",
      date: "January 20, 2023",
      image: "/image-14.png",
    },
    {
      id: 2,
      title: "The benefits of plants in your room your room",
      excerpt:
        "Plants in your room can bring numerous benefits, such as improved air quality, reduced stress, and increased feelings of well-being....",
      date: "January 10, 2023",
      image: "/image-15.png",
    },
    {
      id: 3,
      title: "Hobbyist plants in the house",
      excerpt:
        "Having hobbyist plants in the house is a great way to bring nature indoors. Not only do they purify the air, but they....",
      date: "January 15, 2023",
      image: "/image-13.png",
    },
  ];

  return (
    <section className="w-full py-16 max-w-[1220px] mx-auto">
      <h2 className="text-center mb-10 text-4xl tracking-[1.44px] leading-[50.4px] font-normal text-primary [-webkit-text-stroke:1.1px_#285a43] [font-family:'Lato',Helvetica]">
        Interesting Blog To Read
      </h2>

      <div className="flex flex-wrap justify-between gap-y-8">
        {blogPosts.map((post) => (
          <Card key={post.id} className="w-full max-w-[360px] border-none">
            <CardContent className="p-0">
              <img
                className="w-full h-[330px] object-cover"
                alt={post.title}
                src={post.image}
              />

              <h3 className="mt-4 [font-family:'Lato',Helvetica] font-black text-primary text-xl tracking-[0] leading-7">
                {post.title}
              </h3>

              <p className="mt-4 opacity-80 [font-family:'Raleway',Helvetica] font-medium text-[#121212] text-base tracking-[0] leading-6">
                {post.excerpt}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="w-6 h-6 text-[#121212cc]" />
                  <span className="ml-2 opacity-80 [font-family:'Raleway',Helvetica] font-medium text-[#121212cc] text-base tracking-[0] leading-6">
                    {post.date}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="[font-family:'Lato',Helvetica] font-black text-primary text-base tracking-[0] leading-[22.4px]">
                    Read More
                  </span>
                  <ArrowRightIcon className="ml-1 w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
