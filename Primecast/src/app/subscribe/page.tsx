"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, UseFormSetError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle } from "lucide-react";
import { sendConversionEvent, generateEventId } from "@/lib/facebook-conversions";

// Form validation schema - Permissive for custom validation
const subscribeSchema = z.object({
  name: z.string().transform(val => val.trim()),
  email: z.string().transform(val => val.trim()),
  whatsapp: z.string().transform(val => val.trim()),
  months: z.string(),
});

type SubscribeFormData = z.infer<typeof subscribeSchema>;

// Comprehensive form validation function that sets field errors
const validateFormFields = (data: SubscribeFormData, setError: UseFormSetError<SubscribeFormData>): boolean => {
  let hasErrors = false;
  
  // Clear any existing errors first
  // (React Hook Form will handle this automatically)
  
  // Name validation - handle whitespace properly
  const trimmedName = data.name ? data.name.trim() : '';
  if (!trimmedName || trimmedName.length === 0) {
    setError("name", { type: "manual", message: "Name is required" });
    hasErrors = true;
  } else if (trimmedName.length < 2) {
    setError("name", { type: "manual", message: "Name must be at least 2 characters" });
    hasErrors = true;
  }
  
  // Email validation - handle whitespace properly
  const trimmedEmail = data.email ? data.email.trim() : '';
  if (!trimmedEmail || trimmedEmail.length === 0) {
    setError("email", { type: "manual", message: "Email is required" });
    hasErrors = true;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("email", { type: "manual", message: "Please enter a valid email address" });
      hasErrors = true;
    }
  }
  
  // WhatsApp validation - handle spaces and whitespace properly
  const trimmedWhatsapp = data.whatsapp ? data.whatsapp.trim() : '';
  if (!trimmedWhatsapp || trimmedWhatsapp.length === 0) {
    setError("whatsapp", { type: "manual", message: "WhatsApp number is required" });
    hasErrors = true;
  } else {
    // Remove all spaces and whitespace characters
    const whatsappCleaned = trimmedWhatsapp.replace(/\s+/g, '');
    if (whatsappCleaned.length < 8) {
      setError("whatsapp", { type: "manual", message: "WhatsApp number must be at least 8 digits" });
      hasErrors = true;
    } else if (!/^\d+$/.test(whatsappCleaned)) {
      setError("whatsapp", { type: "manual", message: "WhatsApp number must contain only digits" });
      hasErrors = true;
    }
  }
  
  // Months (plan selection) validation
  const trimmedMonths = data.months ? data.months.trim() : '';
  if (!trimmedMonths || trimmedMonths.length === 0) {
    setError("months", { type: "manual", message: "Please select a subscription plan" });
    hasErrors = true;
  }
  
  return !hasErrors; // Return true if valid (no errors)
};

const subscriptionOptions = [
  { value: "12", label: "12 Months - €49" },
  { value: "6", label: "6 Months - €25" },
  { value: "1", label: "1 Month - €11" },
];

// Add interface for global window objects
declare global {
  interface Window {
    fbq?: (action: string, ...args: any[]) => void;
    _fbq?: any;
  }
}

export default function SubscribePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formStartTime] = useState(Date.now());
  const [honeypot, setHoneypot] = useState('');

  // Simple honeypot check - main bot protection is now global
  const checkHoneypot = () => {
    if (honeypot) {
      console.log('🍯 Honeypot triggered on subscribe page');
      return true;
    }
    return false;
  };

  const form = useForm<SubscribeFormData>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      months: "",
    },
  });

  const onSubmit = async (data: SubscribeFormData) => {
    setIsSubmitting(true);
    
    try {
      // STEP 1: Comprehensive form validation with field-level errors
      const isFormValid = validateFormFields(data, form.setError);
      if (!isFormValid) {
        console.log('❌ Form validation failed - check field errors below');
        setIsSubmitting(false);
        return;
      }
      
      console.log('✅ Form validation passed - all required fields are valid');
      
      // STEP 2: Check honeypot triggers
      if (honeypot) {
        console.log('🍯 Honeypot triggered - likely bot');
        alert('Security check failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // STEP 3: Time-based protection
      const timeTaken = Date.now() - formStartTime;
      console.log('⏱️ Time taken to fill form:', timeTaken + 'ms');
      if (timeTaken < 3000) {
        alert('Please take your time filling the form.');
        setIsSubmitting(false);
        return;
      }

      console.log('✅ All validation and security checks passed - submitting form');
      // Create a hidden form element to submit to Google Apps Script
      const hiddenForm = document.createElement('form');
      hiddenForm.action = 'https://script.google.com/macros/s/AKfycbwpZjyccXS35fBQRhQrkDqvGJY0Trm65tbJMt895Iuu6-_5uc1lr4-lFqx__5g4CRs/exec';
      hiddenForm.method = 'POST';
      hiddenForm.target = 'hidden_iframe';
      hiddenForm.style.display = 'none';

      // Add form fields
      const formFields = [
        { name: 'name', value: data.name },
        { name: 'email', value: data.email },
        { name: 'whatsapp', value: data.whatsapp },
        { name: 'months', value: data.months },
        { name: 'timestamp', value: new Date().toISOString() },
        { name: 'user_agent', value: navigator.userAgent },
        { name: 'form_time', value: (Date.now() - formStartTime).toString() }
      ];

      formFields.forEach(field => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = field.name;
        input.value = field.value;
        hiddenForm.appendChild(input);
      });

      // Create hidden iframe if it doesn't exist
      let iframe = document.getElementById('hidden_iframe') as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'hidden_iframe';
        iframe.name = 'hidden_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }

      // Add form to page, submit it, then remove it
      document.body.appendChild(hiddenForm);
      hiddenForm.submit();
      document.body.removeChild(hiddenForm);

      // Show success message after a short delay
      setTimeout(async () => {
        console.log("Form submitted successfully:", data);
        
        // Generate unique event ID for deduplication
        const eventId = generateEventId();
        
        // Track Facebook Pixel Lead event (generic data to avoid content policy issues)
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'Lead', {
            content_name: `Digital Service - ${data.months} months`,
            content_category: 'Digital Services',
            value: data.months === "12" ? 69 : data.months === "6" ? 37 : 19,
            currency: 'USD'
          }, { eventID: eventId }); // Add eventID for deduplication
        }
        
        // Send to Facebook Conversions API
        try {
          // Get client IP address for better matching - try multiple services
          let clientIp = '';
          try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            if (ipResponse.ok) {
              const ipData = await ipResponse.json();
              clientIp = ipData.ip;
            }
          } catch (error) {
            console.warn('Could not fetch IP from ipify:', error);
            // Try fallback IP service
            try {
              const ipResponse2 = await fetch('https://httpbin.org/ip');
              if (ipResponse2.ok) {
                const ipData2 = await ipResponse2.json();
                clientIp = ipData2.origin;
              }
            } catch (error2) {
              console.warn('Could not fetch IP from httpbin:', error2);
              // Try another fallback
              try {
                const ipResponse3 = await fetch('https://api.my-ip.io/ip');
                if (ipResponse3.ok) {
                  clientIp = await ipResponse3.text();
                }
              } catch (error3) {
                console.warn('Could not fetch IP from my-ip.io:', error3);
              }
            }
          }
          
          console.log('Detected client IP:', clientIp);
          
          const userData = {
            phone: data.whatsapp,
            clientIp: clientIp,
            userAgent: navigator.userAgent,
          };
          
          const eventData = {
            source_url: window.location.href,
            event_id: eventId, // Same event ID for deduplication
            custom_data: {
              currency: 'USD',
              value: data.months === "12" ? '69' : data.months === "6" ? '37' : '19',
              content_name: `Digital Service - ${data.months} months`,
              content_category: 'Digital Services',
            }
          };
          
          console.log('📞 Sending Lead event with phone:', {
            eventName: 'Lead',
            userData: userData,
            eventData: eventData
          });
          
          const conversionResult = await sendConversionEvent('Lead', userData, eventData);
          
          if (conversionResult.success) {
            console.log('Conversion API tracking successful');
          } else {
            console.warn('Conversion API tracking failed:', conversionResult.error);
          }
        } catch (error) {
          console.warn('Conversion API error:', error);
        }
        
        setIsSubmitted(true);
        form.reset();
        setIsSubmitting(false);
      }, 3000); // 3 second delay to allow form submission

    } catch (error) {
      console.error("Error submitting form:", error);
      alert('There was an error submitting the form. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sm:p-8 text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            {/* Success Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              You're All Set! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Your service access is being activated. Connect with us on WhatsApp for instant login details!
            </p>
            
            {/* WhatsApp Contact Button - Primary Action */}
            <a 
              href="https://wa.me/447429979120?text=Hi!%20I%20just%20signed%20up%20for%20your%20service.%20Please%20send%20me%20my%20login%20details.%20Thank%20you!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg mb-6"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Get Login Details on WhatsApp
            </a>
            
            {/* Next Steps */}
            <div className="bg-blue-50 rounded-xl p-4 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">What happens next:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>💬 Click the button above to message us</li>
                <li>🔑 Get instant login credentials</li>
                <li>💳 Complete payment to activate</li>
                <li>📱 Start using within 5 minutes</li>
                <li>🎧 Get 24/7 support included</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Custom CSS for enhanced scrolling animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 18s linear infinite;
          will-change: transform;
        }
        /* Removed hover pause to keep motion continuous */
        
        /* Smooth hardware acceleration */
        .logo-card {
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        /* Enhanced hover effects */
        .logo-card:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>

      {/* Meta Pixel Code */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '4203576886543737');
            fbq('track', 'PageView');
          `
        }}
      />
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{display: 'none'}}
          src="https://www.facebook.com/tr?id=4203576886543737&ev=PageView&noscript=1"
        />
      </noscript>

      {/* Statcounter Code */}
      <Script
        id="statcounter"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var sc_project=13150760; 
            var sc_invisible=1; 
            var sc_security="91bfed7b";
          `
        }}
      />
      <Script
        src="https://www.statcounter.com/counter/counter.js"
        strategy="afterInteractive"
        async
      />
      <noscript>
        <div className="statcounter">
          <a title="website statistics" href="https://statcounter.com/" target="_blank">
            <img 
              className="statcounter"
              src="https://c.statcounter.com/13150760/0/91bfed7b/1/" 
              alt="website statistics"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </a>
        </div>
      </noscript>

      <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
        <div className="w-full max-w-3xl lg:max-w-4xl mx-auto">
          {/* Main Headline - Very Top */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">
              Watch Everything You Love — Instantly
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-semibold">
              Save €300+/Year on Netflix, Disney+, HBO & More
            </p>
            <p className="mt-2 text-sm sm:text-base text-primary font-bold">
              ⚡ Limited Offer — Don’t Miss Out!
            </p>
          </div>

          {/* Premium Channel Showcase - Modern Design */}
          <div className="mb-10">
            
            {/* Clean Carousel Container */}
            <div className="relative py-6 px-2 sm:px-4">
              {/* Premium Carousel Track */}
              <div className="overflow-hidden">
                <div className="inline-flex w-max animate-scroll space-x-3 sm:space-x-4 md:space-x-6">
                  {/* First set of all premium logos */}
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/netflix.png" 
                        alt="Netflix" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/prime.png" 
                        alt="Prime Video" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/diseney.png" 
                        alt="Disney+" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/hbo.png" 
                        alt="HBO" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/hulu.png" 
                        alt="Hulu" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/Cartoon_Network.webp" 
                        alt="Cartoon Network" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/Discovery-and-DIRECTV.png" 
                        alt="Discovery" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/large-1734104572.png" 
                        alt="Streaming Service" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/unnamed.png" 
                        alt="Streaming Service" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/unnamed.webp" 
                        alt="Streaming Service" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/fb_share.fcf35390.jpg" 
                        alt="Streaming Service" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  
                  {/* Duplicate set for seamless infinite scroll */}
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/netflix.png" 
                        alt="Netflix" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/prime.png" 
                        alt="Prime Video" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/diseney.png" 
                        alt="Disney+" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/hbo.png" 
                        alt="HBO" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/hulu.png" 
                        alt="Hulu" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/Cartoon_Network.webp" 
                        alt="Cartoon Network" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/Discovery-and-DIRECTV.png" 
                        alt="Discovery" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/large-1734104572.png" 
                        alt="Streaming Service" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/unnamed.png" 
                        alt="Streaming Service" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/unnamed.webp" 
                        alt="Streaming Service" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 group">
                    <div className="w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-32 bg-white rounded-xl border border-gray-200/50 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                      <img 
                        src="/logos TV providers/fb_share.fcf35390.jpg" 
                        alt="Streaming Service" 
                        className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sm:p-8">
            {/* Form Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Start Your Subscription
              </h2>
              <p className="text-gray-600">
                Fill in your details to get instant access
              </p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field - First */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">Full Name *</FormLabel>
                        <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          className="h-11 xs:h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg" 
                          {...field} 
                        />
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field - Second */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">Email Address *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your email address" 
                          type="email" 
                          className="h-11 xs:h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* WhatsApp Field - Third */}
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">WhatsApp Number *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your WhatsApp number" 
                          className="h-11 xs:h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Plan Selection - Fourth */}
                <FormField
                  control={form.control}
                  name="months"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">Select Plan *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 xs:h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg">
                            <SelectValue placeholder="Choose your subscription plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subscriptionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="py-3">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Honeypot field - hidden from users, visible to bots */}
                <div style={{ display: 'none' }}>
                  <Input
                    type="text"
                    name="website"
                    placeholder="Leave this field empty"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Trust Indicator - Enhanced */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div className="text-green-800 text-sm font-bold">
                      Trusted by 10,000+ Happy Customers
                      </div>
                    </div>
                    <div className="text-green-700 text-xs font-medium">
                      ⭐⭐⭐⭐⭐ Join thousands who made the switch
                    </div>
                  </div>
                </div>

                {/* Submit Button - Enhanced */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 xs:h-14 text-base xs:text-lg font-bold bg-primary hover:bg-primary/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Start My Subscription
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}