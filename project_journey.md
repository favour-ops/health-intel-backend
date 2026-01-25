# Health Intel - Technical Journey & Challenges

## 1. Swagger UI & Generic Types (Rust)
**The Challenge:**
After creating a generic `ApiResponse<T>` wrapper for our JSON responses, Swagger UI crashed with a `Could not resolve pointer` error. It couldn't understand the generic type `T` in the schema.

**The Fix:**
We used the `inline(...)` macro in our `utoipa` attributes. This forces the documentation generator to define the schema right inside the endpoint definition rather than trying to create a shared reference for a generic type.
```rust
// Before: body = ApiResponse<HospitalsResponse>
// After:  body = inline(ApiResponse<HospitalsResponse>)

2. Leaflet & Server-Side Rendering (Next.js)
The Challenge: When trying to load the Map, the app crashed with ReferenceError: window is not defined. This happened because Next.js tries to render pages on the server first, but the Leaflet map library relies on the browser's window object (which doesn't exist on the server).

The Fix: We used Next.js Dynamic Imports to disable Server-Side Rendering (SSR) specifically for the Map component.

TypeScript

const Map = dynamic(() => import("../components/Map"), { ssr: false });
3. The "Map Container Reused" Crash
The Challenge: The map would crash with Error: Map container is already initialized. This is caused by React's Strict Mode, which mounts components twice in development to check for bugs. Leaflet tries to initialize the map twice on the same DOM element, causing a collision.

The Fix: We disabled Strict Mode in next.config.ts:

TypeScript

const nextConfig: NextConfig = {
  reactStrictMode: false,
};
4. Linux File Watcher Limit
The Challenge: The Next.js server crashed immediately on startup with OS file watch limit reached. This is a common Linux issue where the OS limits how many files a program can monitor for changes.

The Fix: We increased the system limit using the terminal:

Bash

sudo sysctl fs.inotify.max_user_watches=524288
5. CORS (Connecting Frontend to Backend)
The Challenge: The frontend (port 3001) could not fetch data from the backend (port 3000) due to browser security rules (Cross-Origin Resource Sharing).

The Fix: We added the tower-http crate to the Rust backend and configured the router to permit requests from the frontend.

Rust

let cors = CorsLayer::new().allow_origin(Any).allow_methods([Method::GET, Method::POST]);
6. Data Mismatch (Missing Markers)
The Challenge: The map was working, but no markers appeared, even though the data was fetching correctly.

Cause: The database returned columns named latitude / longitude.

Frontend Expectation: The mock data used lat / lng.

The Fix: We updated the Map component to handle both naming conventions gracefully:

TypeScript

const lat = hospital.latitude || hospital.lat;
const lng = hospital.longitude || hospital.lng;
7. PostgreSQL Authentication
The Challenge: We couldn't log in to the database CLI using the default postgres user, getting FATAL: password authentication failed.

The Fix: We checked the .env file and realized the app was configured to use a specific user (health_admin) and database (health_intel_mvp). Logging in with these correct credentials allowed us to run the SQL updates.


### 3. Git Commands to Push
Run these in your terminal (make sure you are in the root folder):

```bash
git add .
git commit -m "feat: complete MVP - integrate rust backend with next.js map frontend"
git push origin main