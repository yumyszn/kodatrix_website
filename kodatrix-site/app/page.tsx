import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Dijital Dünyada İz Bırakın
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Kodatrix olarak yazılım ve reklamcılık alanında işletmenizi dijital dünyada bir adım öne taşıyoruz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/iletisim"
              className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Hemen Teklif Al
            </Link>
            <Link
              href="/portfolyo"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Çalışmalarımızı Görün
            </Link>
          </div>
        </div>
      </section>

      {/* Hizmetler Özeti */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Hizmetlerimiz</h2>
          <p className="text-center text-gray-600 mb-12">İhtiyacınıza özel çözümler</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Yazılım Hizmeti */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3M8 9l-3 3M8 9l0-6M8 9l6 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Yazılım Geliştirme</h3>
              <p className="text-gray-600">
                Modern web siteleri, e-ticaret platformları ve özel yazılım çözümleri. İşletmenizin ihtiyaçlarına uygun, ölçeklenebilir ve güvenli yazılımlar geliştiriyoruz.
              </p>
              <Link href="/hizmetler" className="text-blue-600 font-medium hover:underline mt-4 inline-block">
                Detaylı Bilgi →
              </Link>
            </div>

            {/* Reklamcılık Hizmeti */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h6M15 6h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reklamcılık & Pazarlama</h3>
              <p className="text-gray-600">
                Dijital reklam kampanyaları, sosyal medya yönetimi ve SEO çalışmaları. Markanızı doğru kitleye ulaştırıyor, görünürlüğünüzü artırıyoruz.
              </p>
              <Link href="/hizmetler" className="text-blue-600 font-medium hover:underline mt-4 inline-block">
                Detaylı Bilgi →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Neden Biz? */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Neden Kodatrix?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hızlı Teslimat</h3>
              <p className="text-gray-600">Projelerinizi zamanında ve eksiksiz teslim ediyoruz.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Kaliteli İş</h3>
              <p className="text-gray-600">En son teknolojilerle, en yüksek kalitede çözümler üretiyoruz.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Müşteri Odaklı</h3>
              <p className="text-gray-600">Her projede müşteri memnuniyetini ön planda tutuyoruz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Projenizi Hayata Geçirelim</h2>
          <p className="text-lg mb-8">Fikrinizi bizimle paylaşın, gerisini bize bırakın.</p>
          <Link
            href="/iletisim"
            className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            İletişime Geçin
          </Link>
        </div>
      </section>
    </div>
  );
}