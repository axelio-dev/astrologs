import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing field(s)" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ user });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
