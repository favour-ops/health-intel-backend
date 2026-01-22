use axum::{routing::get, Router};
use super::{
    health::health_check,
    hospitals::get_hospitals,
    state::AppState,
};

pub fn create_router(state: AppState) -> Router {
    Router::new()
        .route("/api/v1/health", get(health_check))
        .route("/api/v1/hospitals", get(get_hospitals))
        .with_state(state)
}
