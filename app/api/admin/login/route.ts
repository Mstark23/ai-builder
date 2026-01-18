import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  const { password } = body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 }
    );
  }

  const cookieStore = await cookies();

  cookieStore.set("admin_auth", "true", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return NextResponse.json({ success: true });
}
