# Kodatrix - Kullanım Rehberi

## 🚀 Nasıl Başlatırım?

Tek tıkla: **`baslat.bat`** dosyasına çift tıkla. Hepsi otomatik açılır.

| Servis | Adres |
|--------|-------|
| Backend API | http://localhost:3000 |
| Ana Site | http://localhost:3001 |
| Admin Panel | http://localhost:3002 |

**Admin girişi:** kullanıcı adı `admin`, şifre `kodatrix_guvenli_sifre` (`kodatrix-backend/.env` dosyasından değiştirebilirsin).

---

## 🧭 İki Farklı Bölüm: Portfolyo vs Demolar

| | 🌐 Portfolyo | 🖥️ Demolar |
|---|---|---|
| **Amaç** | Ana sitede referans göstermek | Müşteriye özel önizleme vermek |
| **Kim görür?** | Herkes (ana sitede) | Sadece link + şifreyi bilen müşteri |
| **Giriş** | Şifresiz, logoya tıkla → site açılır | Sadece şifre sorulur |
| **Nerede yönetilir?** | Admin → Portfolyo | Admin → Demolar |

---

## 🌐 Portfolyo (Ana Sitede Görünen)

1. Admin panel → **Portfolyo** → **+ Yeni İş Ekle**
2. Proje adı, site linki ve logo görselini ekle
3. Ana sitenin Portfolyo sayfasında logoya tıklayınca siteye gider (şifre sormaz)

---

## 🖥️ Müşteri Demosu (Şifreli, Ana Sitede Görünmez)

### Adım 1: Site dosyalarını ZIP'le
Müşteri sitesinin tüm dosyalarını (index.html, css, js, img...) bir klasöre koyup **ZIP** yapın.
- ZIP'in içinde ana sayfa **index.html** olmalı
- Klasörü direkt ZIP'leyebilirsiniz (örn: `donerciusta.zip`), sistem otomatik algılar

### Adım 2: Admin panelden demo ekle
1. Admin → **Demolar** → **+ Yeni Demo Ekle**
2. **URL Uzantısı (slug)** yazın (örn: `donerciusta`)
3. **Demo Şifresi** belirleyin (kullanıcı adı yok!)
4. **Site Dosyaları (ZIP)** alanından ZIP'i seçin → "✓ Site dosyaları yüklendi" yazısını bekleyin
5. Kaydet → **🔗 Linki Kopyala** butonuyla linki alın

> ZIP yüklendiğinde otomatik olarak `kodatrix-backend/public_demos/<slug>/` klasörüne açılır. Manuel klasör kopyalamaya gerek yok!

### Adım 3: Müşteriye gönder
```
http://localhost:3000/demo/donerciusta          (yerel test)
https://kodatrix.com/demo/donerciusta           (canlıda)
```
Müşteri linke girince **sadece şifre soran** şık bir sayfa görür. Doğru şifre → sitenin ana sayfası açılır, müşteri siteyi dolaşabilir.

---

## 📋 Talepler (Kanban)

- İletişim formundan gelen talepler buraya düşer
- **Yeni Talep → Yapım Sürecinde → Yapıldı** butonlarıyla durum değiştir
- **🗑 Sil** butonu ile talep silebilirsin
- Dashboard 10 saniyede bir otomatik güncellenir

---

## 🌐 Gerçek Sunucuya Nasıl Bağlarım?

1. **VPS kiralayın** (Hetzner, DigitalOcean, Contabo vb. - aylık ~$5)
2. Sunucuya **Node.js** kurun (v20+)
3. Proje dosyalarını sunucuya kopyalayın (FTP/Git ile)
4. Sunucuda her klasörde `npm install` çalıştırın
5. **PM2** ile servisleri sürekli çalıştırın:
   ```bash
   npm install -g pm2
   cd kodatrix-backend && pm2 start server.js --name backend
   cd ../kodatrix-site && pm2 start "npm run start" --name site
   cd ../kodatrix-admin && pm2 start "npm run start -p 3002" --name admin
   ```
6. **Domain yönlendirme (Nginx ile):**
   - `kodatrix.com` → localhost:3001
   - `admin.kodatrix.com` → localhost:3002
   - `kodatrix.com/api` ve `kodatrix.com/demo` → localhost:3000
7. Ücretsiz **SSL** için Certbot kullanın: `certbot --nginx`

> Not: Canlıya aldığında frontend dosyalarındaki `http://localhost:3000` adreslerini `https://kodatrix.com` çevirmen gerekir.

---

## ❓ Sık Sorulanlar

**"Sunucuya bağlanılamadı" hatası:** Backend (port 3000) kapalı demektir. `baslat.bat` ile başlat.

**Dashboard güncellenmiyor:** 10 saniyede bir otomatik yenilenir; anında görmek için F5.