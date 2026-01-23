use axum::{routing::get, Router};
use super::{
    health::health_check,
    hospitals::{get_hospitals, get_hospital_by_id},
    state::AppState,
};

pub fn create_router() -> Router<AppState> {
    Router::new()
        .route("/api/v1/health", get(health_check))
        .route("/api/v1/hospitals", get(get_hospitals))
        .route("/api/v1/hospitals/:id", get(get_hospital_by_id))
}
