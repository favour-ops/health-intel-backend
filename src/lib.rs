pub mod config;
pub mod db;
pub mod models;
pub mod routes;
pub mod middleware;
pub mod ws;
pub mod errors;
pub mod docs; 

use sqlx::PgPool;
use axum::Router;
use tower_http::trace::TraceLayer;
use config::Settings;
use db::create_pool;
use routes::{create_router, AppState};

pub async fn setup_app() -> (Router, PgPool) {
    dotenvy::dotenv().ok();

    // 1. Load Config
    let settings = Settings::from_env().expect("Failed to load configuration");
    
    // 2. Connect to DB
    let db_pool = create_pool(&settings.database_url).await;
    
    // 3. Create AppState (With JWT Secret!)
    let app_state = AppState { 
        db: db_pool.clone(),
        jwt_secret: settings.jwt_secret.clone(), // <--- Added this line
    };

    // 4. Build Router
    let app = create_router()
        .layer(TraceLayer::new_for_http())
        .with_state(app_state);
        
    (app, db_pool)
}