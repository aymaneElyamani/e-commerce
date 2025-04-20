import { Card, CardContent } from "../../../components/ui/card";

export const AboutUsSection = (): JSX.Element => {
  const categories = [
    {
      id: 1,
      name: "Femmes",
      backgroundImage: "/image1.png",
      textColor: "#285a43",
    },
    {
      id: 2,
      name: "Enfants",
      backgroundImage: "/image2.png",
      textColor: "#ffffff",
    },
    {
      id: 3,
      name: "Hommes",
      backgroundImage: "/image3.png",
      textColor: "#285a43",
    },
  ];

  return (
    <section className="w-full py-[50px] px-[100px] bg-[#f9f9f9]">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-8 mt-10">
          <h2 className="max-w-[476px] text-[#285a43] text-3xl tracking-[1.44px] leading-[50.4px] [font-family:'Lato',Helvetica] font-normal [-webkit-text-stroke:1.1px_#285a43]">
            We Help Choose The Most Suitable Plants For You
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-[30px]">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group w-full md:w-[350px] h-[400px] border-none rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <CardContent className="p-0 h-full relative">
                {/* Image with zoom effect */}
                <div
                  className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${category.backgroundImage})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                ></div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>

                {/* Text */}
                <div
                  className="absolute inset-0 flex items-center justify-center [font-family:'Lato',Helvetica] font-black text-[48px] tracking-[2.56px] leading-[64px] text-center transition-transform duration-500 group-hover:scale-105"
                  style={{ color: category.textColor, textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
                >
                  {category.name}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};