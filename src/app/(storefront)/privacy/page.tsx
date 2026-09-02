import { Metadata } from "next";
import { getSetting } from "@/lib/firebase/settings";

export const metadata: Metadata = {
  title: "Privacy Policy | Nexa Store",
  description: "Privacy Policy for Nexa Store.",
};

export default async function PrivacyPage() {
  const data = await getSetting("privacy");
  
  const content = data?.content || `
    <h1 class="text-4xl font-bold mb-8">Privacy Policy</h1>
    <div class="prose prose-slate dark:prose-invert max-w-none space-y-6">
      <p>Last updated: ${new Date().toLocaleDateString()}</p>
      
      <section>
        <h2 class="text-2xl font-semibold mb-4 mt-8">Information We Collect</h2>
        <p>
          We collect information from you when you register on our site, place an order, subscribe to our newsletter, respond to a survey, or fill out a form. When ordering or registering on our site, as appropriate, you may be asked to enter your: name, e-mail address, mailing address, phone number, or credit card information.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4 mt-8">How We Use Your Information</h2>
        <p>
          Any of the information we collect from you may be used in one of the following ways:
        </p>
        <ul class="list-disc pl-6 mt-4 space-y-2">
          <li>To personalize your experience.</li>
          <li>To improve our website.</li>
          <li>To improve customer service.</li>
          <li>To process transactions securely.</li>
          <li>To send periodic emails regarding your order or other products and services.</li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4 mt-8">Security</h2>
        <p>
          We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We use state-of-the-art secure servers. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers (like Instamojo) database only to be accessible by those authorized with special access rights to such systems.
        </p>
      </section>
    </div>
  `;

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl" dangerouslySetInnerHTML={{ __html: content }} />
  );
}
