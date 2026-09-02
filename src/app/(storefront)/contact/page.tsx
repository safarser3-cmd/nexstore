import { Metadata } from "next";
import { getSetting } from "@/lib/firebase/settings";

export const metadata: Metadata = {
  title: "Contact Us | Nexa Store",
  description: "Get in touch with the Nexa Store team.",
};

export default async function ContactPage() {
  const data = await getSetting("contact");
  
  const content = data?.content || `
    <h1 class="text-4xl font-bold mb-8">Contact Us</h1>
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <p class="text-lg text-muted-foreground mb-8">
        We're here to help! If you have any questions, concerns, or feedback, please don't hesitate to reach out to us using the contact details below.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        <div>
          <h2 class="text-2xl font-semibold mb-4">Customer Support</h2>
          <p class="mb-2"><strong>Email:</strong> support@nexastore.com</p>
          <p class="mb-2"><strong>Phone:</strong> +1 (555) 123-4567</p>
          <p class="mb-4"><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST</p>
        </div>
        <div>
          <h2 class="text-2xl font-semibold mb-4">Mailing Address</h2>
          <p class="mb-1">Nexa Store Inc.</p>
          <p class="mb-1">123 E-commerce Blvd, Suite 400</p>
          <p class="mb-1">Tech City, TC 12345</p>
          <p class="mb-1">United States</p>
        </div>
      </div>
    </div>
  `;

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl" dangerouslySetInnerHTML={{ __html: content }} />
  );
}
