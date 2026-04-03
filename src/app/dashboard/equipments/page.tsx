"use client";

import { authClient } from "@/lib/auth-client";
import {
  Plus,
  Camera,
  Telescope,
  Trash2,
  Edit2,
  X,
  Box,
  Settings,
  AlertCircle,
  Binoculars,
  Filter,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { exo } from "../../fonts";
import { useState, useEffect, useMemo } from "react";

import {
  createEquipment,
  getUserEquipments,
  deleteEquipment,
  updateEquipment,
} from "@/lib/actions/equipment";

export default function Equipments() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchEquipments = async () => {
    setLoading(true);
    try {
      const data = await getUserEquipments();
      setEquipments(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchEquipments();
  }, [session]);

  const stats = useMemo(() => {
    return {
      total: equipments.length,
      active: equipments.filter((e) => e.status === "ACTIVE").length,
      maintenance: equipments.filter((e) =>
        ["REPAIR", "DAMAGED"].includes(e.status),
      ).length,
      totalSessions: 102,
    };
  }, [equipments]);

  const filteredEquipments = useMemo(() => {
    if (activeTab === "ALL") return equipments;
    return equipments.filter((e) => e.category === activeTab);
  }, [equipments, activeTab]);

  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cet équipement ?")) {
      await deleteEquipment(id);
      fetchEquipments();
    }
  };

  async function handleSubmit(formData: FormData) {
    try {
      if (editingItem) {
        await updateEquipment(editingItem.id, formData);
      } else {
        await createEquipment(formData);
      }
      setShowAddModal(false);
      setEditingItem(null);
      fetchEquipments();
    } catch (error) {
      console.error(error);
    }
  }

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50/30 dark:bg-slate-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
              <div>
                <h1 className={`${exo.className} text-4xl font-semibold`}>
                  Equipments
                </h1>
                <p className="text-gray-500 dark:text-slate-400 mt-2 text-lg">
                  Manage your astronomical equipments
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingItem(null);
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95"
              >
                <Plus size={20} />
                Add equipment
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <StatCard
                title="Total"
                value={stats.total}
                icon={<Box className="text-red-500 opacity-40" size={32} />}
              />
              <StatCard
                title="Actifs"
                value={stats.active}
                icon={
                  <Settings className="text-green-500 opacity-40" size={32} />
                }
              />
              <StatCard
                title="Maintenance"
                value={stats.maintenance}
                icon={
                  <AlertCircle
                    className="text-orange-500 opacity-40"
                    size={32}
                  />
                }
                color="text-orange-500"
              />
              <StatCard
                title="Sessions"
                value={stats.totalSessions}
                icon={
                  <Telescope className="text-blue-500 opacity-40" size={32} />
                }
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <TabButton
                active={activeTab === "ALL"}
                onClick={() => setActiveTab("ALL")}
                label="All"
                icon={<Box size={18} />}
              />
              <TabButton
                active={activeTab === "TELESCOPE"}
                onClick={() => setActiveTab("TELESCOPE")}
                label="Telescopes"
                icon={<Telescope size={18} />}
              />
              <TabButton
                active={activeTab === "CAMERA"}
                onClick={() => setActiveTab("CAMERA")}
                label="Cameras"
                icon={<Camera size={18} />}
              />
              <TabButton
                active={activeTab === "MOUNT"}
                onClick={() => setActiveTab("MOUNT")}
                label="Mounts"
                icon={<Settings size={18} />}
              />
              <TabButton
                active={activeTab === "FILTER"}
                onClick={() => setActiveTab("FILTER")}
                label="Filters"
                icon={<Filter size={18} />}
              />
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Settings className="animate-spin mb-4" size={40} />
                <p>Loading equipments...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                {filteredEquipments.map((item) => (
                  <EquipmentCard
                    key={item.id}
                    item={item}
                    onEdit={(e) => {
                      setEditingItem(e);
                      setShowAddModal(true);
                    }}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>

          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-slate-700">
                <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {editingItem ? (
                      <Edit2 size={20} className="text-red-500" />
                    ) : (
                      <Plus size={20} className="text-red-500" />
                    )}
                    {editingItem
                      ? "Modifier l'équipement"
                      : "Ajouter un équipement"}
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form action={handleSubmit} className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                        Nom du matériel *
                      </label>
                      <input
                        name="name"
                        required
                        defaultValue={editingItem?.name}
                        className="w-full mt-1 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-600 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                          Catégorie
                        </label>
                        <select
                          name="category"
                          defaultValue={editingItem?.category}
                          className="w-full mt-1 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-xl p-3 outline-none"
                        >
                          <option value="TELESCOPE">Télescope</option>
                          <option value="CAMERA">Caméra</option>
                          <option value="MOUNT">Monture</option>
                          <option value="FILTER">Filtre</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                          Statut
                        </label>
                        <select
                          name="status"
                          defaultValue={editingItem?.status || "ACTIVE"}
                          className="w-full mt-1 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-xl p-3 outline-none"
                        >
                          <option value="ACTIVE">Actif</option>
                          <option value="REPAIR">Maintenance</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-6 py-3 text-gray-500 dark:text-slate-400 font-medium"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-600/20"
                    >
                      {editingItem ? "Mettre à jour" : "Enregistrer"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color = "text-gray-900 dark:text-white",
}) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex justify-between items-center transition-colors">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
          {title}
        </p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
      <div>{icon}</div>
    </div>
  );
}

function TabButton({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
        active
          ? "bg-red-600 text-white shadow-md"
          : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function EquipmentCard({ item, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 relative group transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/30">
            {item.category === "TELESCOPE" ? (
              <Telescope className="text-red-600 dark:text-red-500" size={28} />
            ) : (
              <Camera className="text-red-600 dark:text-red-500" size={28} />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {item.name}
            </h3>
            <p className="text-gray-400 dark:text-slate-500 font-medium">
              {item.manufacturer || "Astro Equipment"}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-2.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 dark:text-slate-500 text-sm font-medium">
            Statut
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === "ACTIVE" ? "bg-green-50 dark:bg-green-900/20 text-green-600" : "bg-orange-50 dark:bg-orange-900/20 text-orange-600"}`}
          >
            {item.status === "ACTIVE" ? "Actif" : "Maintenance"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 dark:text-slate-500 text-sm font-medium">
            Sessions used
          </span>
          <span className="text-gray-900 dark:text-white font-bold">12</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-50 dark:border-slate-700">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-bold mb-1">
              Diameter
            </p>
            <p className="font-bold text-gray-800 dark:text-slate-200">
              {item.diameterSensor || "80mm"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-slate-500 font-bold mb-1">
              Focal
            </p>
            <p className="font-bold text-gray-800 dark:text-slate-200">
              {item.focalResolution || "480mm"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
