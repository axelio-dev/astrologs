"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { SessionStatus } from "../../../generated/prisma/client";

// Transforme les données du formulaire en objet compatible Prisma
function getSessionData(formData: FormData, userId: string) {
  const telescopeId = formData.get("telescopeId") as string | null;
  const cameraId = formData.get("cameraId") as string | null;
  const mountId = formData.get("mountId") as string | null;

  const filterIds = formData.getAll("filterIds") as string[];

  return {
    target: formData.get("target") as string,
    date: new Date(formData.get("date") as string),
    totalDuration: formData.get("totalDuration") as string,
    status:
      (formData.get("status") as SessionStatus) || SessionStatus.IN_PROGRESS,
    frameCount: Number(formData.get("frameCount") || 0),
    exposureTime: Number(formData.get("exposureTime") || 0),
    notes: (formData.get("notes") as string) || "",
    userId,
    telescopeId: telescopeId || null,
    cameraId: cameraId || null,
    mountId: mountId || null,
    filterIds,
  };
}

// Création d'une session astro
export async function createAstroSession(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const data = getSessionData(formData, session.user.id);

    await prisma.astroSession.create({ data });

    revalidatePath("/dashboard/sessions");

    return { success: true };
  } catch (error) {
    console.error("Error creating session:", error);
    return { success: false, error: "Failed to create session." };
  }
}

// Mise à jour d'une session astro
export async function updateAstroSession(id: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  try {
    // Vérifie que la session appartient bien à l'utilisateur
    const existing = await prisma.astroSession.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      throw new Error("Unauthorized");
    }

    const data = getSessionData(formData, session.user.id);

    await prisma.astroSession.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard/sessions");

    return { success: true };
  } catch (error) {
    console.error("Error updating session:", error);
    return { success: false, error: "Failed to update session." };
  }
}

// Récupère toutes les sessions de l'utilisateur
export async function getUserSessions() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];

  return prisma.astroSession.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });
}

// Supprime une session astro
export async function deleteSession(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  try {
    // Vérifie que la session appartient bien à l'utilisateur
    const existing = await prisma.astroSession.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      throw new Error("Unauthorized");
    }

    await prisma.astroSession.delete({ where: { id } });

    revalidatePath("/dashboard/sessions");

    return { success: true };
  } catch (error) {
    console.error("Error deleting session:", error);
    return { success: false, error: "Failed to delete session." };
  }
}
