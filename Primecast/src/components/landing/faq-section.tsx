import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tv, 
  Smartphone, 
  Shield, 
  Settings, 
  CreditCard, 
  Clock,
  MessageCircle,
  Users,
  Globe,
  Zap,
  BookOpen
} from "lucide-react";

const faqCategories = [
  {
    title: "Getting Started",
    icon: Zap,
    color: "bg-blue-500",
    questions: [
      {
        question: "What's included in each eBook?",
        answer: "Each eBook includes comprehensive chapters covering proven frameworks, real-world case studies, actionable strategies, and expert insights. You'll get access to practical business models, step-by-step processes, and proven techniques you can implement immediately.",
      },
      {
        question: "How do I access my eBook after purchase?",
        answer: "After purchasing, you'll receive instant access to download your eBook in PDF format via email. You can also access your purchased eBooks anytime from your account dashboard.",
      },
      {
        question: "Can I get a preview of the content before buying?",
        answer: "Yes! Each product page includes a detailed table of contents and sample chapters so you can review what's inside before making a purchase decision.",
      },
    ]
  },
  {
    title: "Reading & Access",
    icon: Smartphone,
    color: "bg-green-500",
    questions: [
      {
        question: "What devices can I read the eBooks on?",
        answer: "Our eBooks are in PDF format, which you can read on any device: tablets (iPad, Android), smartphones (iOS, Android), computers (Windows, Mac, Linux), e-readers, and more. Just open the PDF with any standard reader.",
      },
      {
        question: "Can I access my eBooks offline?",
        answer: "Absolutely! Download the eBooks to your device and read them anytime, anywhere—no internet connection required. Perfect for reading on flights, during commutes, or whenever you have time.",
      },
      {
        question: "Can I share my eBook with others?",
        answer: "eBooks are for personal use. While you can read them on your devices, sharing or distributing the files violates our terms. If you'd like to share the value, we offer team and corporate licenses.",
      },
    ]
  },
  {
    title: "eBook Selection",
    icon: BookOpen,
    color: "bg-purple-500",
    questions: [
      {
        question: "What topics do your eBooks cover?",
        answer: "We focus on business fundamentals: management strategies, organizational leadership, business development frameworks, marketing techniques, sales processes, and strategic planning. Each eBook is written by experts with real-world experience.",
      },
      {
        question: "How long are the eBooks?",
        answer: "Our eBooks range from 100-200+ pages depending on the topic. Each is designed to be thorough enough to provide deep value while remaining actionable and focused.",
      },
      {
        question: "Are new eBooks added regularly?",
        answer: "We're continuously expanding our library based on reader feedback and emerging business topics. Subscribe to our newsletter to stay updated on new releases.",
      },
    ]
  },
  {
    title: "Support & Questions",
    icon: Settings,
    color: "bg-orange-500",
    questions: [
      {
        question: "What if I have questions about the content?",
        answer: "Our support team is here to help! Contact us with any questions about the eBooks. While we can't provide personalized consulting, we're happy to clarify concepts and help you understand the material.",
      },
      {
        question: "Do you offer customer support?",
        answer: "Yes! We provide responsive customer support through email and contact form. We typically respond within 24 hours with answers to your questions about our eBooks and services.",
      },
      {
        question: "Can I request a specific business topic?",
        answer: "We'd love to hear what topics interest you! Send your suggestions to our team. We review all requests and use them to guide our future eBook development.",
      },
    ]
  },
  {
    title: "Billing & Refunds",
    icon: CreditCard,
    color: "bg-red-500",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and other secure payment methods. All transactions are encrypted and secure.",
      },
      {
        question: "What is your refund policy?",
        answer: "We offer a 14-day money-back guarantee on all eBook purchases. If you're not satisfied, contact our support team for a full refund. No questions asked.",
      },
      {
        question: "Are there discounts available?",
        answer: "We occasionally offer bundle discounts when purchasing multiple eBooks. Watch for seasonal promotions or contact us about volume pricing for teams and organizations.",
      },
    ]
  },
];

export function FAQSection() {
  return (
    <section className="w-full py-8 md:py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Everything you need to know about Veltrix. Can't find your answer? 
            <Button variant="link" className="p-0 h-auto font-medium text-primary hover:text-primary/80" asChild>
              <a href="/contact"> Contact our support team</a>
            </Button>
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${category.color} text-white`}>
                  <category.icon className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{category.title}</h3>
                <Badge variant="secondary" className="ml-auto">
                  {category.questions.length} questions
                </Badge>
              </div>
              
              <Accordion type="single" collapsible className="w-full space-y-3">
                {category.questions.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${categoryIndex}-${index}`} 
                    className="bg-card border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline px-6 py-4 hover:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center space-y-6 p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">Still have questions?</h3>
              <p className="text-muted-foreground">
                Our expert support team is available 24/7 to help you get the most out of Veltrix.
              </p>
            </div>
            <Button size="lg" className="px-8" asChild>
              <a href="/contact">
                <MessageCircle className="h-5 w-5 mr-2" />
                Live Chat Support
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
