import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession, setSessionCookie } from "@/lib/auth";
import {
  ensureDemoUser,
  getUserByEmail,
  initializeDatabase,
  isDatabaseReady
} from "@/lib/db";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const dbReady = await isDatabaseReady();

  if (!dbReady) {
    const initialized = await initializeDatabase();
    if (!initialized) {
      return NextResponse.json(
        {
          error:
            "Не удалось подключиться к PostgreSQL. Проверьте, что сервер базы данных запущен и DATABASE_URL указан правильно."
        },
        { status: 503 }
      );
    }
  }

  await ensureDemoUser();

  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Некорректные данные" },
      { status: 400 }
    );
  }

  const user = await getUserByEmail(parsed.data.email);

  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
  }

  const validPassword = await bcrypt.compare(parsed.data.password, user.passwordHash);

  if (!validPassword) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  const token = await createSession(user.id);
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
