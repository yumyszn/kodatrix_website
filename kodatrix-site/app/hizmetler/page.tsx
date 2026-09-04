import Link from "next/link";

export default function HizmetlerPage() {
  return (
    <div>
      {/* Başlık */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Hizmetlerimiz</h1>
          <p className="text-xl">Yazılım ve reklamcılık alanında kapsamlı çözümler</p>
        </div>
      </section>

      {/* Yazılım Hizmetleri */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Yazılım Hizmetleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Web Sitesi Tasarımı</h3>
              <p className="text-gray-600">Modern, responsive ve SEO uyumlu web siteleri tasarlıyoruz.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-2">E-Ticaret Çözümleri</h3>
              <p className="text-gray-600">Satışlarınızı artıracak güvenli ve kullanıcı dostu e-ticaret platformları.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Özel Yazılım Geliştirme</h3>
              <p className="text-gray-600">İşletmenizin ihtiyaçlarına özel, ölçeklenebilir yazılım çözümleri.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reklamcılık Hizmetleri */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Reklamcılık Hizmetleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Dijital Reklam Kampanyaları</h3>
              <p className="text-gray-600">Google Ads, Meta Ads ve diğer platformlarda hedefli reklam yönetimi.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Sosyal Medya Yönetimi</h3>
              <p className="text-gray-600">Markanızı sosyal medyada etkili bir şekilde temsil ediyoruz.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-2">SEO & Arama Motoru Optimizasyonu</h3>
              <p className="text-gray-600">Web sitenizin arama motorlarında üst sıralara çıkmasını sağlıyoruz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Hizmetlerimizden Faydalanın</h2>
          <p className="text-lg mb-8">Size özel teklifimizi almak için hemen iletişime geçin.</p>
          <Link
            href="/iletisim"
            className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Teklif Al
          </Link>
        </div>
      </section>
    </div>
  );
}