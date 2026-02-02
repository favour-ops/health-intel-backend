use health_intel_backend::setup_app;
use tokio::net::TcpListener;
use reqwest::Client;
use serde_json::json;
use sqlx::PgPool;
use uuid::Uuid;
use bcrypt::{hash, DEFAULT_COST};

// Helper to spawn app and return address + db pool
async fn spawn_app() -> (String, PgPool) {
    let (app, pool) = setup_app().await;
    
    let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
    let port = listener.local_addr().unwrap().port();
    
    tokio::spawn(async move {
        axum::serve(listener, app).await.unwrap();
    });

    (format!("http://127.0.0.1:{}", port), pool)
}

#[tokio::test]
async fn login_returns_token_for_valid_credentials() {
    // 1. Arrange
    let (app_address, pool) = spawn_app().await;
    let client = Client::new();

    // Create a random user for this test
    let email = format!("test_user_{}@health.gov.ng", Uuid::new_v4());
    let password = "testpassword123";
    let password_hash = hash(password, DEFAULT_COST).unwrap();

    // Insert user directly into DB (bypassing API)
    sqlx::query!(
        "INSERT INTO admins (email, password_hash) VALUES ($1, $2)",
        email,
        password_hash
    )
    .execute(&pool)
    .await
    .expect("Failed to create test user");

    // 2. Act
    let response = client
        .post(format!("{}/api/v1/login", app_address))
        .json(&json!({
            "email": email,
            "password": password
        }))
        .send()
        .await
        .expect("Failed to execute request");

    // 3. Assert
    assert_eq!(response.status().as_u16(), 200);

    let json: serde_json::Value = response.json().await.unwrap();
    
    // Check structure
    assert_eq!(json["status"], "success");
    assert!(json["data"]["token"].is_string(), "Token should be a string");
    assert_eq!(json["data"]["user"]["email"], email);
}

#[tokio::test]
async fn login_returns_401_for_invalid_password() {
    // 1. Arrange
    let (app_address, pool) = spawn_app().await;
    let client = Client::new();

    // Create user
    let email = format!("test_fail_{}@health.gov.ng", Uuid::new_v4());
    let password_hash = hash("correct_password", DEFAULT_COST).unwrap();

    sqlx::query!(
        "INSERT INTO admins (email, password_hash) VALUES ($1, $2)",
        email,
        password_hash
    )
    .execute(&pool)
    .await
    .expect("Failed to create test user");

    // 2. Act (Try logging in with WRONG password)
    let response = client
        .post(format!("{}/api/v1/login", app_address))
        .json(&json!({
            "email": email,
            "password": "wrong_password"
        }))
        .send()
        .await
        .expect("Failed to execute request");

    // 3. Assert
    assert_eq!(response.status().as_u16(), 401);
}