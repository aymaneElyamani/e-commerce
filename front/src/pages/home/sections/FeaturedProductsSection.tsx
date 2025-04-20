import { Card, CardContent } from "../../../components/ui/card";

export const FeaturedProductsSection = (): JSX.Element => {
  // Data for category cards
  const categories = [
    {
      id: "kids",
      title: "Kids",
      description: "Lorem Ipsum is simply dummy",
      image: "/kids.svg",
      position: { top: "391px", left: "849px" },
    },
    {
      id: "men",
      title: "Men",
      description: "Lorem Ipsum is simply dummy",
      image: "/men.svg",
      position: { top: "51px", left: "1215px" },
    },
    {
      id: "accessories",
      title: "Accessories",
      description: "Lorem Ipsum is simply dummy",
      image: "/accessories.svg",
      position: { top: "391px", left: "1215px" },
    },
  ];

  return (
    <section className="relative w-full h-[758px] bg-white">
      {/* Main featured banner */}
      <div className="relative w-[709px] h-[657px] mt-[51px] ml-[116px] bg-[url(/images.svg)] bg-cover bg-center">
        <div className="absolute inset-0 bg-[#00000080]" />
        <div className="absolute top-[210px] left-[71px] w-[570px]">
          <h2 className="font-bold text-white text-[56px] font-['Inter',Helvetica]">
            We Are Hexashop
          </h2>
          <p className="mt-[47px] text-white text-lg font-normal font-['Inter',Helvetica]">
            Lorem Ipsum is simply dummy text of the printing
            <br />
            and typesetting industry.
          </p>
        </div>
      </div>

      {/* Category cards */}
      {categories.map((category) => (
        <Card
          key={category.id}
          className={`absolute w-[343px] h-[317px] overflow-hidden`}
          style={{ top: category.position.top, left: category.position.left }}
        >
          <CardContent className="p-0 h-full">
            <div className="relative h-full">
              {category.id !== "men" ? (
                <img
                  className="absolute w-full h-full object-cover"
                  alt={category.title}
                  src={category.image}
                />
              ) : (
                <div className="absolute w-full h-full bg-[url(/men.svg)] bg-cover bg-center" />
              )}
              <div className="absolute inset-0 bg-[#00000080]" />
              <div className="absolute top-[76px] left-[22px] w-[302px]">
                <h3
                  className={`font-bold text-white text-[25px] font-['Inter',Helvetica] text-center ${
                    category.id === "accessories"
                      ? "ml-[60px]"
                      : category.id === "men"
                        ? "ml-[117px]"
                        : "ml-[116px]"
                  }`}
                >
                  {category.title}
                </h3>
                <p className="mt-[33px] text-white text-lg font-normal font-['Inter',Helvetica]">
                  {category.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};
