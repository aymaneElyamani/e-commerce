import { Card, CardContent } from "../../../components/ui/card";

export const AboutUsSection = (): JSX.Element => {
  // Data for category cards
  const categories = [
    {
      id: 1,
      name: "Femmes",
      backgroundImage: "/image1.png",
      textColor: "#285a4380",
    },
    {
      id: 2,
      name: "Enfants",
      backgroundImage: "/image2.png",
      textColor: "#ffffff80",
    },
    {
      id: 3,
      name: "Hommes",
      backgroundImage: "/image3.png",
      textColor: "#285a4380",
    },
  ];

  return (
    <section className="w-full py-[50px] px-[100px]">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          <h2 className="max-w-[476px] text-[#285a43] text-4xl tracking-[1.44px] leading-[50.4px] [font-family:'Lato',Helvetica] font-normal [-webkit-text-stroke:1.1px_#285a43]">
            We Help Choose The Most Suitable Plants For You
          </h2>

          <h3 className="text-[#285a43] text-4xl tracking-[1.44px] leading-[50.4px] [font-family:'Lato',Helvetica] font-normal whitespace-nowrap mt-4 md:mt-0">
            Choose Your Categorie
          </h3>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-[30px]">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="w-full md:w-[350px] h-[380px] border-none rounded-none overflow-hidden"
            >
              <CardContent
                className="p-0 h-full relative"
                style={{
                  backgroundImage: `url(${category.backgroundImage})`,
                  backgroundSize: category.id === 2 ? "cover" : "100% 100%",
                  backgroundPosition: category.id === 2 ? "50% 50%" : "center",
                }}
              >
                <div
                  className="absolute top-36 left-1/2 transform -translate-x-1/2 [font-family:'Lato',Helvetica] font-black text-[64px] tracking-[2.56px] leading-[89.6px] whitespace-nowrap"
                  style={{ color: category.textColor }}
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
