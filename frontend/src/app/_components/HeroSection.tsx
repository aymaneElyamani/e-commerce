'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { PlayIcon } from 'lucide-react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';

// Array with image + text per slide
const slides = [
  {
    image: '/im1.jpeg',
    title: "Nature's Beauty Delivered to You",
    description:
      "Nature's beauty is just a click away with our online flower and plant shop. We offer a wide variety of flowers that will bring a touch of nature to your home!",
  },
  {
    image: '/im2.jpeg',
    title: 'Bring Green to Your Living Space',
    description:
      'Explore our premium collection of indoor plants that not only enhance your decor but also purify your air.',
  },
  {
    image: '/im5.jpeg',
    title: 'Blossom with the changing seasons',
    description:
      'Discover seasonal flowers that bloom with beauty and elegance, making every season special at your home.',
  },
];

export const HeroSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Auto-scroll every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      if (!emblaApi) return;
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full h-[700px] overflow-hidden">
      {/* Slider Images */}
      <div className="absolute inset-0 " ref={emblaRef} >
        <div className="flex h-full">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="min-w-full h-full relative flex-shrink-0"
            >
              <img
                className="w-full h-full object-cover"
                src={slide.image}
                alt={`Slide ${idx + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Hero Text */}
      <div className="absolute top-[180px] left-0 w-full flex flex-col items-center z-10">
        <h1 className="font-bold text-background text-2xl sm:text-[64px] max-w-[1000px] text-center px-10">
          {slides[selectedIndex].title}
        </h1>
        <p className="max-w-[787px] mt-[50px] font-medium text-background/90 text-sm px-20 sm:text-lg text-center leading-[25.2px]">
          {slides[selectedIndex].description}
        </p>
        <div className="flex gap-[35px] mt-[38px]">
          <Link href="#categories">
            <Button className="px-[50px] py-3 bg-primary rounded-[3px] font-bold text-primary-foreground text-sm tracking-[0.28px] leading-[16.8px]">
              Shop Now
            </Button>
          </Link>
          <Link
  href="https://youtu.be/wf4F2-9UXUo?si=4cnSf99L417xvPMa"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button
    variant="outline"
    className="px-[35px] py-2 rounded-[3px] border border-solid border-background bg-transparent flex items-center gap-2.5 font-semibold text-background text-sm tracking-[0.28px] leading-[16.8px] hover:bg-background/10"
  >
    <PlayIcon className="w-6 h-6" />
    Watch Video
  </Button>
</Link>

        </div>
      </div>

      {/* Pagination */}
      <div className="hidden sm:flex absolute top-[333px] right-[137px]  flex-col gap-[35px] z-10">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`text-base cursor-pointer transition-colors duration-300 ${
              index === selectedIndex
                ? 'font-black text-primary underline'
                : 'opacity-70 font-medium text-background'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          >
            0{index + 1}
          </div>
        ))}
      </div>
    </section>
  );
};
