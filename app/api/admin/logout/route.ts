import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/adminSession";

export async function POST() {
  cookies().delete(ADMIN_COOKIE);
  return NextResponse.json({ success: true });
}
