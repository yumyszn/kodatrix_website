const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./kodatrix.db');

db.serialize(() => {
    // 1. Müşteri İletişim Talepleri (CRM / Kanban)
    db.run(`
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            message TEXT,
            status TEXT DEFAULT 'Yeni Talep', -- 'Yeni Talep', 'Yapım Sürecinde', 'Yapıldı'
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 2. Müşteri Demo Yönetim Tablosu (Sadece şifre ile erişim, ana sitede GÖRÜNMEZ)
    db.run(`
        CREATE TABLE IF NOT EXISTS demos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,      -- örn: donerciusta -> /demo/donerciusta
            category TEXT NOT NULL,
            description TEXT,
            preview_image TEXT,             -- Kapak görseli
            auth_password TEXT NOT NULL,    -- Müşteri giriş şifresi (sadece şifre!)
            start_file TEXT DEFAULT 'index.html', -- Başlangıç dosyası (React için: build/index.html)
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 3. Portfolyo Tablosu (Ana sitede herkese açık, logo + link)
    db.run(`
        CREATE TABLE IF NOT EXISTS portfolio (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            url TEXT NOT NULL,              -- Yapılan sitenin adresi
            logo_image TEXT,                -- Logo görseli
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Eski tablolara yeni kolonlar ekle (migration)
    db.all(`PRAGMA table_info(leads)`, (err, columns) => {
        if (!err && columns && !columns.some(c => c.name === 'email')) {
            db.run(`ALTER TABLE leads ADD COLUMN email TEXT`);
        }
    });

    // Eski demos tablosunda auth_username kolonu varsa (eski yapı), tabloyu yeniden oluştur
    db.all(`PRAGMA table_info(demos)`, (err, columns) => {
        if (!err && columns && columns.length > 0) {
            const hasOldUsername = columns.some(c => c.name === 'auth_username');
            const hasStartFile = columns.some(c => c.name === 'start_file');
            if (hasOldUsername || !hasStartFile) {
                // Eski yapıyı tamamen kaldır, yeni yapıyı kur
                db.run(`DROP TABLE demos`, (dropErr) => {
                    if (!dropErr) {
                        db.run(`
                            CREATE TABLE demos (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                title TEXT NOT NULL,
                                slug TEXT UNIQUE NOT NULL,
                                category TEXT NOT NULL,
                                description TEXT,
                                preview_image TEXT,
                                auth_password TEXT NOT NULL,
                                start_file TEXT DEFAULT 'index.html',
                                is_active INTEGER DEFAULT 1,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                            )
                        `, (createErr) => {
                            if (!createErr) console.log('✓ demos tablosu yeni yapıya taşındı.');
                        });
                    }
                });
            }
        }
    });
});

module.exports = db;