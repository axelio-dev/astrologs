"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  EquipmentCategory,
  EquipmentStatus,
} from "../../../generated/prisma/client";

export async function createEquipment(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("Vous devez être connecté pour ajouter du matériel.");
  }

  try {
    const rawData = {
      name: formData.get("name") as string,
      category: formData.get("category") as EquipmentCategory,
      manufacturer: formData.get("manufacturer") as string,
      status: (formData.get("status") as EquipmentStatus) || "ACTIVE",

      acquisitionDate: formData.get("acquisitionDate")
        ? new Date(formData.get("acquisitionDate") as string)
        : null,

      diameterSensor: formData.get("diameterSensor") as string,
      focalResolution: formData.get("focalResolution") as string,
      fdRatio: formData.get("fdRatio") as string,
      otherSpec: formData.get("otherSpec") as string,
      notes: formData.get("notes") as string,

      userId: session.user.id,
    };

    const newEquipment = await prisma.equipment.create({
      data: rawData,
    });

    revalidatePath("/equipments");

    return { success: true, data: newEquipment };
  } catch (error) {
    console.error("Erreur Prisma:", error);
    return { success: false, error: "Impossible de créer l'équipement." };
  }
}

export async function getUserEquipments() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) return [];

  return await prisma.equipment.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
