"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const commonFeatures = [
  "Instant PDF download",
  "Lifetime access and updates",
  "Proven templates & worksheets",
  "Actionable step-by-step frameworks",
  "Designed for leaders, founders & managers",
  "Mobile-friendly reading experience",
  "Works offline once downloaded",
  "No recurring subscriptions"
];

// Product catalog (eBooks)
const pricingPlans = [
  {
    id: "top-tier-management",
    name: "Top-Tier Management Explained",
    price: "$69",
    originalPrice: "$299",
    savings: "$230",
    features: [
      "Advanced leadership frameworks",
      "Decision-making playbooks",
      "Real-world executive case studies"
    ],
    buttonLabel: "Buy Now",
    popular: true,
  },
  {
    id: "organizational-management",
    name: "Organizational Management Explained",
    price: "$49",
    originalPrice: "$99",
    savings: "$50",
    features: [
      "Building high-performing teams",
      "Organizational design templates",
      "Practical structure playbooks"
    ],
    buttonLabel: "Buy Now",
    popular: false,
  },
  {
    id: "consulting-management",
    name: "Consulting Management Explained",
    price: "$49",
    originalPrice: "$99",
    savings: "$50",
    features: [
      "Client acquisition strategies",
      "Project delivery frameworks",
      "Partnership building playbooks"
    ],
    buttonLabel: "Buy Now",
    popular: false,
  },
  {
    id: "marketing-frameworks",
    name: "Marketing Frameworks Explained",
    price: "$49",
    originalPrice: "$99",
    savings: "$50",
    features: [
      "Proven marketing funnels",
      "Positioning & messaging templates",
      "Campaign planning worksheets"
    ],
    buttonLabel: "Buy Now",
    popular: false,
  },
];

export function PricingSection() {
  const router = useRouter();

  const handlePlanClick = (planName: string) => {
    // For now, direct users to the contact page to arrange purchase.
    router.push('/contact');
  };
  
  return (
    <section id="products" className="w-full py-8 md:py-12 lg:py-16 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 md:px-6">
      </div>
    </section>
  );
}
