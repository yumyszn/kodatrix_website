"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3000";

interface PortfolioItem {
  id: number;
  title: string;
  url: string;
  logo_image: string | null;
  is_active: number;
  created_at: string;
}

export default function PortfolioAdminPage() {
  const router = useRouter();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    logo_image: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("kodatrix_token");
    if (!token) {
      router.push("/");
      return;
    }

    const fetchItems = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setItems(data.data);
        } else {
          setError("Portfolyo yüklenirken hata oluştu.");
        }
      } catch {
        setError("Sunucuya bağlanılamadı. Backend'in çalıştığından emin olun (baslat.bat).");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("kodatrix_token");
    router.push("/");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = localStorage.getItem("kodatrix_token");
    if (!token) return;

    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`${API_URL}/api/admin/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, logo_image: data.url }));
      } else {
        setError(data.error || "Görsel yüklenemedi.");
      }
    } catch {
      setError("Görsel yüklenirken hata oluştu.");
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", url: "", logo_image: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      url: item.url,
      logo_image: item.logo_image || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("kodatrix_token");
    if (!token) return;

    try {
      const url = editingId
        ? `${API_URL}/api/admin/portfolio/${editingId}`
        : `${API_URL}/api/admin/portfolio`;
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        const listRes = await fetch(`${API_URL}/api/admin/portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const listData = await listRes.json();
        if (listData.success) setItems(listData.data);
        resetForm();
      } else {
        setError(data.error || "İşlem başarısız.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu portfolyo öğesini silmek istediğinize emin misiniz?")) return;
    const token = localStorage.getItem("kodatrix_token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/portfolio/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setItems(items.filter((i) => i.id !== id));
      } else {
        setError(data.error || "Silme başarısız.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    }
  };

  const toggleActive = async (item: PortfolioItem) => {
    const token = localStorage.getItem("kodatrix_token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/portfolio/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: item.is_active === 1 ? 0 : 1 }),
      });
      const data = await res.json();
      if (data.success) {
        setItems(items.map((i) => (i.id === item.id ? { ...i, is_active: i.is_active === 1 ? 0 : 1 } : i)));
      }
    } catch {
      setError("Güncellenirken hata oluştu.");
    }
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
          <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-700 rounded-lg font-medium transition-colors">
            📊 Dashboard
          </Link>
          <Link href="/leads" className="block px-4 py-2 hover:bg-gray-700 rounded-lg font-medium transition-colors">
            📋 Talepler
          </Link>
          <Link href="/demos" className="block px-4 py-2 hover:bg-gray-700 rounded-lg font-medium transition-colors">
            🖥️ Demolar
          </Link>
          <Link href="/portfolio" className="block px-4 py-2 bg-blue-600 rounded-lg font-medium">
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
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Portfolyo Yönetimi</h1>
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {showForm ? "İptal" : "+ Yeni İş Ekle"}
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-8">
          Buraya eklediğiniz işler ana sitenin Portfolyo sayfasında herkese açık şekilde logo + link olarak görünür.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? "İşi Düzenle" : "Yeni İş Ekle"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proje Adı *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Örn: Dönerci Usta"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Linki *</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                  placeholder="https://ornek-site.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo Görseli</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {uploadingImage && <p className="text-xs text-blue-600 mt-1">Görsel yükleniyor...</p>}
                {formData.logo_image && (
                  <p className="text-xs text-green-600 mt-1">✓ Görsel yüklendi</p>
                )}
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {editingId ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Henüz portfolyo öğesi eklenmemiş.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  {item.logo_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.logo_image.startsWith("http") ? item.logo_image : `${API_URL}${item.logo_image}`}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain p-4"
                    />
                  ) : (
                    <span className="text-3xl">🌐</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.is_active === 1 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {item.is_active === 1 ? "Görünür" : "Gizli"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3 break-all">{item.url}</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                    >
                      🔗 Siteyi Aç
                    </a>
                    <button
                      onClick={() => toggleActive(item)}
                      className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {item.is_active === 1 ? "Gizle" : "Göster"}
                    </button>
                    <button
                      onClick={() => startEdit(item)}
                      className="text-xs px-2 py-1 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs px-2 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}