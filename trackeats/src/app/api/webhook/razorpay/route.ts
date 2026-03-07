import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";

export const runtime = "nodejs"; // important for crypto

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const rawBody = await req.text(); // must use raw body
    const signature = req.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { success: false, message: "Invalid webhook signature" },
        { status: 400 },
      );
    }
    const event = JSON.parse(rawBody);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        {
          isPaid: true,
          razorpayPaymentId: payment.id,
        },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Webhook error: ${error}` },
      { status: 500 },
    );
  }
}
