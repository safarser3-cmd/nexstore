import { Metadata } from "next";
import { getSetting } from "@/lib/firebase/settings";

export const metadata: Metadata = {
  title: "Terms of Service | Nexa Store",
  description: "Terms and Conditions for Nexa Store.",
};

export default async function TermsPage() {
  const data = await getSetting("terms");
  
  const content = data?.content || `
    <h1 class="text-4xl font-bold mb-8">Terms and Conditions</h1>
    <div class="prose prose-slate dark:prose-invert max-w-none space-y-6">
      <p>Last updated: ${new Date().toLocaleDateString()}</p>
      
      <section>
        <h2 class="text-2xl font-semibold mb-4 mt-8">1. Introduction</h2>
        <p>
          Welcome to Nexa Store. These terms and conditions outline the rules and regulations for the use of Nexa Store's Website, located at our domain.
          By accessing this website we assume you accept these terms and conditions. Do not continue to use Nexa Store if you do not agree to take all of the terms and conditions stated on this page.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4 mt-8">2. Payment and Pricing</h2>
        <p>
          All prices are subject to change without notice. We reserve the right to modify or discontinue the Service (or any part or content thereof) without notice at any time. We use secure payment gateways like Instamojo for processing transactions safely.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4 mt-8">3. User Accounts</h2>
        <p>
          When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4 mt-8">4. Limitation of Liability</h2>
        <p>
          In no event shall Nexa Store, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>
      </section>
    </div>
  `;

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl" dangerouslySetInnerHTML={{ __html: content }} />
  );
}
