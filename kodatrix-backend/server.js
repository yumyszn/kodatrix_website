require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const AdmZip = require('adm-zip');
const db = require('./database');

const app = express();
app.use(express.json());
app.use(cors());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'gorsel-' + unique + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) return cb(null, true);
        cb(new Error('Sadece resim dosyalari yuklenebilir.'));
    }
});
const zipUpload = multer({
    storage: storage,
    limits: { fileSize: 200 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const isZip = file.mimetype === 'application/zip' ||
                      file.mimetype === 'application/x-zip-compressed' ||
                      file.originalname.toLowerCase().endsWith('.zip');
        if (isZip) return cb(null, true);
        cb(new Error('Sadece ZIP dosyalari yuklenebilir.'));
    }
});

app.use('/uploads', express.static(uploadDir));

function getCookie(req, name) {
    const header = req.headers.cookie || '';
    const pair = header.split(';').map(c => c.trim()).find(c => c.startsWith(name + '='));
    return pair ? decodeURIComponent(pair.split('=').slice(1).join('=')) : null;
}
function verifyDemoAccess(req, slug) {
    const token = getCookie(req, 'demo_' + slug);
    if (!token) return false;
    try { return jwt.verify(token, process.env.JWT_SECRET).demo === slug; } catch { return false; }
}

app.get('/api/portfolio', (req, res) => {
    db.all('SELECT id, title, url, logo_image FROM portfolio WHERE is_active = 1 ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Veritabani hatasi.' });
        res.json({ success: true, data: rows });
    });
});

app.post('/demo/:slug', (req, res) => {
    const { slug } = req.params;
    const { password } = req.body;
    db.get('SELECT * FROM demos WHERE slug = ? AND is_active = 1', [slug], (err, demo) => {
        if (err || !demo) return res.status(404).json({ error: 'Demo bulunamadi.' });
        if (password !== demo.auth_password) return res.status(401).json({ error: 'Hatali sifre.' });
        const demoToken = jwt.sign({ demo: slug }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.setHeader('Set-Cookie', 'demo_' + slug + '=' + encodeURIComponent(demoToken) + '; Path=/; HttpOnly; Max-Age=3600; SameSite=Lax');
        res.json({ success: true, message: 'Sifre dogru, demo aciliyor.' });
    });
});

app.get('/demo/:slug', (req, res) => {
    const { slug } = req.params;
    const isIndex = req.path.endsWith('/');
    db.get('SELECT * FROM demos WHERE slug = ? AND is_active = 1', [slug], (err, demo) => {
        if (err || !demo) return res.status(404).send('Demo bulunamadi.');
        if (!verifyDemoAccess(req, slug)) {
            if (isIndex) return res.redirect('/demo/' + slug);
            return res.send(`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${demo.title} - Kodatrix Demo</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;background:linear-gradient(135deg,#1e40af,#1e3a8a);min-height:100vh;display:flex;align-items:center;justify-content:center}.card{background:#fff;padding:40px;border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,.3);width:100%;max-width:400px;margin:20px}.logo{width:60px;height:60px;background:#2563eb;border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}.logo span{color:#fff;font-size:32px;font-weight:700}h1{text-align:center;color:#111827;font-size:22px;margin-bottom:6px}p{text-align:center;color:#6b7280;font-size:14px;margin-bottom:24px}input{width:100%;padding:12px 16px;border:2px solid #e5e7eb;border-radius:10px;font-size:16px;outline:0;transition:border-color .2s}input:focus{border-color:#2563eb}button{width:100%;padding:12px;background:#2563eb;color:#fff;border:0;border-radius:10px;font-size:16px;font-weight:600;cursor:pointer;margin-top:12px;transition:background .2s}button:hover{background:#1d4ed8}.error{color:#dc2626;font-size:13px;text-align:center;margin-top:10px;display:none}</style></head><body><div class="card"><div class="logo"><span>K</span></div><h1>${demo.title}</h1><p>Demo sitesini goruntulemek icin sifreyi girin</p><form onsubmit="event.preventDefault();fetch(\'/demo/${slug}\',{method:\'POST\',headers:{\'Content-Type\':\'application/json\'},body:JSON.stringify({password:document.getElementById(\'pw\').value})}).then(r=>r.json()).then(d=>{if(d.success){window.location.href=\'/demo/${slug}/\'}else{document.getElementById(\'err\').style.display=\'block\'}}).catch(()=>{document.getElementById(\'err\').style.display=\'block\'})"><input type="password" id="pw" placeholder="Sifre" required autofocus><button type="submit">Demoyu Ac</button><div class="error" id="err">Hatali sifre, tekrar deneyin.</div></form></div></body></html>`);
        }
        if (isIndex) {
            // start_file varsa onu kullan, yoksa index.html
            const startFile = demo.start_file || 'index.html';
            const indexPath = path.join(__dirname, 'public_demos', slug, startFile);
            if (!fs.existsSync(indexPath)) {
                // start_file bulunamadi, klasördeki index.html'leri listele
                const demoDir = path.join(__dirname, 'public_demos', slug);
                const allFiles = fs.readdirSync(demoDir).filter(f => f.endsWith('.html'));
                return res.status(404).send(
                    'Baslangic dosyasi bulunamadi: ' + startFile +
                    '<br><br>Klasordeki HTML dosyalari: ' + (allFiles.length > 0 ? allFiles.join(', ') : 'hicbiri') +
                    '<br><br>Admin panelden "Baslangic Dosyasi" alanini duzenleyin.'
                );
            }
            return res.sendFile(indexPath);
        }
        return res.redirect('/demo/' + slug + '/');
    });
});

app.get(/^\/demo\/([a-z0-9-]+)\/(.+)$/, (req, res) => {
    const slug = req.params[0];
    const relPath = req.params[1];
    db.get('SELECT * FROM demos WHERE slug = ? AND is_active = 1', [slug], (err, demo) => {
        if (err || !demo) return res.status(404).send('Demo bulunamadi.');
        if (!verifyDemoAccess(req, slug)) return res.status(401).send('Erisim engellendi.');
        const demoDir = path.join(__dirname, 'public_demos', slug);
        const filePath = path.normalize(path.join(demoDir, relPath));
        if (!filePath.startsWith(path.normalize(demoDir + path.sep))) return res.status(403).send('Erisim engellendi.');
        if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return res.status(404).send('Dosya bulunamadi.');
        res.sendFile(filePath);
    });
});

app.post('/api/contact', (req, res) => {
    const { customer_name, phone, email, message } = req.body;
    if (!customer_name || !phone) return res.status(400).json({ error: 'Ad soyad ve telefon zorunludur.' });
    const digits = phone.replace(/\D/g, '');
    if (!/^0?5\d{9}$/.test(digits)) return res.status(400).json({ error: 'Gecerli bir telefon numarasi girin.' });
    db.run('INSERT INTO leads (customer_name, phone, email, message) VALUES (?, ?, ?, ?)', [customer_name, phone, email || null, message || null], function (err) {
        if (err) return res.status(500).json({ error: 'Talep kaydedilemedi.' });
        res.status(201).json({ success: true, message: 'Talebiniz alindi.' });
    });
});

const authenticateAdmin = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token eksik.' });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Gecersiz token.' });
        req.user = user; next();
    });
};

app.post('/api/admin/upload', authenticateAdmin, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Gorsel yuklenemedi.' });
    res.json({ success: true, url: '/uploads/' + req.file.filename });
});

app.post('/api/admin/upload-demo', authenticateAdmin, zipUpload.single('zipfile'), (req, res) => {
    const { slug } = req.body;
    if (!slug) return res.status(400).json({ error: 'Slug zorunludur.' });
    if (!req.file) return res.status(400).json({ error: 'ZIP yuklenemedi.' });
    const targetDir = path.join(__dirname, 'public_demos', slug);
    try {
        const zip = new AdmZip(req.file.path);
        const entries = zip.getEntries();
        let hasIndex = entries.some(e => e.entryName.endsWith('index.html'));
        let stripPrefix = '';
        if (!hasIndex) {
            const dirs = new Set(entries.filter(e => !e.isDirectory).map(e => e.entryName.split('/')[0]));
            if (dirs.size === 1) { stripPrefix = [...dirs][0] + '/'; hasIndex = entries.some(e => e.entryName === stripPrefix + 'index.html'); }
        }
        if (!hasIndex) { fs.unlinkSync(req.file.path); return res.status(400).json({ error: 'ZIP icinde index.html bulunamadi.' }); }
        if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true, force: true });
        fs.mkdirSync(targetDir, { recursive: true });
        zip.extractAllTo(targetDir, true);
        if (stripPrefix) {
            const innerDir = path.join(targetDir, stripPrefix);
            const tempDir = path.join(path.dirname(targetDir), 'temp_' + Date.now());
            fs.renameSync(innerDir, tempDir);
            fs.rmSync(targetDir, { recursive: true, force: true });
            fs.renameSync(tempDir, targetDir);
        }
        fs.unlinkSync(req.file.path);
        res.json({ success: true, message: 'Demo dosyalari yuklendi.' });
    } catch (err) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'ZIP acilirken hata: ' + err.message });
    }
});

app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
        return res.json({ success: true, token });
    }
    res.status(401).json({ error: 'Hatali sifre.' });
});

app.get('/api/admin/leads', authenticateAdmin, (req, res) => {
    db.all('SELECT * FROM leads ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Talepler cekilemedi.' });
        res.json({ success: true, data: rows });
    });
});
app.patch('/api/admin/leads/:id/status', authenticateAdmin, (req, res) => {
    const { id } = req.params; const { status } = req.body;
    if (!['Yeni Talep', 'Yapim Surecinde', 'Yapildi'].includes(status)) return res.status(400).json({ error: 'Gecersiz durum.' });
    db.run('UPDATE leads SET status = ? WHERE id = ?', [status, id], function (err) {
        if (err) return res.status(500).json({ error: 'Durum guncellenemedi.' });
        res.json({ success: true, message: 'Talep durumu guncellendi.' });
    });
});
app.delete('/api/admin/leads/:id', authenticateAdmin, (req, res) => {
    db.run('DELETE FROM leads WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: 'Talep silinemedi.' });
        res.json({ success: true, message: 'Talep silindi.' });
    });
});

app.get('/api/admin/demos', authenticateAdmin, (req, res) => {
    db.all('SELECT * FROM demos ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Demolar cekilemedi.' });
        res.json({ success: true, data: rows });
    });
});
app.post('/api/admin/demos', authenticateAdmin, (req, res) => {
    const { title, slug, category, description, preview_image, auth_password } = req.body;
    if (!title || !slug || !auth_password) return res.status(400).json({ error: 'Baslik, slug ve sifre zorunludur.' });
    db.run('INSERT INTO demos (title, slug, category, description, preview_image, auth_password) VALUES (?, ?, ?, ?, ?, ?)', [title, slug, category || 'Web Sitesi', description || null, preview_image || null, auth_password], function (err) {
        if (err) return res.status(500).json({ error: 'Demo eklenemedi.' });
        res.status(201).json({ success: true, message: 'Demo eklendi.', demoId: this.lastID });
    });
});
app.patch('/api/admin/demos/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params; const { title, slug, category, description, preview_image, auth_password, is_active } = req.body;
    db.run('UPDATE demos SET title=COALESCE(?,title),slug=COALESCE(?,slug),category=COALESCE(?,category),description=COALESCE(?,description),preview_image=COALESCE(?,preview_image),auth_password=COALESCE(?,auth_password),is_active=COALESCE(?,is_active) WHERE id=?', [title, slug, category, description, preview_image, auth_password, is_active, id], function (err) {
        if (err) return res.status(500).json({ error: 'Demo guncellenemedi.' });
        res.json({ success: true, message: 'Demo guncellendi.' });
    });
});
app.delete('/api/admin/demos/:id', authenticateAdmin, (req, res) => {
    // Önce demo bilgilerini al (slug için)
    db.get('SELECT slug FROM demos WHERE id = ?', [req.params.id], (err, demo) => {
        if (err || !demo) return res.status(404).json({ error: 'Demo bulunamadi.' });

        // DB'den sil
        db.run('DELETE FROM demos WHERE id = ?', [req.params.id], function (dbErr) {
            if (dbErr) return res.status(500).json({ error: 'Demo silinemedi.' });

            // Klasörü de sil (senkronizasyon)
            const demoDir = path.join(__dirname, 'public_demos', demo.slug);
            if (fs.existsSync(demoDir)) {
                fs.rmSync(demoDir, { recursive: true, force: true });
            }

            res.json({ success: true, message: 'Demo ve dosyalari silindi.' });
        });
    });
});

app.get('/api/admin/portfolio', authenticateAdmin, (req, res) => {
    db.all('SELECT * FROM portfolio ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Portfolyo cekilemedi.' });
        res.json({ success: true, data: rows });
    });
});
app.post('/api/admin/portfolio', authenticateAdmin, (req, res) => {
    const { title, url, logo_image } = req.body;
    if (!title || !url) return res.status(400).json({ error: 'Baslik ve URL zorunludur.' });
    db.run('INSERT INTO portfolio (title, url, logo_image) VALUES (?, ?, ?)', [title, url, logo_image || null], function (err) {
        if (err) return res.status(500).json({ error: 'Portfolyo eklenemedi.' });
        res.status(201).json({ success: true, message: 'Portfolyo eklendi.', id: this.lastID });
    });
});
app.patch('/api/admin/portfolio/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params; const { title, url, logo_image, is_active } = req.body;
    db.run('UPDATE portfolio SET title=COALESCE(?,title),url=COALESCE(?,url),logo_image=COALESCE(?,logo_image),is_active=COALESCE(?,is_active) WHERE id=?', [title, url, logo_image, is_active, id], function (err) {
        if (err) return res.status(500).json({ error: 'Guncellenemedi.' });
        res.json({ success: true, message: 'Portfolyo guncellendi.' });
    });
});
app.delete('/api/admin/portfolio/:id', authenticateAdmin, (req, res) => {
    db.run('DELETE FROM portfolio WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: 'Silinemedi.' });
        res.json({ success: true, message: 'Portfolyo silindi.' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Kodatrix Sunucusu ' + PORT + ' portunda aktif.'));