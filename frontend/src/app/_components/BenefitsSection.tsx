import { Card, CardContent } from "@/components/ui/card";
import { JSX } from "react";

export const BenefitsSection = (): JSX.Element => {
  const benefitCards = [
    {
      title: "Quality Product",
      description:
        "Our flowers are of the highest quality, carefully selected and sourced from reputable",
      image: "/im1.png",
      imageAlt: "Time consuming",
      background: "#fbfbfb",
    },
    {
      title: "Always Fresh",
      description:
        "Our flowers are always fresh, handpicked and delivered promptly for maximum longevity and enjoyment.",
      image: "/im2.png",
      imageAlt: "Grow sprout",
      background: "#f8f8f8",
    },
    {
      title: "Work Smart",
      description:
        "We work smart, using innovative techniques and technology to streamline our processes",
      image: "/im3.png",
      imageAlt: "Temperature",
      background: "#f8f8f8",
    },
    {
      title: "Excellent Service",
      description:
        "We pride ourselves on providing excellent service, going above and beyond to meet our customers' needs",
      image: "/im4.png",
      imageAlt: "Pruning",
      background: "#fbfbfb",
    },
  ];

  return (
    <section className="w-full bg-white py-12">
      <div className=" flex flex-col lg:flex-row min-h-[400px] lg:min-h-screen">
        {/* Left Image */}
        <div className="relative w-full lg:w-1/2 h-[400px] lg:h-auto bg-cover bg-center bg-[url('/image-11.png')] flex justify-center items-center">
          {/* Floating Image & Center Group */}
          <div className="relative w-64 h-64">
            <img
              className="w-44 h-44 object-cover rounded-full mx-auto"
              src="/image-12.png"
              alt="Center Flower"
            />
            <img
              className="absolute w-16 h-16 top-40 left-40"
              src="/line-1.svg"
              alt="Line"
            />
            <div className="absolute w-2.5 h-2.5 top-[168px] left-[168px] bg-white" />
          </div>
        </div>

        {/* Benefits Section */}
        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 ">
          {benefitCards.map((card, index) => (
            <Card
              key={`benefit-${index}`}
              style={{ background: card.background }}
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  className="w-16 h-16 mb-4"
                />
                <h3 className="text-xl font-bold text-primary">{card.title}</h3>
                <p className="text-sm text-gray-700 mt-2">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
