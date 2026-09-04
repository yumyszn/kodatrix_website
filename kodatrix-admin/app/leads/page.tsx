"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Lead {
  id: number;
  customer_name: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

const STATUSES = ["Yeni Talep", "Yapım Sürecinde", "Yapıldı"];

const STATUS_COLORS: Record<string, string> = {
  "Yeni Talep": "bg-yellow-100 text-yellow-700",
  "Yapım Sürecinde": "bg-blue-100 text-blue-700",
  "Yapıldı": "bg-green-100 text-green-700",
};

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("kodatrix_token");
    if (!token) {
      router.push("/");
      return;
    }

    const fetchLeads = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/leads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setLeads(data.data);
        } else {
          setError("Talepler yüklenirken hata oluştu.");
        }
      } catch {
        setError("Sunucuya bağlanılamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [router]);

  const updateStatus = async (id: number, newStatus: string) => {
    const token = localStorage.getItem("kodatrix_token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:3000/api/admin/leads/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setLeads(leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
      }
    } catch {
      setError("Durum güncellenirken hata oluştu.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu talebi silmek istediğinize emin misiniz?")) return;
    const token = localStorage.getItem("kodatrix_token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:3000/api/admin/leads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setLeads(leads.filter((l) => l.id !== id));
      } else {
        setError(data.error || "Silme işlemi başarısız.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("kodatrix_token");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold">Kodatrix Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className="block px-4 py-2 hover:bg-gray-700 rounded-lg font-medium transition-colors"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/leads"
            className="block px-4 py-2 bg-blue-600 rounded-lg font-medium"
          >
            📋 Talepler
          </Link>
          <Link
            href="/demos"
            className="block px-4 py-2 hover:bg-gray-700 rounded-lg font-medium transition-colors"
          >
            🖥️ Demolar
          </Link>
          <Link
            href="/portfolio"
            className="block px-4 py-2 hover:bg-gray-700 rounded-lg font-medium transition-colors"
          >
            🌐 Portfolyo
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Müşteri Talepleri</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATUSES.map((status) => (
              <div key={status} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">{status}</h2>
                  <span className="bg-gray-200 text-gray-700 text-sm font-medium px-2 py-1 rounded-full">
                    {leads.filter((l) => l.status === status).length}
                  </span>
                </div>

                <div className="space-y-3">
                  {leads.filter((l) => l.status === status).map((lead) => (
                    <div key={lead.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900">{lead.customer_name}</h3>
                        <span className="text-xs text-gray-500">
                          {new Date(lead.created_at).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">📞 {lead.phone}</p>
                      {lead.email && (
                        <p className="text-sm text-gray-600 mb-1">✉️ {lead.email}</p>
                      )}
                      {lead.message && (
                        <p className="text-sm text-gray-600 mb-2">{lead.message}</p>
                      )}

                      <div className="flex flex-wrap gap-2 mt-2">
                        {STATUSES.map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(lead.id, s)}
                            disabled={s === lead.status}
                            className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                              s === lead.status
                                ? STATUS_COLORS[s]
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors ml-auto"
                        >
                          🗑 Sil
                        </button>
                      </div>
                    </div>
                  ))}

                  {leads.filter((l) => l.status === status).length === 0 && (
                    <p className="text-gray-400 text-sm text-center py-4">Bu kategoride talep yok</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}