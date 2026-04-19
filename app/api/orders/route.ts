import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createOrder, initializeDatabase, isDatabaseReady } from "@/lib/db";
import { checkoutSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Сначала войдите в аккаунт" }, { status: 401 });
  }

  if (user.role !== "buyer") {
    return NextResponse.json(
      { error: "Оформление заказа доступно только покупателю" },
      { status: 403 }
    );
  }

  const dbReady = await isDatabaseReady();
  if (!dbReady) {
    const initialized = await initializeDatabase();
    if (!initialized) {
      return NextResponse.json(
        { error: "База данных недоступна. Попробуйте позже." },
        { status: 503 }
      );
    }
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Проверьте данные заказа" },
      { status: 400 }
    );
  }

  const order = await createOrder({
    userId: user.id,
    customerName: parsed.data.customerName,
    customerEmail: parsed.data.customerEmail.toLowerCase(),
    phone: parsed.data.phone,
    city: parsed.data.city,
    address: parsed.data.address,
    items: parsed.data.items
  });

  if (!order) {
    return NextResponse.json(
      { error: "Не удалось оформить заказ. Попробуйте еще раз." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, orderId: order.orderId, totalAmount: order.totalAmount });
}
