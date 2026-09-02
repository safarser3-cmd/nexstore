import { Metadata } from "next";
import { getSetting } from "@/lib/firebase/settings";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy | Nexa Store",
  description: "Our policies regarding refunds, returns, and order cancellations.",
};

export default async function ReturnsPage() {
  const data = await getSetting("returns");
  
  const content = data?.content || `
    <h1 class="text-4xl font-bold mb-8">Refund and Cancellation Policy</h1>
    <div class="prose prose-slate dark:prose-invert max-w-none space-y-6">
      <p>Last updated: ${new Date().toLocaleDateString()}</p>
      
      <section>
        <h2 class="text-2xl font-semibold mb-4 mt-8">Order Cancellation</h2>
        <p>
          You can cancel your order within 24 hours of placing it, provided it has not yet been shipped. To request a cancellation, please contact our customer support team immediately with your order number. If the order has already been dispatched, you will need to follow our return process once you receive the item.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4 mt-8">Returns</h2>
        <p>
          We accept returns within 14 days of you receiving your order. To be eligible for a return, your item must be unused, in the same condition that you received it, and in its original packaging. You will need to provide a receipt or proof of purchase.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4 mt-8">Refunds</h2>
        <p>
          Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment (e.g., via Instamojo), within a certain amount of days.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4 mt-8">Non-Returnable Items</h2>
        <p>
          Several types of goods are exempt from being returned, such as perishable goods, custom products, personal care items, and gift cards.
        </p>
      </section>
    </div>
  `;

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl" dangerouslySetInnerHTML={{ __html: content }} />
  );
}
