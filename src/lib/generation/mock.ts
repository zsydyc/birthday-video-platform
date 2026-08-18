import { prisma } from "@/lib/prisma";

export interface GenerationTaskParams {
  templateName: string;
  category: string;
  formData: Record<string, unknown>;
}

export async function submitGenerationTask(
  orderId: string,
  params: GenerationTaskParams
): Promise<string> {
  const task = await prisma.generationTask.create({
    data: {
      orderId,
      inputAssets: [],
      params: params as object,
      status: "in_progress",
      provider: "mock",
    },
  });

  // Simulate async generation: advance to pending_review after 5 seconds
  setTimeout(async () => {
    try {
      await prisma.generationTask.update({
        where: { id: task.id },
        data: {
          status: "completed",
          resultUrl: `https://example.com/mock-video/${task.id}.mp4`,
        },
      });
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "pending_review" },
      });
    } catch {
      // best-effort in mock — no retry needed
    }
  }, 5000);

  return task.id;
}

export async function getTaskStatus(
  taskId: string
): Promise<{ status: string; resultUrl?: string }> {
  const task = await prisma.generationTask.findUniqueOrThrow({
    where: { id: taskId },
    select: { status: true, resultUrl: true },
  });
  return { status: task.status, resultUrl: task.resultUrl ?? undefined };
}
