use health_intel_backend::setup_app;
use tokio::net::TcpListener;
use reqwest::Client;
use serde_json::json;

// Helper to spawn app (same as before)
async fn spawn_app() -> String {
    let (app, _) = setup_app().await;
    let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
    let port = listener.local_addr().unwrap().port();
    tokio::spawn(async move { axum::serve(listener, app).await.unwrap(); });
    format!("http://127.0.0.1:{}", port)
}

#[tokio::test]
async fn create_hospital_returns_200_for_valid_data() {
    let app_address = spawn_app().await;
    let client = Client::new();

    // Use a random name so we don't hit "Already Exists" errors from previous runs
    let hospital_name = format!("Test Hospital {}", uuid::Uuid::new_v4());

    let response = client
        .post(format!("{}/api/v1/hospitals", app_address))
        .json(&json!({
            "name": hospital_name,
            "hospital_type": "PUBLIC",
            "state": "Lagos",
            "city": "Ikeja"
        }))
        .send()
        .await
        .expect("Failed to execute request");

    assert_eq!(response.status().as_u16(), 200);
}

#[tokio::test]
async fn create_hospital_returns_409_for_duplicate_data() {
    let app_address = spawn_app().await;
    let client = Client::new();
    let hospital_name = format!("Duplicate Hospital {}", uuid::Uuid::new_v4());

    // 1. Create the first one (Should Succeed)
    let _ = client
        .post(format!("{}/api/v1/hospitals", app_address))
        .json(&json!({
            "name": hospital_name,
            "hospital_type": "PRIVATE",
            "state": "Kano",
            "city": "Kano"
        }))
        .send()
        .await;

    // 2. Create the exact same one again (Should Fail)
    let response = client
        .post(format!("{}/api/v1/hospitals", app_address))
        .json(&json!({
            "name": hospital_name,
            "hospital_type": "PRIVATE",
            "state": "Kano",
            "city": "Kano"
        }))
        .send()
        .await
        .expect("Failed to execute request");

    // 3. Assert Conflict
    assert_eq!(response.status().as_u16(), 409);
    
    let json: serde_json::Value = response.json().await.unwrap();
    assert_eq!(json["meta"]["message"], "This record already exists.");
}