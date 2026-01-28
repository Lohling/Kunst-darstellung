const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Uploads-Verzeichnis erstellen, falls nicht vorhanden
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer für Datei-Uploads konfigurieren
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        cb(null, `${timestamp}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// API: Datei hochladen (Base64-Daten)
app.post('/api/upload', (req, res) => {
    const { data, filename } = req.body;
    
    if (!data || !filename) {
        return res.status(400).json({ error: 'Data und Filename erforderlich' });
    }

    try {
        // Base64-Daten dekodieren (z.B. für Fotos)
        const base64Data = data.split(',')[1] || data;
        const buffer = Buffer.from(base64Data, 'base64');
        const filepath = path.join(uploadsDir, filename);
        
        fs.writeFileSync(filepath, buffer);
        res.json({ success: true, filename, message: 'Datei gespeichert' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: Alle Dateien auflisten
app.get('/api/files', (req, res) => {
    try {
        const files = fs.readdirSync(uploadsDir).map(file => ({
            name: file,
            url: `/uploads/${file}`
        }));
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: Spezifische Datei abrufen
app.get('/api/file/:filename', (req, res) => {
    try {
        const filepath = path.join(uploadsDir, req.params.filename);
        
        // Sicherheit: Pfad-Traversal-Angriffe verhindern
        if (!filepath.startsWith(uploadsDir)) {
            return res.status(403).json({ error: 'Zugriff verweigert' });
        }

        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: 'Datei nicht gefunden' });
        }

        res.sendFile(filepath);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: Datei löschen
app.delete('/api/file/:filename', (req, res) => {
    try {
        const filepath = path.join(uploadsDir, req.params.filename);
        
        if (!filepath.startsWith(uploadsDir)) {
            return res.status(403).json({ error: 'Zugriff verweigert' });
        }

        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: 'Datei nicht gefunden' });
        }

        fs.unlinkSync(filepath);
        res.json({ success: true, message: 'Datei gelöscht' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Statischer Zugriff auf Uploads
app.use('/uploads', express.static(uploadsDir));

// Server starten
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎨 Kunstdarstellung Server läuft auf http://localhost:${PORT}`);
    console.log(`📁 Uploads-Verzeichnis: ${uploadsDir}`);
});
