import { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import ProductDetail from "@/components/product/product-detail";

const books = [
  {
    id: "top-tier-management",
    title: "Top-Tier Management Explained",
    slug: "top-tier-management",
    image: "/images/books/top-tier-management.webp",
    images: [
      "/images/books/top-tier-management.webp",
      "/images/books/top-tier-management-2.webp",
      "/images/books/top-tier-management-3.webp",
      "/images/books/top-tier-management-4.webp",
    ],
    price: 49,
    oldPrice: 99,
    description: "Master the principles of executive management and lead with confidence. This comprehensive guide covers strategic decision-making, team leadership, executive communication, and building high-performance organizations.",
    chapters: [
      "Chapter 1: The Foundation of Executive Leadership",
      "Chapter 2: Strategic Decision-Making Frameworks",
      "Chapter 3: Building and Managing High-Performance Teams",
      "Chapter 4: Executive Communication & Influence",
      "Chapter 5: Organizational Change Management",
      "Chapter 6: Performance Metrics & KPIs",
      "Chapter 7: Risk Management at the Executive Level",
      "Chapter 8: Succession Planning & Legacy Building"
    ],
    pages: 156,
    rating: 4.8,
    reviews: 342,
  },
  {
    id: "organizational-management",
    title: "Organizational Management Explained",
    slug: "organizational-management",
    image: "/images/books/organizational-management.webp",
    images: [
      "/images/books/organizational-management.webp",
      // Add more images here when available
    ],
    price: 49,
    oldPrice: 99,
    description: "Learn to design, structure, and manage organizations for maximum efficiency and growth. Perfect for managers and organizational leaders seeking to improve operations and team dynamics.",
    chapters: [
      "Chapter 1: Organizational Design Principles",
      "Chapter 2: Hierarchies and Flatter Structures",
      "Chapter 3: Roles and Responsibilities",
      "Chapter 4: Departmental Workflows",
      "Chapter 5: Cross-Functional Collaboration",
      "Chapter 6: Organizational Culture & Values",
      "Chapter 7: Managing Change Initiatives",
      "Chapter 8: Performance Management Systems"
    ],
    pages: 142,
    rating: 4.7,
    reviews: 298,
  },
  {
    id: "business-development",
    title: "Business Development Explained",
    slug: "business-development",
    image: "/images/books/business-development.webp",
    images: [
      "/images/books/business-development.webp",
      // Add more images here when available
    ],
    price: 49,
    oldPrice: 99,
    description: "Develop strategies for sustainable business growth. This eBook covers market analysis, partnership development, sales strategies, and scaling operations in competitive markets.",
    chapters: [
      "Chapter 1: Sales Fundamentals",
      "Chapter 2: Lead Generation & Pipeline Management",
      "Chapter 3: Client Relationship Management",
      "Chapter 4: Negotiation Strategies",
      "Chapter 5: Building Strategic Partnerships",
      "Chapter 6: Market Expansion & New Revenue Streams",
      "Chapter 7: Pricing Strategies & Value Proposition",
      "Chapter 8: Scaling Operations for Growth"
    ],
    pages: 148,
    rating: 4.9,
    reviews: 367,
  },
  {
    id: "marketing-frameworks",
    title: "Marketing Frameworks Explained",
    slug: "marketing-frameworks",
    image: "/images/books/marketing-frameworks.webp",
    images: [
      "/images/books/marketing-frameworks.webp",
      // Add more images here when available
    ],
    price: 49,
    oldPrice: 99,
    description: "Master proven marketing frameworks and methodologies. Learn digital marketing, brand positioning, customer acquisition, and retention strategies that drive real results.",
    chapters: [
      "Chapter 1: Marketing Fundamentals & Strategy",
      "Chapter 2: Customer Persona Development",
      "Chapter 3: Brand Positioning & Messaging",
      "Chapter 4: Digital Marketing Essentials",
      "Chapter 5: Content Marketing & SEO",
      "Chapter 6: Social Media Strategy",
      "Chapter 7: Analytics & Measurement",
      "Chapter 8: Customer Retention & Loyalty"
    ],
    pages: 152,
    rating: 4.8,
    reviews: 315,
  },
  {
    id: "consulting-management",
    title: "Consulting Management Explained",
    slug: "consulting-management",
    image: "/images/books/consulting-mgm-1.webp",
    images: [
      "/images/books/consulting-mgm-1.webp",
      "/images/books/consulting-mgm-2.webp",
      "/images/books/consulting-mgm-3.webp",
      "/images/books/consulting-mgm-4.webp",
    ],
    price: 49,
    oldPrice: 99,
    description: "Master the art of consulting management and build successful client relationships. This comprehensive guide covers client acquisition, project management, delivery excellence, and building a thriving consulting practice.",
    chapters: [
      "Chapter 1: The Consulting Mindset",
      "Chapter 2: Client Acquisition & Relationship Building",
      "Chapter 3: Proposal Development & Pricing Strategies",
      "Chapter 4: Project Planning & Scope Management",
      "Chapter 5: Delivery Excellence & Quality Control",
      "Chapter 6: Change Management & Client Communication",
      "Chapter 7: Risk Assessment & Mitigation",
      "Chapter 8: Building Long-term Client Partnerships"
    ],
    pages: 148,
    rating: 4.9,
    reviews: 267,
  },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = books.find(b => b.slug === slug);
  
  if (!book) {
    return {
      title: "Product Not Found",
      description: "The product page you're looking for doesn't exist.",
    };
  }

  return {
    title: `${book.title} - Premium eBook`,
    description: book.description,
  };
}

export async function generateStaticParams() {
  return books.map(book => ({
    slug: book.slug,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = books.find(b => b.slug === slug);

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Product Not Found</h1>
            <p className="text-muted-foreground mt-2">The eBook you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ProductDetail book={book} />
      </main>
      <Footer />
    </div>
  );
}
