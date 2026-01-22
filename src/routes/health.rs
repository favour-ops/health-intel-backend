use axum::{Json};
use serde::Serialize;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Serialize)]
pub struct HealthResponse {
    status: String,
    service: String,
    timestamp: u64,
}

pub async fn health_check() -> Json<HealthResponse> {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_secs();

    Json(HealthResponse {
        status: "ok".to_string(),
        service: "health-intel-backend".to_string(),
        timestamp: now,
    })
}
