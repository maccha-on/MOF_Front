import { NextResponse } from "next/server";
import { auth } from "@/src/auth";

export async function GET(req: Request) {
  const session = await auth();
  console.log("BACKEND_API_URL:", process.env.BACKEND_API_URL ? "set" : "MISSING");
  console.log("BFF_BACKEND_SHARED_SECRET:", process.env.BFF_BACKEND_SHARED_SECRET ? "set" : "MISSING");


  // ログイン必須
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // ★追加：Google id_token 必須（バックエンドで検証するため）
  const idToken = (session as any).idToken as string | undefined;
  if (!idToken) {
    return NextResponse.json(
      { error: "Missing idToken in session. Check auth.ts callbacks." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ error: "Missing q" }, { status: 400 });
  }

  const backendBase =
    process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!backendBase) {
    return NextResponse.json(
      { error: "BACKEND_API_URL is not set" },
      { status: 500 }
    );
  }

  // まだバックエンド側で require_bff_secret を残しているなら必要
  const bffSecret = process.env.BFF_BACKEND_SHARED_SECRET;
  if (!bffSecret) {
    return NextResponse.json(
      { error: "BFF_BACKEND_SHARED_SECRET is not set" },
      { status: 500 }
    );
  }

  const url = `${backendBase.replace(/\/$/, "")}/ask?q=${encodeURIComponent(q)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      // ★追加：Google ID トークン
      Authorization: `Bearer ${idToken}`,

      // ★従来のBFF secret（バックエンドが必須なら残す）
      "X-BFF-SECRET": bffSecret,

      // これは任意。バックエンドでは信用しない（ログ用途ならOK）
      // もし送るなら、session.user.email を送るより "tokenで検証済みの email" が理想だが、
      // 今回はバックエンドがトークンから email を取り出すので、なくてもOK。
      // "X-USER-EMAIL": session.user.email,
    },
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) {
    return NextResponse.json(
      { error: `ask api error: ${res.status}`, raw: text },
      { status: res.status }
    );
  }

  try {
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON from backend", raw: text },
      { status: 502 }
    );
  }
}
