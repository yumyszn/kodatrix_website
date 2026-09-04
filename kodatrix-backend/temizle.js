// Eski test verilerini temizler (bir kez çalıştırılır)
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./kodatrix.db');

db.serialize(() => {
    // Eski vitrin demolarını sil (donerciusta, mertusta test verileri)
    db.run(`DELETE FROM demos`, (err) => {
        if (err) console.error('Demos silinemedi:', err);
        else console.log('✓ Eski demolar temizlendi.');
    });

    // Eski vitrin kolonunu kaldırmaya gerek yok, yeni tablo yapısı kullanılıyor
    console.log('✓ Temizlik tamamlandı.');
    db.close();
});