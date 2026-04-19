import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession, setSessionCookie } from "@/lib/auth";
import {
  createUser,
  getUserByEmail,
  initializeDatabase,
  isDatabaseReady
} from "@/lib/db";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const dbReady = await isDatabaseReady();

  if (!dbReady) {
    const initialized = await initializeDatabase();
    if (!initialized) {
      return NextResponse.json(
        {
          error:
            "Не удалось подключиться к PostgreSQL. Проверьте DATABASE_URL и состояние базы данных."
        },
        { status: 503 }
      );
    }
  }

  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Некорректные данные" },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase();
  const exists = await getUserByEmail(email);

  if (exists) {
    return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 409 });
  }

  const user = await createUser({
    id: crypto.randomUUID(),
    name: parsed.data.name,
    email,
    role: parsed.data.role,
    passwordHash: await bcrypt.hash(parsed.data.password, 10),
    createdAt: new Date().toISOString()
  });

  if (!user) {
    return NextResponse.json(
      { error: "Не удалось создать аккаунт. Попробуйте еще раз." },
      { status: 500 }
    );
  }

  const token = await createSession(user.id);
  await setSessionCookie(token);

  return NextResponse.json({ ok: true, role: user.role });
}
