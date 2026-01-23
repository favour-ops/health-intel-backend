use axum::{extract::State, Json, http::StatusCode};
use serde::Serialize;
use std::time::{SystemTime, UNIX_EPOCH};
use crate::routes::state::AppState;

#[derive(Serialize)]
pub struct HealthResponse {
    status: String,
    service: String,
    database: String, // <-- New field
    timestamp: u64,
}

pub async fn health_check(
    State(state): State<AppState>, // <-- Inject state to access DB
) -> (StatusCode, Json<HealthResponse>) {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();

    // 1. Check Database Connection
    let db_status = match sqlx::query("SELECT 1").execute(&state.db).await {
        Ok(_) => "connected",
        Err(_) => "disconnected",
    };

    // 2. Determine overall status code
    let status_code = if db_status == "connected" {
        StatusCode::OK
    } else {
        StatusCode::SERVICE_UNAVAILABLE
    };

    let response = HealthResponse {
        status: if status_code == StatusCode::OK { "ok".into() } else { "error".into() },
        service: "health-intel-backend".to_string(),
        database: db_status.to_string(),
        timestamp: now,
    };

    (status_code, Json(response))
}