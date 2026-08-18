import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");

  const templates = await prisma.template.findMany({
    where: {
      isActive: true,
      ...(category ? { category: category as never } : {}),
    },
    select: {
      id: true,
      name: true,
      description: true,
      occasionTags: true,
      durationTier: true,
      category: true,
      price: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(templates);
}
