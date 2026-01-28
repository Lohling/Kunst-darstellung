# 🎨 Kunstdarstellung - Docker Webserver

Vollständiges Docker-Setup für Dateispeicherung und Abruf mit Node.js/Express.

## 📋 Voraussetzungen

- **Docker** installiert ([Download](https://www.docker.com/products/docker-desktop))
- **Docker Compose** installiert (normalerweise mit Docker Desktop enthalten)

## 🚀 Start

### 1. Docker Container starten

```bash
docker-compose up -d
```

Dies startet automatisch:
- **Node.js/Express Server** auf Port 3000
- **Nginx Webserver** auf Port 8080

### 2. Im Browser öffnen

```
http://localhost:8080
```

### 3. Verschiedene Seiten

- **Galerie anzeigen**: http://localhost:8080/UserA_viewer.html
- **Kamera (Fotos)**: http://localhost:8080/UserB_camera.html
- **Admin**: http://localhost:8080/UserC_admin.html

## 📁 Struktur

```
.
├── public/                    # HTML/CSS/JS Frontend
│   ├── UserA_viewer.html     # Foto-Galerie
│   ├── UserB_camera.html     # Kamera-Steuerung
│   └── UserC_admin.html      # Admin-Panel
├── server.js                  # Node.js Express Server
├── package.json              # Dependencies
├── Dockerfile                # Docker Image Definition
├── docker-compose.yml        # Docker Compose Konfiguration
├── nginx.conf                # Nginx Konfiguration
└── uploads/                  # Hochgeladene Dateien (wird automatisch erstellt)
```

## 🔌 API Endpoints

### Dateien hochladen
```bash
POST /api/upload
Content-Type: application/json

{
  "data": "data:image/jpeg;base64,...",
  "filename": "photo-2024.jpg"
}
```

### Alle Dateien abrufen
```bash
GET /api/files
```

### Spezifische Datei abrufen
```bash
GET /api/file/{filename}
```

### Datei löschen
```bash
DELETE /api/file/{filename}
```

## 🛑 Container stoppen

```bash
docker-compose down
```

## 📊 Logs anzeigen

```bash
docker-compose logs -f kunstdarstellung
```

## 🔄 Container neustarten

```bash
docker-compose restart
```

## 📦 Daten persistieren

Die `uploads/` Verzeichnis wird automatisch erstellt und bleibt auch nach dem Stoppen der Container erhalten.

## 🐛 Troubleshooting

### Port 3000 oder 8080 ist bereits in Gebrauch?

In `docker-compose.yml` ändern:
```yaml
ports:
  - "3001:3000"  # oder einen anderen Port
  - "8081:80"
```

### Images neu bauen

```bash
docker-compose build --no-cache
```

### Alles zurücksetzen

```bash
docker-compose down -v
```

---

**Viel Spaß mit deinem Kunstdarstellung-Server! 🎨**
