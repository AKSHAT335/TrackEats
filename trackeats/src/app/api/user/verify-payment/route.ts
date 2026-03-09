import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import emitEventHandler from "@/lib/emitEventHandler";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 },
      );
    }

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        isPaid: true,
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true },
    );

    if (order?._id) {
      await emitEventHandler("order-payment-update", {
        orderId: order._id.toString(),
        isPaid: true,
        razorpayPaymentId: razorpay_payment_id,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Verification error: ${error}` },
      { status: 500 },
    );
  }
}
