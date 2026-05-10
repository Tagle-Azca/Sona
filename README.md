# Sona — League of Legends Competitions Tracker (Frontend)

> ITESO — Bases de Datos No Relacionales · Equipo Lobo Dinamita Buena Onda

---

## Tech Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Grafo**: react-force-graph-2d
- **Íconos**: Flaticon Uicons (CDN)
- **Backend**: [Shaco](../shaco/) en `http://localhost:3000`

---

## Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo (hot reload en :5173)
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## Configuración

Copia el `.env` y ajusta la URL del backend si es necesario:

```env
VITE_API_URL=http://localhost:3000
```

> El frontend tiene fallback a datos mock si el backend no está disponible.

---

## Páginas

| Ruta | Descripción | Fuente de datos |
|---|---|---|
| `/` | Home con buscador y stats globales | — |
| `/player/:name` | Perfil del jugador con mains | MongoDB + Dgraph |
| `/champions` | Catálogo de campeones con filtros | MongoDB |
| `/champions/:id` | Detalle: stats, habilidades, sinergias y counters | MongoDB + Dgraph |
| `/pro` | Equipos y rosters por región | MongoDB + Dgraph |
| `/meta` | Pick/ban/win rate del parche vigente | Cassandra |
| `/tournaments` | Resultados de torneos | Cassandra |
| `/graph` | Grafo interactivo de todos los nodos Dgraph | Dgraph |

---

