use health_intel_backend::setup_app;
use tokio::net::TcpListener;
use reqwest::Client;

// Helper to spawn the app on a random port
async fn spawn_app() -> String {
    let (app, _) = setup_app().await;

    // Bind to port 0 (lets OS choose a random available port)
    let listener = TcpListener::bind("127.0.0.1:0")
        .await
        .expect("Failed to bind random port");

    let port = listener.local_addr().unwrap().port();
    
    tokio::spawn(async move {
        axum::serve(listener, app).await.unwrap();
    });

    format!("http://127.0.0.1:{}", port)
}

#[tokio::test]
async fn health_check_works() {
    // 1. Arrange
    let address = spawn_app().await;
    let client = Client::new();

    // 2. Act
    let response = client
        .get(format!("{}/api/v1/health", address))
        .send()
        .await
        .expect("Failed to execute request");

    // 3. Assert
    assert!(response.status().is_success());
    
    let text = response.text().await.unwrap();
    assert!(text.contains("health-intel-backend"));
    assert!(text.contains("connected")); // Ensures DB is reachable
}