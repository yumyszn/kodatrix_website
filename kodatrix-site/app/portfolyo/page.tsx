"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

interface PortfolioItem {
  id: number;
  title: string;
  url: string;
  logo_image: string | null;
}

export default function PortfolyoPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/portfolio`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setItems(data.data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Başlık */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Portfolyomuz</h1>
          <p className="text-xl">Daha önce tamamladığımız projeler</p>
        </div>
      </section>

      {/* Projeler */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Projeler yükleniyor...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg mb-4">Projeler yüklenirken bir hata oluştu.</p>
              <p className="text-gray-600">Lütfen daha sonra tekrar deneyin.</p>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Henüz proje eklenmemiş.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
              >
                {/* Logo alanı */}
                <div className="aspect-[16/10] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
                  {item.logo_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.logo_image.startsWith("http") ? item.logo_image : `${API_URL}${item.logo_image}`}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-6xl transition-transform duration-500 group-hover:scale-110">🌐</span>
                  )}
                </div>

                {/* Alt bilgi */}
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                     <p className="text-sm text-gray-500 truncate">{item.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</p>
                  </div>
                  <span className="flex-shrink-0 ml-3 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white group-hover:bg-blue-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}