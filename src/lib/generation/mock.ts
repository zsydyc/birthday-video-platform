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
      status: "pending",
      provider: "mock",
    },
  });

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
