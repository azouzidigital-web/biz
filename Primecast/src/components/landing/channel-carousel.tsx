"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const channels = [
	{
		src: "/channels/CBC_logo.webp",
		alt: "CBC Logo",
	},
	{
		src: "/channels/Crave_logo.webp",
		alt: "Crave Logo",
	},
	{
		src: "/channels/CTV_logo.webp",
		alt: "CTV Logo",
	},
	{
		src: "/channels/Logo_Sportsnet.webp",
		alt: "Sportsnet Logo",
	},
	{
		src: "/channels/NBA_TV_Canada.webp",
		alt: "NBA TV Canada Logo",
	},
	{
		src: "/channels/Paramount_Plus.webp",
		alt: "Paramount Plus Logo",
	},
	{
		src: "/channels/Starz.webp",
		alt: "Starz Logo",
	},
	{
		src: "/channels/Super_Channel.webp",
		alt: "Super Channel Logo",
	},
	{
		src: "/channels/TSN_Logo.webp",
		alt: "TSN Logo",
	},
	{
		src: "/channels/W_Network_Logo.webp",
		alt: "W Network Logo",
	},
];

export function ChannelCarousel() {
	const [api, setApi] = useState<CarouselApi>();

	useEffect(() => {
		if (!api) return;

		// Preload all images for instant display
		channels.forEach((channel) => {
			const img = document.createElement('img');
			img.src = channel.src;
		});

		// Start auto-scroll immediately - first scroll happens right away
		const scrollNext = () => {
			try {
				const emblaApi = api as any;
				if (emblaApi.canScrollNext && emblaApi.canScrollNext()) {
					emblaApi.scrollNext();
				} else if (emblaApi.scrollTo) {
					emblaApi.scrollTo(0);
				}
			} catch (error) {
				console.warn('Carousel scroll error:', error);
			}
		};

		// Scroll immediately on load
		const initialTimeout = setTimeout(scrollNext, 100); // Tiny delay to ensure API is ready

		// Then continue with regular intervals
		const interval = setInterval(scrollNext, 3500);

		return () => {
			clearTimeout(initialTimeout);
			clearInterval(interval);
		};
	}, [api]);

	return (
		<div className="w-full max-w-6xl mx-auto px-4">
			<Carousel
				setApi={setApi}
				opts={{ 
					align: "start", 
					loop: true,
					skipSnaps: false,
					dragFree: false,
					containScroll: "trimSnaps"
				}}
				className="w-full"
			>
				<CarouselContent className="-ml-2 md:-ml-3">
					{/* Triple the channels for smooth infinite scroll */}
					{[...channels, ...channels, ...channels].map((channel, index) => (
						<CarouselItem key={index} className="pl-2 md:pl-3 basis-1/4 sm:basis-1/5 md:basis-1/6">
							<div className="h-14 sm:h-16 w-full relative rounded-lg bg-white/5 overflow-hidden">
								<div className="absolute inset-0 flex items-center justify-center p-2">
									<div className="relative h-full w-full">
										<Image
											src={channel.src}
											alt={channel.alt}
											fill
											priority={true} // All images have priority for instant loading
											loading="eager"
											sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 16vw"
											className="object-contain"
											quality={90}
										/>
									</div>
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}