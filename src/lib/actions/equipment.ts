"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  EquipmentCategory,
  EquipmentStatus,
} from "../../../generated/prisma/client";

const validateEquipmentInput = (name: string, notes?: string) => {
  if (!name || name.trim().length === 0) {
    throw new Error("Equipment name is required.");
  }
  if (name.length > 254) {
    throw new Error("Name is too long (maximum 254 characters).");
  }
  if (notes && notes.length > 500) {
    throw new Error("Notes are too long (maximum 500 characters).");
  }
};

export async function createEquipment(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("You must be logged in to add equipment.");
  }

  const name = formData.get("name") as string;
  const notes = formData.get("notes") as string;

  try {
    validateEquipmentInput(name, notes);

    const rawData = {
      name: name.trim(),
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
      notes: notes?.trim() || null,

      userId: session.user.id,
    };

    const newEquipment = await prisma.equipment.create({
      data: rawData,
    });

    revalidatePath("/equipments");
    return { success: true, data: newEquipment };
  } catch (error: any) {
    console.error("Prisma error:", error);
    return {
      success: false,
      error: error.message || "Failed to create equipment.",
    };
  }
}

export async function updateEquipment(id: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const notes = formData.get("notes") as string;

  try {
    validateEquipmentInput(name, notes);

    const data = {
      name: name.trim(),
      category: formData.get("category") as EquipmentCategory,
      manufacturer: formData.get("manufacturer") as string,
      status: formData.get("status") as EquipmentStatus,
      diameterSensor: formData.get("diameterSensor") as string,
      focalResolution: formData.get("focalResolution") as string,
      fdRatio: formData.get("fdRatio") as string,
      otherSpec: formData.get("otherSpec") as string,
      notes: notes?.trim() || null,
    };

    await prisma.equipment.update({
      where: { id, userId: session.user.id },
      data,
    });

    revalidatePath("/equipments");
    return { success: true };
  } catch (error: any) {
    console.error("Update error:", error);
    return {
      success: false,
      error: error.message || "Failed to update equipment.",
    };
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

export async function deleteEquipment(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) throw new Error("Unauthorized");

  try {
    await prisma.equipment.delete({
      where: { id, userId: session.user.id },
    });
    revalidatePath("/equipments");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete equipment." };
  }
}
