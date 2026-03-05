"use client";

import { authClient } from "@/lib/auth-client";
import {
  Rocket,
  Plus,
  Camera,
  Telescope,
  Trash2,
  Edit2,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { exo } from "../../fonts";
import { useState, useEffect } from "react";
import {
  createEquipment,
  getUserEquipments,
  deleteEquipment,
  updateEquipment,
} from "@/lib/actions/equipment";

export default function Equipments() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [loading, setLoading] = useState(true);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

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
    if (session) {
      fetchEquipments();
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    if (confirm("Do you really want to remove this equipment?")) {
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

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1
                  className={`${exo.className} text-4xl font-semibold text-gray-900`}
                >
                  Equipments
                </h1>
                <p className="text-gray-700 mt-3 text-md">
                  Manage your astrophotography equipment
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingItem(null);
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 bg-red-700 hover:bg-red-700 text-white px-5 py-3 rounded-lg font-medium shadow-sm cursor-pointer transition-colors"
              >
                <Plus size={18} />
                Add equipment
              </button>
            </div>

            {loading || sessionPending ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Rocket className="text-red-700 animate-bounce w-10 h-10 mb-4" />
                <p className="text-gray-400 font-medium">
                  Loading your equipment...
                </p>
              </div>
            ) : equipments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-700 text-lg">No equipment added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {equipments.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col transition-all hover:shadow-md"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                          {item.category === "CAMERA" ? (
                            <Camera className="text-red-700" size={22} />
                          ) : (
                            <Telescope className="text-red-700" size={22} />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {item.manufacturer || "Generic"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setShowAddModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-400 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-medium">
                          Statut
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            item.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {item.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-medium">
                          Acquisition date
                        </span>
                        <span className="text-gray-700 font-semibold">
                          {item.acquisitionDate
                            ? new Date(
                                item.acquisitionDate,
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>

                      <div className="h-px bg-gray-100 my-4" />

                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">
                        Specifications
                      </p>

                      <div className="grid grid-cols-2 gap-y-3">
                        <div className="text-sm flex flex-col">
                          <span className="text-gray-400 text-xs">
                            Diameter / Sensor
                          </span>
                          <span className="text-gray-700 font-semibold">
                            {item.diameterSensor || "-"}
                          </span>
                        </div>
                        <div className="text-sm flex flex-col">
                          <span className="text-gray-400 text-xs">
                            Focal / Res
                          </span>
                          <span className="text-gray-700 font-semibold">
                            {item.focalResolution || "-"}
                          </span>
                        </div>
                        <div className="text-sm flex flex-col">
                          <span className="text-gray-400 text-xs">Ratio</span>
                          <span className="text-gray-700 font-semibold">
                            {item.fdRatio || "-"}
                          </span>
                        </div>
                        <div className="text-sm flex flex-col">
                          <span className="text-gray-400 text-xs">Autres</span>
                          <span className="text-gray-700 font-semibold truncate">
                            {item.otherSpec || "-"}
                          </span>
                        </div>
                      </div>

                      {item.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-50">
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">
                            Notes
                          </p>
                          <p className="text-xs italic text-gray-700 leading-relaxed">
                            "{item.notes}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div className="bg-white w-full max-w-180 max-h-[90vh] rounded-2xl shadow-xl flex flex-col">
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className={`${exo.className} text-xl font-semibold`}>
                    {editingItem ? "Edit Equipment" : "Add Equipment"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingItem(null);
                    }}
                    className="text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form
                  action={handleSubmit}
                  className="flex flex-col overflow-hidden"
                >
                  <div className="overflow-y-auto p-6 space-y-5">
                    <div>
                      <label className="text-sm text-gray-700 font-medium">
                        Equipment name *
                      </label>
                      <input
                        name="name"
                        required
                        defaultValue={editingItem?.name}
                        type="text"
                        placeholder="Ex: Newton Telescope 200mm"
                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-700 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-700 font-medium">
                          Category *
                        </label>
                        <select
                          name="category"
                          required
                          defaultValue={editingItem?.category}
                          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-700 outline-none"
                        >
                          <option value="TELESCOPE">Telescope</option>
                          <option value="CAMERA">Camera</option>
                          <option value="MOUNT">Mount</option>
                          <option value="FILTER">Filter</option>
                          <option value="ACCESSORY">Accessory</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-700 font-medium">
                          Manufacturer
                        </label>
                        <input
                          name="manufacturer"
                          defaultValue={editingItem?.manufacturer}
                          type="text"
                          placeholder="Ex: Sky-Watcher"
                          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-700 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-700 font-medium">
                          Acquisition date
                        </label>
                        <input
                          name="acquisitionDate"
                          defaultValue={
                            editingItem?.acquisitionDate
                              ? new Date(editingItem.acquisitionDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          type="date"
                          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-700 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-700 font-medium">
                          Status
                        </label>
                        <select
                          name="status"
                          defaultValue={editingItem?.status || "ACTIVE"}
                          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-700 outline-none"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="REPAIR">Repair in progress</option>
                          <option value="FOR_SALE">For sale</option>
                          <option value="DAMAGED">Damaged</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3
                        className={`${exo.className} text-md font-semibold text-gray-800 mb-3`}
                      >
                        Specifications
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-700 font-medium">
                            Diameter / Sensor
                          </label>
                          <input
                            name="diameterSensor"
                            defaultValue={editingItem?.diameterSensor}
                            type="text"
                            placeholder="Ex: 200mm / APS-C"
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-700 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-700 font-medium">
                            Focal length / Resolution
                          </label>
                          <input
                            name="focalResolution"
                            defaultValue={editingItem?.focalResolution}
                            type="text"
                            placeholder="Ex: 1000mm / 26MP"
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-700 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-700 font-medium">
                            F/D Ratio
                          </label>
                          <input
                            name="fdRatio"
                            defaultValue={editingItem?.fdRatio}
                            type="text"
                            placeholder="Ex: f/5"
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-700 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-700 font-medium">
                            Other
                          </label>
                          <input
                            name="otherSpec"
                            defaultValue={editingItem?.otherSpec}
                            type="text"
                            placeholder="Optional"
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-700 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-700 font-medium">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        defaultValue={editingItem?.notes}
                        placeholder="Additional information..."
                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 h-24 focus:ring-2 focus:ring-red-700 outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingItem(null);
                      }}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-red-700 text-white rounded-lg font-medium hover:bg-red-700 shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      {editingItem ? "Save changes" : "Add equipment"}
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
