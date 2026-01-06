import { useState } from "react";
import Image from "next/image";
import {
  FaStore,
  FaDollarSign,
  FaShoppingBag,
  FaMoneyBillWave,
} from "react-icons/fa";

const stats = [
  {
    value: "10.5k",
    label: "Sellers active our site",
    icon: <FaStore size={30} />,
  },
  {
    value: "33k",
    label: "Monthly Product Sale", // Correction ici
    icon: <FaDollarSign size={30} />,
  },
  {
    value: "45.5k",
    label: "Customer active in our site",
    icon: <FaShoppingBag size={30} />,
  },
  {
    value: "25k",
    label: "Annual gross sale in our site",
    icon: <FaMoneyBillWave size={30} />,
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen px-6 py-12 md:px-20">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <span className="hover:underline cursor-pointer">Home</span> /{" "}
        <span>About</span>
      </nav>

      {/* Titre */}
      <h1 className="text-4xl font-bold mb-6">About us</h1>

      {/* Section texte + image */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-muted-foreground mb-4 transition-opacity duration-500 hover:opacity-80">
            Welcome to our space  a fresh, student-powered online shop launched
            by douaa el yachioui. What started
            as a university project quickly grew into a passion-driven venture.
            We dive into thrift shops, dig up hidden gems, and bring them to you
            for unbeatable prices.
          </p>
          <p className="text-muted-foreground mb-4 transition-opacity duration-500 hover:opacity-80">
            Mainly focused on clothing, our platform is built on the belief that
            fashion doesn’t have to be expensive to be expressive.
          </p>
          <p className="text-muted-foreground mb-4 transition-opacity duration-500 hover:opacity-80">
            We’ve poured our energy, creativity, and late nights into making
            this site not just a school project  but something real. Something
            that could grow. So whether you’re here to support, explore, or
            score your next favorite fit  welcome to the beginning of something
            special.
          </p>
          <p className="text-muted-foreground transition-opacity duration-500 hover:opacity-80">
            Exclusive has more than a thousand products to offer, growing at a
            very fast pace.
          </p>
        </div>

        <div className="w-full">
          <Image
            src="/im10.jpeg"
            alt="Two women shopping"
            width={600}
            height={400}
            className="rounded-lg transform transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid md:grid-cols-4 gap-6 mt-16">
        {stats.map((stat, idx) => {
          const isActive = activeIndex === idx;

          return (
            <div
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`p-6 rounded-lg text-center cursor-pointer border transition-all duration-200 shadow-sm
                ${isActive ? "bg-primary text-primary-foreground scale-105" : "bg-card text-card-foreground"}
              `}
            >
              <div
                className={`w-12 h-12 mx-auto flex items-center justify-center rounded-full mb-4 
                  ${isActive ? "bg-background text-primary" : "bg-foreground text-background"}
                `}
              >
                {stat.icon}
              </div>
              <div className="text-xl font-bold">{stat.value}</div>
              <p className="text-sm mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
