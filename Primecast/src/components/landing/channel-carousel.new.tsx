"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";

type ChannelImage = {
  src: string;
  alt: string;
};

const channels: ChannelImage[] = [
  { src: "/channels/CBC_News.png", alt: "CBC News Logo" },
  { src: "/channels/Crave.png", alt: "Crave Logo" },
  { src: "/channels/CTV News .png", alt: "CTV News Logo" },
  { src: "/channels/ESPN.png", alt: "ESPN Logo" },
  { src: "/channels/Global News .png", alt: "Global News Logo" },
  { src: "/channels/HBO Max .svg", alt: "HBO Max Logo" },
  { src: "/channels/Movie Network.png", alt: "Movie Network Logo" },
  { src: "/channels/Netflix.png", alt: "Netflix Logo" },
  { src: "/channels/sportsnet.png", alt: "Sportsnet Logo" },
  { src: "/channels/TSN.webp", alt: "TSN Logo" }
];

export function ChannelCarousel() {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    // Preload all images
    channels.forEach((channel) => {
      const img = new Image();
      img.src = channel.src;
    });

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="mt-6 md:mt-10 w-full max-w-5xl mx-auto">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        className="w-full"
      >
        <CarouselContent>
          {channels.map((channel, index) => (
            <CarouselItem key={index} className="basis-1/4 xs:basis-1/4 sm:basis-1/5 md:basis-1/6 lg:basis-1/7">
              <div className="p-1.5 sm:p-2 md:p-2.5">
                <div className="relative w-[70px] h-[70px] xs:w-[85px] xs:h-[85px] sm:w-[95px] sm:h-[95px] md:w-[100px] md:h-[100px] mx-auto">
                  <Image
                    src={channel.src}
                    alt={channel.alt}
                    fill
                    className="object-contain filter brightness-95 hover:brightness-100 transition-opacity duration-200 will-change-[filter]"
                    sizes="(max-width: 640px) 70px, (max-width: 768px) 85px, (max-width: 1024px) 95px, 100px"
                    priority={true}
                    loading="eager"
                    quality={100}
                    fetchPriority="high"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
