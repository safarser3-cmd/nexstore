import { NextRequest, NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";

export async function POST(req: NextRequest) {
  try {
    // Initialize Cashfree dynamically inside the handler for Vercel
    const cashfree = new Cashfree(
      CFEnvironment.PRODUCTION,
      (process.env.CASHFREE_APP_ID || "").trim(),
      (process.env.CASHFREE_SECRET_KEY || "").trim()
    );
    cashfree.XApiVersion = "2025-01-01";

    const body = await req.json();
    const { orderId, amount, customerPhone, customerEmail, customerName } = body;

    if (!orderId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const request = {
      order_amount: parseFloat(amount),
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: orderId, // using orderId as customerId for simplicity if no user login
        customer_phone: customerPhone || "9999999999",
        customer_email: customerEmail || "customer@example.com",
        customer_name: customerName || "Customer"
      },
      order_meta: {
        payment_methods: "upi" // Restrict to UPI only
      }
    };

    const response = await cashfree.PGCreateOrder(request);
    
    return NextResponse.json({
      paymentSessionId: response.data.payment_session_id,
      orderId: response.data.order_id
    });
  } catch (error: any) {
    console.error("Error creating Cashfree order:", error.response?.data || error.message || error);
    return NextResponse.json(
      { 
        error: "Failed to create order", 
        details: error.response?.data?.message || error.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}
