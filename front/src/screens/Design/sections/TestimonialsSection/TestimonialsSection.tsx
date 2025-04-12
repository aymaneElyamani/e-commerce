import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

export const TestimonialsSection = (): JSX.Element => {
  // Testimonial data for mapping
  const testimonials = [
    {
      id: 1,
      name: "Doris Watson",
      image: "/rectangle.png",
      quote:
        '" Highly recommend this website for quality flowers and plants. Great prices, timely delivery and excellent customer service. "',
      plantImage: "/zz-plant.png",
      plantAlt: "Zz plant",
    },
    {
      id: 2,
      name: "Kate Szu",
      image: "/rectangle-1.png",
      quote:
        '"Great service, beautiful flowers, timely delivery. Highly recommend."',
      plantImage: "/snake-plant.png",
      plantAlt: "Snake plant",
    },
    {
      id: 3,
      name: "Dyness",
      image: "/rectangle-2.png",
      quote:
        '"I am very happy with my purchase from this website, the plants were healthy and arrived on time."',
      plantImage: "/bamboo.png",
      plantAlt: "Bamboo",
    },
  ];

  return (
    <section className="w-full max-w-[1220px] mx-auto py-10">
      <h2 className="text-center text-4xl text-[#285a43] [-webkit-text-stroke:1.1px_#285a43] font-normal tracking-[1.44px] leading-[50.4px] mb-8 font-['Lato',Helvetica]">
        What Do They Say About Us
      </h2>

      <div className="flex flex-wrap justify-between gap-5">
        {testimonials.map((testimonial, index) => (
          <Card
            key={testimonial.id}
            className={`w-[360px] rounded-[10px] overflow-hidden ${index === 2 ? "bg-[#f8f8f8] relative" : "bg-[#f8f8f8]"}`}
          >
            <CardContent className="p-0">
              <div className="relative p-10">
                <div className="flex items-start">
                  <img
                    className="w-16 h-16 object-cover"
                    alt={`${testimonial.name} profile`}
                    src={testimonial.image}
                  />
                  <h3 className="ml-5 mt-3 font-['Lato',Helvetica] font-black text-[#285a43] text-xl leading-7">
                    {testimonial.name}
                  </h3>
                </div>

                <div className="mt-10 relative">
                  <p className="opacity-80 font-['Raleway',Helvetica] font-medium text-[#121212] text-base leading-6 max-w-[243px] relative z-10">
                    {testimonial.quote}
                  </p>
                  <div className="absolute right-0 bottom-0 overflow-hidden opacity-5 z-0">
                    <img
                      className={
                        index === 0
                          ? "w-[235px]"
                          : index === 1
                            ? "w-40"
                            : "w-[173px]"
                      }
                      alt={testimonial.plantAlt}
                      src={testimonial.plantImage}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
