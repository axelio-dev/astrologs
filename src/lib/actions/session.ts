"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Utilitaire pour extraire les données du FormData
 */
function getSessionData(formData: FormData, userId: string) {
  const telescopeId = formData.get("telescopeId") as string;
  const cameraId = formData.get("cameraId") as string;
  const mountId = formData.get("mountId") as string;

  // ⚡ récupération correcte des filtres
  const filterIds = formData.getAll("filterIds") as string[];

  return {
    target: formData.get("target") as string,

    date: new Date(formData.get("date") as string),

    totalDuration: formData.get("totalDuration") as string,

    status: (formData.get("status") as string) || "IN_PROGRESS",

    frameCount: Number(formData.get("frameCount") || 0),

    exposureTime: Number(formData.get("exposureTime") || 0),

    notes: (formData.get("notes") as string) || "",

    userId,

    telescopeId: telescopeId || null,

    cameraId: cameraId || null,

    mountId: mountId || null,

    filterIds, // ✅ maintenant correct
  };
}

/**
 * CRÉER une session
 */
export async function createAstroSession(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) throw new Error("Unauthorized");

  try {
    const data = getSessionData(formData, session.user.id);

    await prisma.astroSession.create({
      data,
    });

    revalidatePath("/dashboard/sessions");

    return { success: true };
  } catch (error) {
    console.error("Error creating session:", error);

    return {
      success: false,
      error: "Failed to create session.",
    };
  }
}

/**
 * MODIFIER une session
 */
export async function updateAstroSession(id: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) throw new Error("Unauthorized");

  try {
    const data = getSessionData(formData, session.user.id);

    await prisma.astroSession.update({
      where: {
        id: id,
        userId: session.user.id,
      },
      data,
    });

    revalidatePath("/dashboard/sessions");

    return { success: true };
  } catch (error) {
    console.error("Error updating session:", error);

    return {
      success: false,
      error: "Failed to update session.",
    };
  }
}

/**
 * RÉCUPÉRER les sessions de l'utilisateur
 */
export async function getUserSessions() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) return [];

  return prisma.astroSession.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      date: "desc",
    },
  });
}

/**
 * SUPPRIMER une session
 */
export async function deleteSession(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) throw new Error("Unauthorized");

  try {
    await prisma.astroSession.delete({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/sessions");

    return { success: true };
  } catch (error) {
    console.error("Error deleting session:", error);

    return {
      success: false,
      error: "Failed to delete session.",
    };
  }
}
