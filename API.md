# API Dokumentation

## Basis-URL
```
http://localhost:3000
```

## Authentifizierung
Die API verwendet JWT (JSON Web Tokens) für die Authentifizierung. Nach der Anmeldung erhalten Sie einen Token, der in nachfolgenden Anfragen im Authorization-Header gesendet werden muss:

```
Authorization: Bearer <your-jwt-token>
```

## Endpunkte

### Status & Health Check

#### GET /
Ruft den API-Status ab.

**Response:**
```json
{
  "message": "Willkommen bei der E-Commerce API!",
  "version": "1.0.0",
  "status": "operational",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### GET /health
Ruft den Gesundheitsstatus der API ab.

**Response:**
```json
{
  "status": "healthy",
  "uptime": 123.456,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Benutzer-Management

#### POST /api/users/register
Registriert einen neuen Benutzer.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "Benutzer erfolgreich registriert.",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }
}
```

**Fehler-Responses:**
- `400` - Validierungsfehler
- `409` - E-Mail bereits registriert

#### POST /api/users/login
Meldet einen Benutzer an.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Anmeldung erfolgreich.",
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }
}
```

**Fehler-Responses:**
- `400` - Fehlende Anmeldedaten
- `401` - Ungültige Anmeldedaten

#### PUT /api/users/profile
Aktualisiert das Benutzerprofil (Authentifizierung erforderlich).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "email": "john.updated@example.com",
  "password": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Benutzerdaten erfolgreich aktualisiert.",
  "user": {
    "id": "uuid",
    "firstName": "John Updated",
    "lastName": "Doe Updated",
    "email": "john.updated@example.com"
  }
}
```

### Produkt-Management

#### GET /api/products
Ruft alle Produkte ab mit optionaler Filterung und Paginierung.

**Query Parameter:**
- `page` (optional): Seitennummer (Standard: 1)
- `limit` (optional): Anzahl Produkte pro Seite (Standard: 10, Max: 100)
- `category` (optional): Filterung nach Kategorie
- `minPrice` (optional): Mindestpreis
- `maxPrice` (optional): Höchstpreis
- `search` (optional): Suchbegriff (Name, Beschreibung, Tags)
- `featured` (optional): true/false für Featured-Produkte

**Beispiel-Anfrage:**
```
GET /api/products?page=1&limit=5&category=elektronik&minPrice=50&maxPrice=500&search=laptop
```

**Response (200):**
```json
{
  "message": "Produkte erfolgreich abgerufen",
  "products": [
    {
      "id": "uuid",
      "name": "Laptop Pro",
      "description": "Hochleistungs-Laptop",
      "price": 1200.00,
      "sku": "LAPTOP-001",
      "stock": 10,
      "category": "Elektronik",
      "brand": "TechBrand",
      "images": [],
      "isActive": true,
      "isFeatured": false
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /api/products/:id
Ruft ein einzelnes Produkt nach ID ab.

**Response (200):**
```json
{
  "message": "Produkt erfolgreich abgerufen",
  "product": {
    "id": "uuid",
    "name": "Laptop Pro",
    "description": "Hochleistungs-Laptop",
    "price": 1200.00,
    "sku": "LAPTOP-001",
    "stock": 10,
    "category": "Elektronik",
    "brand": "TechBrand",
    "images": [],
    "isActive": true,
    "isFeatured": false
  }
}
```

**Fehler-Responses:**
- `404` - Produkt nicht gefunden

## Fehlerbehandlung

### Standard-Fehlerformat
```json
{
  "message": "Fehlerbeschreibung",
  "error": "Detaillierte Fehlermeldung (nur in Entwicklung)"
}
```

### HTTP-Statuscodes
- `200` - OK
- `201` - Erstellt
- `400` - Ungültige Anfrage
- `401` - Nicht autorisiert
- `404` - Nicht gefunden
- `409` - Konflikt
- `429` - Zu viele Anfragen
- `500` - Interner Serverfehler

## Rate Limiting
Die API ist auf 100 Anfragen pro 15 Minuten pro IP-Adresse begrenzt.

## CORS
Die API unterstützt Cross-Origin Resource Sharing (CORS). Die erlaubten Ursprünge können über die Umgebungsvariable `ALLOWED_ORIGINS` konfiguriert werden.