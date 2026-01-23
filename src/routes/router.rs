use axum::{
    routing::{get, post},
    Router
};
use utoipa::OpenApi; // Import OpenApi
use utoipa_swagger_ui::SwaggerUi; // Import SwaggerUi

use crate::docs::ApiDoc; // Import your doc struct
use super::{
    health::health_check,
    hospitals::{create_hospital_handler, get_hospitals, get_hospital_by_id},
    state::AppState,
};

pub fn create_router() -> Router<AppState> {
    Router::new()
        // Standard API Routes
        .route("/api/v1/health", get(health_check))
        .route("/api/v1/hospitals", get(get_hospitals).post(create_hospital_handler))
        .route("/api/v1/hospitals/:id", get(get_hospital_by_id))
        
        // Swagger UI Route
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
}