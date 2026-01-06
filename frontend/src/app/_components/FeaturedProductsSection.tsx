import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JSX } from "react";

export const FeaturedProductsSection = (): JSX.Element => {
  const categories = [
    {
      id: "women",
      title: "Women",
      description: "Explore the latest trends for women.",
      image: "/women.svg",
    },
    {
      id: "men",
      title: "Men",
      description: "Discover stylish and comfortable menswear.",
      image: "/men.svg",
    },
    {
      id: "kids",
      title: "Kids",
      description: "Find the best for your little ones.",
      image: "/kids.svg",
    },
    {
      id: "accessories",
      title: "Accessories",
      description: "Complete your look with our accessories.",
      image: "/accessories.svg",
    },
  ];

  return (
    <section className="w-screen py-16 bg-muted">
      <div className="w-full flex flex-col items-center">
        <h2 className="text-4xl text-primary font-normal tracking-[1.44px] leading-[50.4px] [-webkit-text-stroke:1.1px_var(--accent)] mb-12">
          Our Gallery View
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1200px] mx-auto">
        {/* Left side: Main banner */}
        <div className="group relative h-full rounded-lg overflow-hidden bg-cover bg-center shadow-lg">
          <div
            className="absolute w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: "url('/images.svg')" }}
          ></div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-transparent to-foreground opacity-70 group-hover:opacity-80 transition-opacity duration-500"></div>
          {/* Text Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-start px-10">
            <h2 className="text-background text-4xl md:text-5xl font-bold mb-4">
              We Are Hexashop
            </h2>
            <p className="text-background text-lg mb-6">
              Discover the best products for your style and comfort.
            </p>
            <Button className="bg-background text-foreground font-semibold px-6 py-2 rounded-md hover:bg-muted transition">
              Shop Now
            </Button>
          </div>
        </div>

        {/* Right side: Categories */}
        <div className="grid grid-cols-2 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group relative h-[250px] md:h-[300px] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-2"
            >
              <CardContent className="p-0 h-full">
                <div className="relative h-full">
                  {/* Background Image */}
                  <img
                    src={category.image}
                    alt={category.title}
                    className="absolute w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                  {/* Text Content */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                    <h3 className="text-background text-2xl font-semibold">
                      {category.title}
                    </h3>
                    <p className="text-background text-sm mt-2">
                      {category.description}
                    </p>
                    <Button className="mt-4 border border-background text-background bg-transparent px-4 py-2 rounded-md hover:bg-background hover:text-foreground transition">
                      Discover More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};