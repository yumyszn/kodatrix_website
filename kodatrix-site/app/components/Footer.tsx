import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Açıklama */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-2xl font-bold text-white">Kodatrix</span>
            </div>
            <p className="text-gray-400 text-sm">
              Yazılım ve reklamcılık alanında profesyonel çözümler. İşletmenizi dijital dünyada bir adım öne taşıyoruz.
            </p>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-blue-400 transition-colors">Anasayfa</Link></li>
              <li><Link href="/hizmetler" className="text-gray-400 hover:text-blue-400 transition-colors">Hizmetler</Link></li>
              <li><Link href="/portfolyo" className="text-gray-400 hover:text-blue-400 transition-colors">Portfolyo</Link></li>
              <li><Link href="/hakkimizda" className="text-gray-400 hover:text-blue-400 transition-colors">Hakkımızda</Link></li>
              <li><Link href="/iletisim" className="text-gray-400 hover:text-blue-400 transition-colors">İletişim</Link></li>
            </ul>
          </div>

          {/* İletişim Bilgileri */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">İletişim</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📧 suzenyusa@gmail.com</li>
              <li>📞 +90 501 343 99 03</li>
              <li>📍 İstanbul, Türkiye</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Kodatrix. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}