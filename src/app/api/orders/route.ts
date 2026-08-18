import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { submitGenerationTask } from "@/lib/generation/mock";
import { sendAdminOrderNotification, sendUserOrderConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { templateId, formData, coppaConsent, portraitConsent } = body as {
    templateId: string;
    formData: Record<string, unknown>;
    coppaConsent?: boolean;
    portraitConsent?: boolean;
  };

  if (!templateId || !formData) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const template = await prisma.template.findUnique({ where: { id: templateId } });
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const now = new Date();
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      templateId,
      formData: formData as object,
      status: "queued",
      amountCents: 0,
      isFreeTrial: true,
      coppaConsentAt: coppaConsent ? now : null,
      portraitConsentAt: portraitConsent ? now : null,
    },
  });

  await submitGenerationTask(order.id, {
    templateName: template.name,
    category: template.category,
    formData,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "generating" },
  });

  // Fire-and-forget email notifications
  const userName = session.user.name ?? "Customer";
  const userEmail = session.user.email ?? "";

  sendAdminOrderNotification({
    orderId: order.id,
    userEmail,
    userName,
    templateName: template.name,
    category: template.category,
    formData,
  });

  sendUserOrderConfirmation({
    orderId: order.id,
    userEmail,
    userName,
    templateName: template.name,
  });

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
