
"use server";

import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const subscriptionFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  plan: z.string().min(1, { message: "Please select a plan." }),
});

export type ContactFormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success: boolean;
};

export type SubscriptionFormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success: boolean;
};

export async function submitContactForm(
  prevState: ContactFormState,
  data: FormData
): Promise<ContactFormState> {
  const formData = Object.fromEntries(data);
  const parsed = contactFormSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid form data",
      issues: parsed.error.issues.map((issue) => issue.message),
      fields: formData as Record<string, string>,
      success: false,
    };
  }

  // In a real application, you would send an email or save to a database here.
  console.log("Contact form submitted successfully!");
  console.log("Name:", parsed.data.name);
  console.log("Email:", parsed.data.email);
  console.log("Message:", parsed.data.message);

  return {
    message: "Thank you for your message! We'll get back to you soon.",
    success: true,
  };
}

export async function submitSubscriptionForm(
  prevState: SubscriptionFormState,
  data: FormData
): Promise<SubscriptionFormState> {
  const formData = Object.fromEntries(data);
  const parsed = subscriptionFormSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid form data",
      issues: parsed.error.issues.map((issue) => issue.message),
      fields: formData as Record<string, string>,
      success: false,
    };
  }

  // In a real application, you would process payment and create subscription
  console.log("Subscription form submitted successfully!");
  console.log("Name:", parsed.data.name);
  console.log("Email:", parsed.data.email);
  console.log("Plan:", parsed.data.plan);

  return {
    message: "Thank you for your subscription! Your order has been processed.",
    success: true,
  };
}
