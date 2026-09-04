"use client";

import { useState } from "react";

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    // Telefon doğrulama: 0 ile başlayan 11 haneli numara (örn: 0501 234 56 78)
    const digits = formData.phone.replace(/\D/g, "");
    if (!/^0?5\d{9}$/.test(digits)) {
      setError("Geçerli bir telefon numarası girin (örn: 0501 234 56 78).");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ customer_name: "", phone: "", email: "", message: "" });
      } else {
        setError(data.error || "Bir hata oluştu.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Başlık */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">İletişim</h1>
          <p className="text-xl">Projeniz hakkında konuşalım</p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              Talebiniz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-2">
                Ad Soyad *
              </label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                required
                value={formData.customer_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Adınız Soyadınız"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefon *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                pattern="0[5][0-9]{2}[ ]?[0-9]{3}[ ]?[0-9]{2}[ ]?[0-9]{2}"
                title="Örnek: 0501 234 56 78"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0501 234 56 78"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Mesajınız
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ne yapmamızı istersiniz? Web sitesi, reklam kampanyası, e-ticaret..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Gönderiliyor..." : "Talebi Gönder"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}