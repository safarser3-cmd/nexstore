import { Metadata } from "next";
import { getSetting } from "@/lib/firebase/settings";

export const metadata: Metadata = {
  title: "Shipping and Delivery Policy | Nexa Store",
  description: "Information regarding shipping rates, delivery times, and methods.",
};

export default async function ShippingPage() {
  const data = await getSetting("shipping");
  
  const content = data?.content || `
    <h1 class="text-4xl font-bold mb-8">Shipping and Delivery Policy</h1>
    <div class="prose prose-slate dark:prose-invert max-w-none space-y-6">
      <p>Last updated: ${new Date().toLocaleDateString()}</p>
      
      <section>
        <h2 class="text-2xl font-semibold mb-4 mt-8">Processing Time</h2>
        <p>
          All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4 mt-8">Shipping Rates & Delivery Estimates</h2>
        <p>
          Shipping charges for your order will be calculated and displayed at checkout. We offer several shipping options:
        </p>
        <ul class="list-disc pl-6 mt-4 space-y-2">
          <li><strong>Standard Shipping:</strong> 3-5 business days</li>
          <li><strong>Expedited Shipping:</strong> 2-3 business days</li>
          <li><strong>Overnight Shipping:</strong> 1-2 business days</li>
        </ul>
        <p class="mt-4">
          Delivery delays can occasionally occur due to unforeseen circumstances.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4 mt-8">Shipment Confirmation & Order Tracking</h2>
        <p>
          You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4 mt-8">International Shipping</h2>
        <p>
          We currently ship to select countries worldwide. International shipping rates and times vary depending on the destination. Customs, duties, and taxes are the responsibility of the customer.
        </p>
      </section>
    </div>
  `;

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl" dangerouslySetInnerHTML={{ __html: content }} />
  );
}
