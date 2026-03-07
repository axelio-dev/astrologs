"use client";

import { authClient } from "@/lib/auth-client";
import {
  Plus,
  Camera,
  Search,
  Filter,
  Calendar,
  Clock,
  Target,
  Zap,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { exo } from "../../fonts";

import { useState, useEffect, useMemo } from "react";

import {
  createAstroSession,
  getUserSessions,
  deleteSession,
  updateAstroSession,
} from "@/lib/actions/session";

import { getUserEquipments } from "@/lib/actions/equipment";

export default function SessionsPage() {
  const { data: session } = authClient.useSession();

  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    minDuration: "",
    maxDuration: "",
    minFrames: "",
    maxFrames: "",
    status: "",
  });
  const [sessions, setSessions] = useState<any[]>([]);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  function parseDuration(duration: string) {
    const match = duration.match(
      /(?:(\d+)h)?\s*(?:(\d+)m|min)?\s*(?:(\d+)s)?/i,
    );
    if (!match) return 0;

    const h = parseInt(match[1] || "0");
    const m = parseInt(match[2] || "0");
    const s = parseInt(match[3] || "0");
    return h * 3600 + m * 60 + s;
  }

  const fetchData = async () => {
    setLoading(true);

    try {
      const [sessData, equipData] = await Promise.all([
        getUserSessions(),
        getUserEquipments(),
      ]);

      setSessions(sessData);
      setEquipments(equipData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchData();
  }, [session]);

  const getEquipName = (id: string) =>
    equipments.find((e) => e.id === id)?.name || "Not specified";

  const getFilterNames = (ids: string[]) => {
    if (!ids?.length) return "No filter";
    return ids.map((id) => getEquipName(id)).join(", ");
  };

  function formatDuration(duration?: string) {
    if (!duration) return "—";

    const match = duration.match(
      /(?:(\d+)h)?\s*(?:(\d+)m|min)?\s*(?:(\d+)s)?/i,
    );

    if (!match) return duration;

    const h = parseInt(match[1] || "0");
    const m = parseInt(match[2] || "0");
    const s = parseInt(match[3] || "0");

    const result: string[] = [];

    if (h > 0) result.push(`${h}h`);
    if (m > 0) result.push(`${m}min`);
    if (s > 0) result.push(`${s}s`);

    return result.join(" ") || "0min";
  }

  function formatTotalSeconds(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) return `${h}h ${m > 0 ? `${m}min` : ""}`;
    if (m > 0) return `${m}min`;
    return `${s}s`;
  }

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const telescope = getEquipName(s.telescopeId).toLowerCase();
      const camera = getEquipName(s.cameraId).toLowerCase();
      const target = s.target.toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesText =
        !searchQuery ||
        target.includes(query) ||
        telescope.includes(query) ||
        camera.includes(query);

      const sessionDate = new Date(s.date);
      const matchesDate =
        (!filters.startDate || sessionDate >= new Date(filters.startDate)) &&
        (!filters.endDate || sessionDate <= new Date(filters.endDate));

      const matchesFrames =
        (!filters.minFrames || s.frameCount >= Number(filters.minFrames)) &&
        (!filters.maxFrames || s.frameCount <= Number(filters.maxFrames));

      const durationSec = parseDuration(s.totalDuration || "");
      const matchesDuration =
        (!filters.minDuration ||
          durationSec >= parseDuration(filters.minDuration)) &&
        (!filters.maxDuration ||
          durationSec <= parseDuration(filters.maxDuration));

      const matchesStatus = !filters.status || s.status === filters.status;

      return (
        matchesText &&
        matchesDate &&
        matchesFrames &&
        matchesDuration &&
        matchesStatus
      );
    });
  }, [sessions, searchQuery, filters]);

  const stats = useMemo(() => {
    const totalFrames = sessions.reduce(
      (acc, s) => acc + (s.frameCount || 0),
      0,
    );

    let totalSeconds = 0;

    sessions.forEach((s) => {
      if (!s.totalDuration) return;

      const match = s.totalDuration.match(
        /(?:(\d+)h)?\s*(?:(\d+)m|min)?\s*(?:(\d+)s)?/i,
      );

      if (!match) return;

      const h = parseInt(match[1] || "0");
      const m = parseInt(match[2] || "0");
      const sec = parseInt(match[3] || "0");

      totalSeconds += h * 3600 + m * 60 + sec;
    });

    const inProcessing = sessions.filter(
      (s) => s.status === "PROCESSING",
    ).length;

    return {
      total: sessions.length,
      frames: totalFrames.toLocaleString(),
      processing: inProcessing,
      time: formatTotalSeconds(totalSeconds),
    };
  }, [sessions]);

  async function handleSubmit(formData: FormData) {
    if (editingSession) {
      await updateAstroSession(editingSession.id, formData);
    } else {
      await createAstroSession(formData);
    }

    setShowModal(false);
    setEditingSession(null);
    fetchData();
  }

  const handleEdit = (session: any) => {
    setEditingSession({ ...session });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this session permanently?")) return;

    const res = await deleteSession(id);

    if (res?.success) {
      setSessions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const getStatusTag = (status: string) => {
    const styles: Record<string, string> = {
      COMPLETED: "bg-green-50 text-green-600 border-green-100",
      PROCESSING: "bg-red-50 text-red-600 border-red-100",
      IN_PROGRESS: "bg-blue-50 text-blue-600 border-blue-100",
    };

    const labels: Record<string, string> = {
      COMPLETED: "Terminé",
      PROCESSING: "En traitement",
      IN_PROGRESS: "En cours",
    };

    return (
      <span
        className={`${styles[status]} text-[11px] font-bold px-3 py-1 rounded-full border`}
      >
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1
                  className={`${exo.className} text-[32px] font-bold text-gray-900`}
                >
                  Astrophotography sessions
                </h1>

                <p className="text-gray-500 mt-1">
                  Manage your observation sessions
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingSession(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 bg-[#E11D48] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-red-700 cursor-pointer"
              >
                <Plus size={20} /> New session
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-10">
              {[
                {
                  label: "Total sessions",
                  value: stats.total,
                  icon: <Camera size={24} />,
                },
                {
                  label: "Total time",
                  value: stats.time,
                  icon: <Clock size={24} />,
                },
                {
                  label: "Captured frames",
                  value: stats.frames,
                  icon: <Target size={24} />,
                },
                {
                  label: "In treatment",
                  value: stats.processing,
                  icon: <Zap size={24} />,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm"
                >
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                  </div>

                  <div className="p-3 bg-red-50 rounded-full text-red-400">
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a session..."
                  className="w-full pl-12 pr-4 py-3 bg-[#F1F5F9] rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <button
                onClick={() => setShowFiltersModal(true)}
                className="flex items-center gap-2 px-6 py-3 border rounded-xl bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Filter size={18} />
                Filters
                {Object.values(filters).some(Boolean) && (
                  <span className="ml-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {Object.values(filters).filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {showFiltersModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden">
                  <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Filter size={20} /> Session filters
                    </h2>

                    <button
                      onClick={() => setShowFiltersModal(false)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X size={22} />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Status
                      </h3>

                      <select
                        value={filters.status}
                        onChange={(e) =>
                          setFilters({ ...filters, status: e.target.value })
                        }
                        className="w-full border rounded-xl p-3 bg-gray-50"
                      >
                        <option value="">All statuses</option>
                        <option value="IN_PROGRESS">In progress</option>
                        <option value="PROCESSING">In treatment</option>
                        <option value="COMPLETED">Finished</option>
                      </select>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Period
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="date"
                          value={filters.startDate}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              startDate: e.target.value,
                            })
                          }
                          className="border rounded-xl p-3 bg-gray-50"
                        />

                        <input
                          type="date"
                          value={filters.endDate}
                          onChange={(e) =>
                            setFilters({ ...filters, endDate: e.target.value })
                          }
                          className="border rounded-xl p-3 bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Session duration
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          placeholder="Min (example: 1 hour)"
                          value={filters.minDuration}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              minDuration: e.target.value,
                            })
                          }
                          className="border rounded-xl p-3 bg-gray-50"
                        />

                        <input
                          placeholder="Max (example: 5h)"
                          value={filters.maxDuration}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              maxDuration: e.target.value,
                            })
                          }
                          className="border rounded-xl p-3 bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Number of frames
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.minFrames}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              minFrames: e.target.value,
                            })
                          }
                          className="border rounded-xl p-3 bg-gray-50"
                        />

                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.maxFrames}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              maxFrames: e.target.value,
                            })
                          }
                          className="border rounded-xl p-3 bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t p-5">
                    <button
                      onClick={() =>
                        setFilters({
                          startDate: "",
                          endDate: "",
                          minDuration: "",
                          maxDuration: "",
                          minFrames: "",
                          maxFrames: "",
                          status: "",
                        })
                      }
                      className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      Reset
                    </button>

                    <button
                      onClick={() => setShowFiltersModal(false)}
                      className="bg-red-700 text-white px-6 py-2 rounded-xl hover:bg-red-800 cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {filteredSessions.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-3xl border border-gray-100 p-6 flex gap-8 items-center shadow-sm group"
                >
                  <div className="w-32 h-32 bg-[#0F172A] rounded-2xl flex items-center justify-center shrink-0">
                    <Target size={32} className="text-blue-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-gray-800">
                          {s.target}
                        </h3>

                        {getStatusTag(s.status)}
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleEdit(s)}
                          className="p-2 text-gray-400 hover:text-blue-600 cursor-pointer"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-2 text-gray-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-6 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />{" "}
                        {new Date(s.date).toLocaleDateString("fr-FR")}
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={16} /> {formatDuration(s.totalDuration)}
                      </div>

                      <div className="flex items-center gap-2">
                        <Target size={16} /> {s.frameCount} frames
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-10 pt-4 border-t">
                      <div>
                        <p className="text-xs text-gray-400 uppercase">
                          Telescope
                        </p>
                        <p className="font-semibold">
                          {getEquipName(s.telescopeId)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 uppercase">
                          Camera
                        </p>
                        <p className="font-semibold">
                          {getEquipName(s.cameraId)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 uppercase">
                          Filters
                        </p>
                        <p className="font-semibold">
                          {getFilterNames(s.filterIds)}
                        </p>
                      </div>
                    </div>

                    {s.notes && (
                      <p className="text-sm text-gray-500 italic mt-3">
                        {s.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-[95vw] max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {editingSession ? (
                  <>
                    <Pencil size={20} />
                    Edit session
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Create a new session
                  </>
                )}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            <form
              action={handleSubmit}
              className="p-6 overflow-y-auto space-y-5"
            >
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Astronomical target *
                </label>

                <input
                  name="target"
                  required
                  defaultValue={editingSession?.target}
                  placeholder="Ex: M31"
                  className="w-full mt-1 border border-gray-200 bg-gray-50 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Date *
                  </label>

                  <input
                    type="date"
                    name="date"
                    required
                    defaultValue={
                      editingSession
                        ? new Date(editingSession.date)
                            .toISOString()
                            .split("T")[0]
                        : new Date().toISOString().split("T")[0]
                    }
                    className="w-full mt-1 border border-gray-200 bg-gray-50 rounded-xl p-3"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Duration *
                  </label>

                  <input
                    name="totalDuration"
                    required
                    defaultValue={editingSession?.totalDuration}
                    placeholder="Ex: 3h 30min"
                    className="w-full mt-1 border border-gray-200 bg-gray-50 rounded-xl p-3"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Status
                  </label>

                  <select
                    name="status"
                    defaultValue={editingSession?.status || "IN_PROGRESS"}
                    className="w-full mt-1 border border-gray-200 bg-gray-50 rounded-xl p-3"
                  >
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Telescope *
                  </label>

                  <select
                    name="telescopeId"
                    defaultValue={editingSession?.telescopeId || ""}
                    className="w-full mt-1 border border-gray-200 bg-gray-50 rounded-xl p-3"
                  >
                    <option value="">Select a telescope</option>

                    {equipments
                      .filter((e) => e.category === "TELESCOPE")
                      .map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Camera
                  </label>

                  <select
                    name="cameraId"
                    defaultValue={editingSession?.cameraId || ""}
                    className="w-full mt-1 border border-gray-200 bg-gray-50 rounded-xl p-3"
                  >
                    <option value="">Select a camera</option>

                    {equipments
                      .filter((e) => e.category === "CAMERA")
                      .map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Mount
                  </label>

                  <select
                    name="mountId"
                    defaultValue={editingSession?.mountId || ""}
                    className="w-full mt-1 border border-gray-200 bg-gray-50 rounded-xl p-3"
                  >
                    <option value="">Select a mount</option>

                    {equipments
                      .filter((e) => e.category === "MOUNT")
                      .map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Filters
                  </label>

                  <select
                    name="filterIds"
                    multiple
                    defaultValue={editingSession?.filterIds || []}
                    className="w-full mt-1 border border-gray-200 bg-gray-50 rounded-xl p-3 h-[110px]"
                  >
                    {equipments
                      .filter((e) => e.category === "FILTER")
                      .map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                  </select>

                  <p className="text-xs text-gray-400 mt-1">
                    Hold CTRL/CMD to select multiple
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Number of frames
                  </label>

                  <input
                    type="number"
                    name="frameCount"
                    defaultValue={editingSession?.frameCount}
                    placeholder="Ex: 180"
                    className="w-full mt-1 border border-gray-200 bg-gray-50 rounded-xl p-3"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Exposure (s)
                  </label>

                  <input
                    type="number"
                    name="exposureTime"
                    step="0.1"
                    defaultValue={editingSession?.exposureTime}
                    placeholder="Ex: 120"
                    className="w-full mt-1 border border-gray-200 bg-gray-50 rounded-xl p-3"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Notes and observations
                </label>

                <textarea
                  name="notes"
                  defaultValue={editingSession?.notes}
                  placeholder="Weather conditions, seeing, problems encountered..."
                  className="w-full mt-1 border border-gray-200 bg-gray-50 rounded-xl p-4 h-28 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-red-700 text-white rounded-xl font-semibold hover:bg-red-800"
                >
                  {editingSession ? "Update" : "Create the session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
