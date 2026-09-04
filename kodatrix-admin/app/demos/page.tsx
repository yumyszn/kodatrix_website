"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Demo {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string | null;
  preview_image: string | null;
  auth_password: string;
  start_file: string | null;
  is_active: number;
  created_at: string;
}

const API_URL = "http://localhost:3000";

export default function DemosPage() {
  const router = useRouter();
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingZip, setUploadingZip] = useState(false);
  const [zipUploaded, setZipUploaded] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    description: "",
    preview_image: "",
    auth_password: "",
    start_file: "index.html",
    is_active: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("kodatrix_token");
    if (!token) {
      router.push("/");
      return;
    }

    const fetchDemos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/demos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setDemos(data.data);
        } else {
          setError("Demolar yüklenirken hata oluştu.");
        }
      } catch {
        setError("Sunucuya bağlanılamadı. Backend'in çalıştığından emin olun (baslat.bat).");
      } finally {
        setLoading(false);
      }
    };

    fetchDemos();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("kodatrix_token");
    router.push("/");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
        setFormData((prev) => ({ ...prev, preview_image: data.url }));
      } else {
        setError(data.error || "Görsel yüklenemedi.");
      }
    } catch {
      setError("Görsel yüklenirken hata oluştu.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = localStorage.getItem("kodatrix_token");
    if (!token) return;

    const slug = formData.slug;
    if (!slug) {
      setError("Önce URL Uzantısı (slug) alanını doldurun, sonra ZIP yükleyin.");
      e.target.value = "";
      return;
    }

    setUploadingZip(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("zipfile", file);
      fd.append("slug", slug);
      const res = await fetch(`${API_URL}/api/admin/upload-demo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        setZipUploaded(true);
      } else {
        setError(data.error || "ZIP yüklenemedi.");
        setZipUploaded(false);
      }
    } catch {
      setError("ZIP yüklenirken hata oluştu.");
      setZipUploaded(false);
    } finally {
      setUploadingZip(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      category: "",
      description: "",
      preview_image: "",
      auth_password: "",
      start_file: "index.html",
      is_active: true,
    });
    setEditingId(null);
    setShowForm(false);
    setZipUploaded(false);
  };

  const startEdit = (demo: Demo) => {
    setEditingId(demo.id);
    setFormData({
      title: demo.title,
      slug: demo.slug,
      category: demo.category,
      description: demo.description || "",
      preview_image: demo.preview_image || "",
      auth_password: demo.auth_password,
      start_file: demo.start_file || "index.html",
      is_active: demo.is_active === 1,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("kodatrix_token");
    if (!token) return;

    try {
      const url = editingId
        ? `${API_URL}/api/admin/demos/${editingId}`
        : `${API_URL}/api/admin/demos`;
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          is_active: formData.is_active ? 1 : 0,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const demosRes = await fetch(`${API_URL}/api/admin/demos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const demosData = await demosRes.json();
        if (demosData.success) setDemos(demosData.data);
        resetForm();
      } else {
        setError(data.error || "İşlem başarısız.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    }
  };

  const toggleActive = async (demo: Demo) => {
    const token = localStorage.getItem("kodatrix_token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/demos/${demo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: demo.is_active === 1 ? 0 : 1 }),
      });

      const data = await res.json();
      if (data.success) {
        setDemos(demos.map((d) => (d.id === demo.id ? { ...d, is_active: d.is_active === 1 ? 0 : 1 } : d)));
      }
    } catch {
      setError("Durum güncellenirken hata oluştu.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu demoyu silmek istediğinize emin misiniz?")) return;
    const token = localStorage.getItem("kodatrix_token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/demos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setDemos(demos.filter((d) => d.id !== id));
      } else {
        setError(data.error || "Silme işlemi başarısız.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    }
  };

  const copyLink = (slug: string) => {
    const link = `${API_URL}/demo/${slug}`;
    navigator.clipboard.writeText(link);
    alert("Link kopyalandı: " + link);
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
          <Link href="/demos" className="block px-4 py-2 bg-blue-600 rounded-lg font-medium">
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
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Müşteri Demoları</h1>
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {showForm ? "İptal" : "+ Yeni Demo Ekle"}
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-8">
          Bu demolar ana sitede görünmez. Müşteriye gönderdiğiniz link + şifre ile sadece o müşteri erişir.
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
              {editingId ? "Demoyu Düzenle" : "Yeni Demo Ekle"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri / Proje Adı *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  placeholder="Dönerci Usta"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Uzantısı (slug) *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleFormChange}
                  required
                  placeholder="donerciusta"
                  pattern="[a-z0-9-]+"
                  title="Sadece küçük harf, rakam ve tire kullanın"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.slug && (
                  <p className="text-xs text-gray-500 mt-1">Link: {API_URL}/demo/{formData.slug}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Demo Şifresi *</label>
                <input
                  type="text"
                  name="auth_password"
                  value={formData.auth_password}
                  onChange={handleFormChange}
                  required
                  placeholder="Müşteriye vereceğiniz şifre"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Baslangic Dosyasi</label>
                <input
                  type="text"
                  name="start_file"
                  value={formData.start_file}
                  onChange={handleFormChange}
                  placeholder="index.html"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Statik site: <code>index.html</code> | React build: <code>build/index.html</code> | Vue: <code>dist/index.html</code>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Görseli</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {uploadingImage && <p className="text-xs text-blue-600 mt-1">Görsel yükleniyor...</p>}
                {formData.preview_image && (
                  <p className="text-xs text-green-600 mt-1">✓ Görsel yüklendi</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Dosyaları (ZIP) — Müşteri sitesinin tüm dosyalarını ZIP yapın
                </label>
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleZipUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {uploadingZip && <p className="text-xs text-blue-600 mt-1">ZIP yükleniyor ve açılıyor...</p>}
                {zipUploaded && (
                  <p className="text-xs text-green-600 mt-1">✓ Site dosyaları yüklendi! Müşteri şifre girince siteyi görebilecek.</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  ZIP içinde ana sayfa <strong>index.html</strong> olmalı. (React/Next.js ise önce build alıp statik çıktıyı ZIP'leyin)
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama (opsiyonel)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleFormChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Demo aktif (müşteri erişebilsin)</span>
                </label>
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
        ) : demos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Henüz demo eklenmemiş.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demos.map((demo) => (
              <div key={demo.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  {demo.preview_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={demo.preview_image.startsWith("http") ? demo.preview_image : `${API_URL}${demo.preview_image}`} alt={demo.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">🖥️</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{demo.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${demo.is_active === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {demo.is_active === 1 ? "Aktif" : "Pasif"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">🔒 Şifre: {demo.auth_password}</p>
                  <p className="text-xs text-gray-400 mb-3 break-all">/demo/{demo.slug}</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      onClick={() => copyLink(demo.slug)}
                      className="text-xs px-2 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                    >
                      🔗 Linki Kopyala
                    </button>
                    <button
                      onClick={() => toggleActive(demo)}
                      className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {demo.is_active === 1 ? "Pasifleştir" : "Aktifleştir"}
                    </button>
                    <button
                      onClick={() => startEdit(demo)}
                      className="text-xs px-2 py-1 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(demo.id)}
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