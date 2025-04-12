import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

export const BenefitsSection = (): JSX.Element => {
  // Data for benefit cards
  const benefitCards = [
    {
      title: "Quality Product",
      description:
        "Our flowers are of the highest quality, carefully selected and sourced from reputable",
      image: "/time-cosuming.png",
      imageAlt: "Time cosuming",
      background: "#fbfbfb",
    },
    {
      title: "Always Fresh",
      description:
        "Our flowers are always fresh, handpicked and delivered promptly for maximum longevity and enjoyment.",
      image: "/grow-sprout.png",
      imageAlt: "Grow sprout",
      background: "#f8f8f8",
    },
    {
      title: "Work Smart",
      description:
        "We work smart, using innovative techniques and technology to streamline our processes",
      image: "/temperature.png",
      imageAlt: "Temperature",
      background: "#f8f8f8",
    },
    {
      title: "Excelent Service",
      description:
        "We pride ourselves on providing excellent service, going above and beyond to meet our customers' needs",
      image: "/pruning.png",
      imageAlt: "Pruning",
      background: "#fbfbfb",
    },
  ];

  // Data for image points
  const imagePoints = [
    { top: "476px", left: "547px" },
    { top: "433px", left: "645px" },
    { top: "464px", left: "454px" },
    { top: "428px", left: "402px" },
  ];

  return (
    <section className="relative w-full h-[758px] flex">
      {/* Left side image with points */}
      <div className="relative w-1/2 h-full bg-[url(/image-11.png)] bg-cover bg-[50%_50%]">
        {/* Image points */}
        {imagePoints.map((point, index) => (
          <div
            key={`point-${index}`}
            className="absolute w-6 h-6"
            style={{ top: point.top, left: point.left }}
          >
            <div className="relative w-5 h-5 top-0.5 left-0.5 bg-[#ffffffe6] rounded-[10px] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)]">
              <img
                className="absolute w-2 h-2 top-1.5 left-1.5"
                alt="Vector"
                src="/vector.svg"
              />
            </div>
          </div>
        ))}

        {/* Center image group */}
        <div className="absolute w-[266px] h-[267px] top-[73px] left-[309px]">
          <div className="top-[243px] left-[242px] absolute w-6 h-6">
            <div className="relative w-5 h-5 top-0.5 left-0.5 bg-[#ffffffe6] rounded-[10px] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)]">
              <img
                className="absolute w-2 h-px top-2.5 left-1.5 object-cover"
                alt="Line"
                src="/line-2.svg"
              />
            </div>
          </div>

          <img
            className="w-[175px] h-[175px] left-0 object-cover absolute top-0"
            alt="Image"
            src="/image-12.png"
          />

          <img
            className="absolute w-[76px] h-[76px] top-[173px] left-[172px]"
            alt="Line"
            src="/line-1.svg"
          />

          <div className="absolute w-2.5 h-2.5 top-[168px] left-[168px] bg-white rounded-[5px]" />
        </div>
      </div>

      {/* Right side benefits grid */}
      <div className="relative w-1/2 h-full grid grid-cols-2 grid-rows-2">
        {benefitCards.map((card, index) => (
          <Card
            key={`benefit-${index}`}
            className="relative h-full rounded-none border-none shadow-none"
            style={{ background: card.background }}
          >
            <CardContent className="p-0 h-full">
              <div className="absolute w-[126px] h-[126px] top-[54px] left-[34px]">
                <img
                  className="absolute w-auto h-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  alt={card.imageAlt}
                  src={card.image}
                />
              </div>
              <div className="absolute top-[189px] left-[57px] font-['Lato',Helvetica] font-black text-[#285a43] text-xl tracking-[0] leading-7 whitespace-nowrap">
                {card.title}
              </div>
              <div className="absolute w-[243px] top-[227px] left-[57px] opacity-80 font-['Raleway',Helvetica] font-medium text-[#121212] text-base tracking-[0] leading-6">
                {card.description}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
