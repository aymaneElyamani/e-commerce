import Image from "next/image";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const teamMembers = [
  {
    name: "Aymane El Yamani",
    title: "Founder & Chairman",
    image: "/aymane.png", // Assure-toi que cette image existe dans le dossier public
  },
  {
    name: "Mohammed Anouar",
    title: "Managing and sales director",
    image: "/anouar.jpg", // Pas d'image
  },
  {
    name: "Mohammed Aassou",
    title: "Product Designer",
    image: "/aassoi.png", // Assure-toi que cette image existe dans le dossier public
  },
];

export default function TeamSection() {
  return (
    <div className="px-6 py-16 md:px-20 bg-background">
      <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {teamMembers.map((member, idx) => (
          <div key={idx} className="text-center">
            <div className="w-full h-80 relative rounded-lg overflow-hidden mb-4 bg-muted">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xl">
                  No Image
                </div>
              )}
            </div>
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-sm text-primary">{member.title}</p>
            <div className="flex justify-center gap-4 mt-3 text-primary">
              <FaTwitter className="cursor-pointer hover:text-secondary" />
              <FaInstagram className="cursor-pointer hover:text-secondary" />
              <FaLinkedin className="cursor-pointer hover:text-secondary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
