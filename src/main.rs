use tracing_subscriber;
use health_intel_backend::{
    config::Settings,
    db::create_pool,
    routes::{create_router, AppState},
};
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt::init();

    let settings = Settings::from_env();
    let db_pool = create_pool(&settings.database_url).await;

    let app_state = AppState { db: db_pool };

    // ✅ router is Router<AppState>
    let app = create_router().with_state(app_state);

    let listener = TcpListener::bind("127.0.0.1:3000")
        .await
        .expect("Failed to bind address");

    tracing::info!("Server running on http://127.0.0.1:3000");

    axum::serve(listener, app)
        .await
        .expect("Server failed");
}
