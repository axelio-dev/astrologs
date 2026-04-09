"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createAstroSession(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const filterIds = formData.getAll("filterIds") as string[];
  const accessoryIds = formData.getAll("accessoryIds") as string[];

  await prisma.astroSession.create({
    data: {
      userId: session.user.id,
      target: formData.get("target") as string,
      date: new Date(formData.get("date") as string),
      status: formData.get("status") as any,
      frameCount: parseInt(formData.get("frameCount") as string) || 0,
      exposureTime: parseFloat(formData.get("exposureTime") as string) || 0,
      totalDuration: formData.get("totalDuration") as string,
      notes: formData.get("notes") as string,
      telescopeId: (formData.get("telescopeId") as string) || null,
      mountId: (formData.get("mountId") as string) || null,
      cameraId: (formData.get("cameraId") as string) || null,
      filterIds: filterIds,
      accessoryIds: accessoryIds,
    },
  });

  revalidatePath("/sessions");
}

export async function updateAstroSession(id: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const filterIds = formData.getAll("filterIds") as string[];
  const accessoryIds = formData.getAll("accessoryIds") as string[];

  await prisma.astroSession.update({
    where: { id, userId: session.user.id },
    data: {
      target: formData.get("target") as string,
      date: new Date(formData.get("date") as string),
      status: formData.get("status") as any,
      frameCount: parseInt(formData.get("frameCount") as string) || 0,
      exposureTime: parseFloat(formData.get("exposureTime") as string) || 0,
      totalDuration: formData.get("totalDuration") as string,
      notes: formData.get("notes") as string,
      telescopeId: (formData.get("telescopeId") as string) || null,
      mountId: (formData.get("mountId") as string) || null,
      cameraId: (formData.get("cameraId") as string) || null,
      filterIds: filterIds,
      accessoryIds: accessoryIds,
    },
  });

  revalidatePath("/sessions");
}

export async function getUserSessions() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  return await prisma.astroSession.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });
}

export async function deleteSession(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.astroSession.delete({
    where: { id, userId: session.user.id },
  });

  return { success: true };
}
