use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use health_intel_backend::{config::Settings, setup_app}; // Import setup_app from lib
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    // Initialize Logging
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "health_intel_backend=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Use our new helper function from lib.rs
    let (app, _) = setup_app().await;

    // Load settings just for the port info
    let settings = Settings::from_env().expect("Failed to load settings");
    let addr = format!("{}:{}", settings.host, settings.port);

    let listener = TcpListener::bind(&addr)
        .await
        .expect("Failed to bind address");

    tracing::info!("🚀 Server running on http://{}", addr);

    axum::serve(listener, app)
        .await
        .expect("Server failed");
}