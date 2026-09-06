import { NextRequest, NextResponse } from "next/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";

export async function POST(req: NextRequest) {
  try {
    const cashfree = new Cashfree(
      CFEnvironment.PRODUCTION,
      process.env.CASHFREE_APP_ID || "",
      process.env.CASHFREE_SECRET_KEY || ""
    );
    cashfree.XApiVersion = "2025-01-01";

    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const response = await cashfree.PGFetchOrder(orderId);
    
    return NextResponse.json({
      status: response.data.order_status, // "PAID", "ACTIVE", "EXPIRED"
      orderData: response.data
    });
  } catch (error: any) {
    console.error("Error verifying Cashfree order:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to verify order" }, { status: 500 });
  }
}
