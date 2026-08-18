import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const { templateId } = await params;

  const template = await prisma.template.findUnique({
    where: { id: templateId },
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      occasionTags: true,
      durationTier: true,
      price: true,
    },
  });

  if (!template) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(template);
}
