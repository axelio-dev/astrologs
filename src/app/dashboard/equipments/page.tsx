"use client";

import { authClient } from "@/lib/auth-client";
import {
  Rocket,
  Plus,
  Camera,
  Telescope,
  Settings,
  PenTool,
  Layers,
  Trash2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { exo } from "../../fonts";
import { useState, useEffect } from "react";
import { createEquipment, getUserEquipments } from "@/lib/actions/equipment";

export default function Equipments() {
  const { data: session, isPending } = authClient.useSession();
  const [showAddModal, setShowAddModal] = useState(false);
  const [equipments, setEquipments] = useState<any[]>([]);

  const fetchEquipments = async () => {
    const data = await getUserEquipments();
    setEquipments(data);
  };

  useEffect(() => {
    if (session) {
      fetchEquipments();
    }
  }, [session]);

  async function handleSubmit(formData: FormData) {
    try {
      await createEquipment(formData);
      setShowAddModal(false);
      fetchEquipments();
    } catch (error) {
      console.error(error);
    }
  }

  if (isPending)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Rocket className="text-red-500 animate-bounce w-10 h-10" />
      </div>
    );

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
                <p className="text-gray-500 mt-3 text-md">
                  Manage your astrophotography equipment
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium shadow-sm cursor-pointer"
              >
                <Plus size={18} />
                Add equipment
              </button>
            </div>

            {equipments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No equipment added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipments.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
                  >
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {item.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                            item.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {item.status.replace("_", " ")}
                        </span>
                      </div>
                      <h3
                        className={`${exo.className} text-xl font-bold text-gray-900 mb-1`}
                      >
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4">
                        {item.manufacturer || "Generic"}
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                        {item.diameterSensor && (
                          <div>
                            <p className="text-[11px] text-gray-400 uppercase font-bold">
                              Diameter/Sensor
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                              {item.diameterSensor}
                            </p>
                          </div>
                        )}
                        {item.focalResolution && (
                          <div>
                            <p className="text-[11px] text-gray-400 uppercase font-bold">
                              Focal/Res
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                              {item.focalResolution}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div className="bg-white w-full max-w-180 max-h-[90vh] rounded-xl shadow-xl flex flex-col">
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className={`${exo.className} text-xl font-semibold`}>
                    Add Equipment
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form
                  action={handleSubmit}
                  className="flex flex-col overflow-hidden"
                >
                  <div className="overflow-y-auto p-6 space-y-5">
                    <div>
                      <label className="text-sm text-gray-600 font-medium">
                        Equipment name *
                      </label>
                      <input
                        name="name"
                        required
                        type="text"
                        placeholder="Ex: Newton Telescope 200mm"
                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 font-medium">
                          Category *
                        </label>
                        <select
                          name="category"
                          required
                          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="">Select...</option>
                          <option value="TELESCOPE">Telescope</option>
                          <option value="CAMERA">Camera</option>
                          <option value="MOUNT">Mount</option>
                          <option value="FILTER">Filter</option>
                          <option value="ACCESSORY">Accessory</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm text-gray-600 font-medium">
                          Manufacturer
                        </label>
                        <input
                          name="manufacturer"
                          type="text"
                          placeholder="Ex: Sky-Watcher"
                          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 font-medium">
                          Acquisition date
                        </label>
                        <input
                          name="acquisitionDate"
                          type="date"
                          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-600 font-medium">
                          Status
                        </label>
                        <select
                          name="status"
                          className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
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
                          <label className="text-sm text-gray-600 font-medium">
                            Diameter / Sensor
                          </label>
                          <input
                            name="diameterSensor"
                            type="text"
                            placeholder="Ex: 200mm / APS-C"
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 font-medium">
                            Focal length / Resolution
                          </label>
                          <input
                            name="focalResolution"
                            type="text"
                            placeholder="Ex: 1000mm / 26MP"
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 font-medium">
                            F/D Ratio
                          </label>
                          <input
                            name="fdRatio"
                            type="text"
                            placeholder="Ex: f/5"
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 font-medium">
                            Other
                          </label>
                          <input
                            name="otherSpec"
                            type="text"
                            placeholder="Optional"
                            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 font-medium">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        placeholder="Additional information..."
                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer font-medium shadow-sm transition-colors"
                    >
                      Add equipment
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
