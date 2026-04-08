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
  Filter,
  Calendar,
  Clipboard,
  Activity,
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

type EquipmentCategory = "TELESCOPE" | "CAMERA" | "MOUNT" | "FILTER";
type EquipmentStatus = "ACTIVE" | "REPAIR" | "DAMAGED";

interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  manufacturer?: string;
  acquisitionDate?: string | Date;
  diameterSensor?: string;
  focalResolution?: string;
  fdRatio?: string;
  otherSpec?: string;
  notes?: string;
}

export default function Equipments() {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchEquipments = async () => {
    setLoading(true);
    try {
      const data = await getUserEquipments();
      setEquipments(data as Equipment[]);
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
      categories: new Set(equipments.map((e) => e.category)).size,
    };
  }, [equipments]);

  const filteredEquipments = useMemo(() => {
    if (activeTab === "ALL") return equipments;
    return equipments.filter((e) => e.category === activeTab);
  }, [equipments, activeTab]);

  const handleDelete = async (id: string) => {
    if (confirm("Do you really want to delete this equipment?")) {
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
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50/30 dark:bg-slate-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
              <div>
                <h1 className={`${exo.className} text-4xl font-semibold`}>
                  Equipments
                </h1>
                <p className="text-gray-500 dark:text-slate-400 mt-2 text-lg">
                  Manage your astronomical inventory and technical
                  specifications
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
                title="Total items"
                value={stats.total}
                icon={<Box className="text-red-500 opacity-40" size={32} />}
              />
              <StatCard
                title="Operational"
                value={stats.active}
                icon={
                  <Settings className="text-green-500 opacity-40" size={32} />
                }
              />
              <StatCard
                title="Issues/Repair"
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
                title="Categories"
                value={stats.categories}
                icon={<Filter className="text-blue-500 opacity-40" size={32} />}
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {["ALL", "TELESCOPE", "CAMERA", "MOUNT", "FILTER"].map((cat) => (
                <TabButton
                  key={cat}
                  active={activeTab === cat}
                  onClick={() => setActiveTab(cat)}
                  label={
                    cat === "ALL"
                      ? "All"
                      : cat.charAt(0) + cat.slice(1).toLowerCase() + "s"
                  }
                  icon={
                    cat === "CAMERA" ? (
                      <Camera size={18} />
                    ) : cat === "TELESCOPE" ? (
                      <Telescope size={18} />
                    ) : (
                      <Box size={18} />
                    )
                  }
                />
              ))}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Settings className="animate-spin mb-4" size={40} />
                <p>Loading your gear...</p>
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
              <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col my-auto border border-gray-100 dark:border-slate-700 text-slate-900 dark:text-white">
                <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {editingItem ? (
                      <Edit2 size={20} className="text-red-500" />
                    ) : (
                      <Plus size={20} className="text-red-500" />
                    )}
                    {editingItem ? "Edit Equipment" : "Add New Equipment"}
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form action={handleSubmit} className="p-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                        Equipment Name *
                      </label>
                      <input
                        name="name"
                        required
                        maxLength={254}
                        defaultValue={editingItem?.name}
                        className="form-input-custom"
                        placeholder="e.g. Sky-Watcher 80ED"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                        Category
                      </label>
                      <select
                        name="category"
                        defaultValue={editingItem?.category}
                        className="form-input-custom"
                      >
                        <option value="TELESCOPE">Telescope</option>
                        <option value="CAMERA">Camera</option>
                        <option value="MOUNT">Mount</option>
                        <option value="FILTER">Filter</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                        Status
                      </label>
                      <select
                        name="status"
                        defaultValue={editingItem?.status || "ACTIVE"}
                        className="form-input-custom"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="REPAIR">In Maintenance</option>
                        <option value="DAMAGED">Damaged</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                        Manufacturer
                      </label>
                      <input
                        name="manufacturer"
                        maxLength={254}
                        defaultValue={editingItem?.manufacturer || ""}
                        className="form-input-custom"
                        placeholder="ZWO, Celestron..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                        Acquisition Date
                      </label>
                      <input
                        type="date"
                        name="acquisitionDate"
                        defaultValue={
                          editingItem?.acquisitionDate
                            ? new Date(editingItem.acquisitionDate)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        className="form-input-custom"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t dark:border-slate-700">
                    <p className="text-xs font-bold uppercase text-red-500 mb-4 tracking-widest">
                      Technical Specifications
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500">
                          Diameter / Sensor
                        </label>
                        <input
                          maxLength={254}
                          name="diameterSensor"
                          defaultValue={editingItem?.diameterSensor || ""}
                          className="form-input-custom"
                          placeholder="80mm / IMX571"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">
                          Focal / Resolution
                        </label>
                        <input
                          maxLength={254}
                          name="focalResolution"
                          defaultValue={editingItem?.focalResolution || ""}
                          className="form-input-custom"
                          placeholder="600mm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">
                          F/D Ratio
                        </label>
                        <input
                          maxLength={254}
                          name="fdRatio"
                          defaultValue={editingItem?.fdRatio || ""}
                          className="form-input-custom"
                          placeholder="f/7.5"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                      Other Specs
                    </label>
                    <input
                      maxLength={254}
                      name="otherSpec"
                      defaultValue={editingItem?.otherSpec || ""}
                      className="form-input-custom"
                      placeholder="Weight, Backfocus, etc."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                      Private Notes
                    </label>
                    <textarea
                      name="notes"
                      defaultValue={editingItem?.notes || ""}
                      rows={2}
                      className="form-input-custom resize-none"
                      maxLength={500}
                      placeholder="Bought second-hand, needs cleaning..."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-6 py-3 text-gray-500 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg transition-transform active:scale-95"
                    >
                      {editingItem ? "Update Equipment" : "Save Equipment"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        .form-input-custom {
          width: 100%;
          margin-top: 4px;
          border: 1px solid #e2e8f0;
          background-color: #f8fafc;
          border-radius: 12px;
          padding: 12px;
          outline: none;
          transition: all 0.2s;
        }
        .dark .form-input-custom {
          border-color: #334155;
          background-color: #0f172a;
          color: white;
        }
        .form-input-custom:focus {
          ring: 2px;
          ring-color: #dc2626;
          border-color: #dc2626;
        }
      `}</style>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color = "text-gray-900 dark:text-white",
}: any) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex justify-between items-center">
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

function TabButton({ label, active, onClick, icon }: any) {
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

function EquipmentCard({
  item,
  onEdit,
  onDelete,
}: {
  item: Equipment;
  onEdit: (item: Equipment) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 relative group transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/30">
            {item.category === "TELESCOPE" ? (
              <Telescope className="text-red-600" size={28} />
            ) : item.category === "CAMERA" ? (
              <Camera className="text-red-600" size={28} />
            ) : (
              <Box className="text-red-600" size={28} />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold dark:text-white">{item.name}</h3>
            <p className="text-gray-400 dark:text-slate-500 font-medium">
              {item.manufacturer || "Generic Manufacturer"}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400 flex items-center gap-1">
            <Activity size={14} /> Status
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === "ACTIVE" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"}`}
          >
            {item.status}
          </span>
        </div>

        {item.acquisitionDate && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 flex items-center gap-1">
              <Calendar size={14} /> Acquired
            </span>
            <span className="dark:text-slate-300 font-medium">
              {new Date(item.acquisitionDate).toLocaleDateString()}
            </span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-50 dark:border-slate-700">
          <SpecItem label="Diam/Sens" value={item.diameterSensor} />
          <SpecItem label="Focal" value={item.focalResolution} />
          <SpecItem label="Ratio" value={item.fdRatio} />
        </div>

        {item.notes && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl text-xs text-gray-500 dark:text-slate-400 italic flex gap-2">
            <Clipboard size={14} className="shrink-0" />
            <span className="line-clamp-2">{item.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
        {label}
      </p>
      <p className="text-xs font-bold dark:text-slate-200 truncate">
        {value || "—"}
      </p>
    </div>
  );
}
