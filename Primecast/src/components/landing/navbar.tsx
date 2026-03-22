"use client";

import Link from "next/link";
import { Menu, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
	{ label: "Home", href: "/" },
	{ label: "About", href: "/#about" },
	{ label: "FAQ", href: "/faq" },
	{ label: "Contact", href: "/contact" },
];

export function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const closeMobileMenu = () => setIsMobileMenuOpen(false);

	const handleMobileMenuOpen = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		// Scroll to top instantly
		window.scrollTo({ top: 0, behavior: 'instant' });
		// Open the menu immediately
		setIsMobileMenuOpen(true);
	};

	const handleNavigation = (href: string) => {
		// Close menu first
		setIsMobileMenuOpen(false);
		
		if (href.startsWith('/#')) {
			// Check if we're on the home page
			if (window.location.pathname === '/') {
				// We're on home page, scroll to section
				const sectionId = href.substring(2);
				const element = document.getElementById(sectionId);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' });
				}
			} else {
				// We're on a different page, navigate to home with anchor
				window.location.href = href;
			}
		} else {
			// For regular navigation
			window.location.href = href;
		}
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link
					href="/"
					className="flex items-center gap-1.5 xs:gap-2"
					onClick={closeMobileMenu}
				>
					<BookOpen className="h-6 w-6 xs:h-7 xs:w-7 text-primary" />
				<span className="text-lg xs:text-xl font-bold">Veltrix</span>
				</Link>

				<nav className="hidden md:flex gap-6">
					{navItems.map((item) => (
						<Link
							key={item.label}
							href={item.href}
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
						>
							{item.label}
						</Link>
					))}
				</nav>

				<div className="md:hidden">
					<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
						<SheetTrigger asChild>
							<Button 
								variant="outline" 
								size="icon"
								onClick={handleMobileMenuOpen}
								onMouseDown={(e) => e.preventDefault()}
								className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
							>
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle Menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[280px] sm:w-[320px]">
							<SheetHeader>
								<SheetTitle className="sr-only">Navigation Menu</SheetTitle>
							</SheetHeader>
							<div className="flex flex-col space-y-6">
								<div className="flex items-center justify-between p-6 border-b">
									<Link
										href="/"
										className="flex items-center gap-2"
										onClick={closeMobileMenu}
									>
										<BookOpen className="h-7 w-7 text-primary" />
										<span className="text-xl font-bold">Business Explained</span>
									</Link>
								</div>
								<nav className="px-6" aria-label="Main navigation">
									<h2 className="sr-only">Navigation Menu</h2>
									<div className="flex flex-col space-y-4">
										{navItems.map((item, index) => (
											<button
												key={item.label}
												onClick={() => handleNavigation(item.href)}
												className="text-left text-lg font-medium text-foreground transition-colors hover:text-primary focus:outline-none focus:text-primary"
											>
												{item.label}
											</button>
										))}
									</div>
								</nav>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
