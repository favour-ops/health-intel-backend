use axum::{
    routing::get,
    Router,
    http::Method, // Import Method
};
use tower_http::cors::{Any, CorsLayer}; // Import CorsLayer
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use crate::docs::ApiDoc;
use super::{
    health::health_check,
    hospitals::{create_hospital_handler, get_hospitals, get_hospital_by_id},
    state::AppState,
};

pub fn create_router() -> Router<AppState> {
    // Define the CORS layer
    let cors = CorsLayer::new()
        // Allow GET and POST requests
        .allow_methods([Method::GET, Method::POST])
        // Allow requests from any source (for development simplicity)
        .allow_origin(Any)
        .allow_headers(Any);

    Router::new()
        .route("/api/v1/health", get(health_check))
        .route("/api/v1/hospitals", get(get_hospitals).post(create_hospital_handler))
        .route("/api/v1/hospitals/:id", get(get_hospital_by_id))
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .layer(cors) // <--- Add the layer here!
}