import Link from "next/link";

export default function HakkimizdaPage() {
  return (
    <div>
      {/* Başlık */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Hakkımızda</h1>
          <p className="text-xl">Kodatrix'i tanıyın</p>
        </div>
      </section>

      {/* Hikayemiz */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Hikayemiz</h2>
          <p className="text-gray-700 text-lg mb-4">
            Kodatrix, yazılım ve reklamcılık alanında işletmelere dijital çözümler sunmak amacıyla kurulmuştur. 
            Amacımız, her ölçekteki işletmenin dijital dünyada güçlü bir varlık oluşturmasına yardımcı olmaktır.
          </p>
          <p className="text-gray-700 text-lg mb-4">
            Modern web siteleri, e-ticaret platformları, özel yazılım çözümleri ve dijital reklam kampanyaları 
            ile müşterilerimizin işlerini büyütmelerine katkı sağlıyoruz.
          </p>
          <p className="text-gray-700 text-lg">
            Her projede müşteri memnuniyetini ön planda tutuyor, en son teknolojileri kullanarak 
            kaliteli ve sürdürülebilir çözümler üretiyoruz.
          </p>
        </div>
      </section>

      {/* Değerlerimiz */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Müşteri Odaklılık</h3>
              <p className="text-gray-600">Müşterilerimizin ihtiyaçlarını her zaman ön planda tutuyoruz.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Yenilikçilik</h3>
              <p className="text-gray-600">En son teknolojileri takip ediyor, yenilikçi çözümler üretiyoruz.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Güvenilirlik</h3>
              <p className="text-gray-600">Söz verdiğimiz işi zamanında ve eksiksiz teslim ediyoruz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Birlikte Çalışalım</h2>
          <p className="text-lg mb-8">Projeniz hakkında konuşmak için bizimle iletişime geçin.</p>
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