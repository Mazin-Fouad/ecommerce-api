# E-Commerce API

Eine vollständige E-Commerce REST API basierend auf Node.js, Express und MySQL.

## Features

- ✅ Benutzerregistrierung und -authentifizierung (JWT)
- ✅ Benutzerprofilverwaltung
- ✅ Produktkatalog (in Entwicklung)
- 🔄 Warenkorb-Funktionalität (geplant)
- 🔄 Bestellverwaltung (geplant)
- ✅ Rate Limiting und Sicherheit
- ✅ Docker-Unterstützung

## Schnellstart

### Voraussetzungen

- Node.js (>= 16)
- MySQL (>= 8.0)
- Docker & Docker Compose (optional)

### Installation

1. **Repository klonen**
   ```bash
   git clone https://github.com/Mazin-Fouad/ecommerce-api.git
   cd ecommerce-api
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**
   ```bash
   cp .env.example .env
   # Bearbeite .env mit deinen Datenbankdaten
   ```

4. **Datenbank einrichten**
   ```bash
   # Mit Docker
   docker-compose up -d mysql

   # Oder manuell eine MySQL-Datenbank erstellen
   mysql -u root -p
   CREATE DATABASE ecommerce;
   ```

5. **Server starten**
   ```bash
   # Entwicklung
   npm run dev

   # Produktion
   npm start
   ```

### Mit Docker

```bash
docker-compose up -d
```

## API Endpunkte

### Basis
- `GET /` - API Status
- `GET /health` - Health Check

### Benutzer
- `POST /api/users/register` - Benutzerregistrierung
- `POST /api/users/login` - Benutzeranmeldung
- `PUT /api/users/profile` - Profil aktualisieren (Auth erforderlich)

### Produkte (in Entwicklung)
- `GET /api/products` - Alle Produkte abrufen
- `GET /api/products/:id` - Produkt nach ID abrufen

## Umgebungsvariablen

| Variable | Beschreibung | Standard |
|----------|--------------|----------|
| `PORT` | Server Port | 3000 |
| `NODE_ENV` | Umgebung | development |
| `DB_NAME` | Datenbankname | ecommerce |
| `DB_USER` | Datenbankbenutzer | root |
| `DB_PASSWORD` | Datenbankpasswort | - |
| `DB_HOST` | Datenbankhost | localhost |
| `DB_PORT` | Datenbankport | 3306 |
| `JWT_SECRET` | JWT Secret Key | - |
| `JWT_EXPIRES_IN` | JWT Ablaufzeit | 7d |
| `ALLOWED_ORIGINS` | CORS Origins | * |

## Entwicklung

### Projektstruktur

```
src/
├── app.js              # Express App Konfiguration
├── server.js           # Server Entry Point
├── config/
│   └── database.js     # Datenbank Konfiguration
├── controllers/        # Request Handler
├── middleware/         # Custom Middleware
├── models/            # Sequelize Modelle
└── routes/            # API Routen
```

### Datenbank Migrationen

```bash
# Migration erstellen
npx sequelize migration:generate --name migration-name

# Migrationen ausführen
npx sequelize db:migrate

# Migration rückgängig machen
npx sequelize db:migrate:undo
```

## Sicherheit

- 🛡️ Helmet.js für HTTP-Header Sicherheit
- 🔐 bcrypt für Passwort-Hashing
- 🎟️ JWT für Authentifizierung
- 🚦 Rate Limiting
- 🔒 CORS Konfiguration

## Tests

```bash
# Tests ausführen (in Entwicklung)
npm test
```

## Beitragen

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne eine Pull Request

## Lizenz

Dieses Projekt steht unter der ISC Lizenz.

## Kontakt

Projektlink: [https://github.com/Mazin-Fouad/ecommerce-api](https://github.com/Mazin-Fouad/ecommerce-api)