"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3000";

interface Lead {
  id: number;
  customer_name: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

interface Demo {
  id: number;
  title: string;
  slug: string;
  is_active: number;
}

interface PortfolioItem {
  id: number;
  title: string;
  url: string;
  is_active: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [demos, setDemos] = useState<Demo[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("kodatrix_token");
    if (!token) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [leadsRes, demosRes, portfolioRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/leads`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/admin/demos`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/admin/portfolio`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const leadsData = await leadsRes.json();
        const demosData = await demosRes.json();
        const portfolioData = await portfolioRes.json();

        if (leadsData.success) setLeads(leadsData.data);
        if (demosData.success) setDemos(demosData.data);
        if (portfolioData.success) setPortfolio(portfolioData.data);
      } catch {
        // Hata durumunda sessizce geç
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 10 saniyede bir otomatik yenile
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("kodatrix_token");
    router.push("/");
  };

  const statusCounts = {
    "Yeni Talep": leads.filter((l) => l.status === "Yeni Talep").length,
    "Yapım Sürecinde": leads.filter((l) => l.status === "Yapım Sürecinde").length,
    "Yapıldı": leads.filter((l) => l.status === "Yapıldı").length,
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
          <Link href="/dashboard" className="block px-4 py-2 bg-blue-600 rounded-lg font-medium">
            📊 Dashboard
          </Link>
          <Link href="/leads" className="block px-4 py-2 hover:bg-gray-700 rounded-lg font-medium transition-colors">
            📋 Talepler
          </Link>
          <Link href="/demos" className="block px-4 py-2 hover:bg-gray-700 rounded-lg font-medium transition-colors">
            🖥️ Demolar
          </Link>
          <Link href="/portfolio" className="block px-4 py-2 hover:bg-gray-700 rounded-lg font-medium transition-colors">
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        ) : (
          <>
            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Toplam Talep</h3>
                <p className="text-3xl font-bold text-gray-900">{leads.length}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Yeni Talep</h3>
                <p className="text-3xl font-bold text-yellow-600">{statusCounts["Yeni Talep"]}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Aktif Demo</h3>
                <p className="text-3xl font-bold text-blue-600">{demos.filter((d) => d.is_active === 1).length}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Portfolyo</h3>
                <p className="text-3xl font-bold text-green-600">{portfolio.filter((p) => p.is_active === 1).length}</p>
              </div>
            </div>

            {/* Son Talepler */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Son Talepler</h2>
                <Link href="/leads" className="text-blue-600 text-sm font-medium hover:underline">
                  Tümünü Gör →
                </Link>
              </div>
              {leads.length === 0 ? (
                <p className="text-gray-500">Henüz talep yok.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 text-left">
                        <th className="pb-3 pr-4 text-sm font-medium text-gray-500">Müşteri</th>
                        <th className="pb-3 pr-4 text-sm font-medium text-gray-500">Telefon</th>
                        <th className="pb-3 pr-4 text-sm font-medium text-gray-500">Durum</th>
                        <th className="pb-3 text-sm font-medium text-gray-500">Tarih</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.slice(0, 5).map((lead) => (
                        <tr key={lead.id} className="border-b border-gray-100">
                          <td className="py-3 pr-4 font-medium text-gray-900">{lead.customer_name}</td>
                          <td className="py-3 pr-4 text-gray-600">{lead.phone}</td>
                          <td className="py-3 pr-4">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                lead.status === "Yeni Talep"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : lead.status === "Yapım Sürecinde"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {lead.status}
                            </span>
                          </td>
                          <td className="py-3 text-gray-600">
                            {new Date(lead.created_at).toLocaleDateString("tr-TR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Alt Bölüm: Demolar + Portfolyo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aktif Demolar */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Müşteri Demoları</h2>
                  <Link href="/demos" className="text-blue-600 text-sm font-medium hover:underline">
                    Yönet →
                  </Link>
                </div>
                {demos.length === 0 ? (
                  <p className="text-gray-500">Henüz demo eklenmemiş.</p>
                ) : (
                  <div className="space-y-2">
                    {demos.slice(0, 5).map((demo) => (
                      <div key={demo.id} className="flex items-center justify-between border border-gray-100 rounded-lg p-3">
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">{demo.title}</h3>
                          <p className="text-xs text-gray-400">/demo/{demo.slug}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${demo.is_active === 1 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {demo.is_active === 1 ? "Aktif" : "Pasif"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Portfolyo */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Portfolyo</h2>
                  <Link href="/portfolio" className="text-blue-600 text-sm font-medium hover:underline">
                    Yönet →
                  </Link>
                </div>
                {portfolio.length === 0 ? (
                  <p className="text-gray-500">Henüz portfolyo öğesi eklenmemiş.</p>
                ) : (
                  <div className="space-y-2">
                    {portfolio.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between border border-gray-100 rounded-lg p-3">
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{item.url}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.is_active === 1 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {item.is_active === 1 ? "Görünür" : "Gizli"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}