use axum::{
    routing::{get, post},
    Router,
    http::Method, 
};
use tower_http::cors::{Any, CorsLayer};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use crate::docs::ApiDoc;
use super::{
    health::health_check,
    hospitals::{create_hospital_handler, get_hospitals, get_hospital_by_id, delete_hospital, update_hospital_handler},
    auth::login_handler,
    state::AppState,
};

pub fn create_router() -> Router<AppState> {
    // Define the CORS layer
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::DELETE, Method::PUT]) 
        .allow_origin(Any)
        .allow_headers(Any);

    Router::new()
        .route("/api/v1/health", get(health_check))
        .route("/api/v1/login", post(login_handler))
        .route("/api/v1/hospitals", get(get_hospitals).post(create_hospital_handler))
        .route(
            "/api/v1/hospitals/:id", 
            get(get_hospital_by_id)
            .delete(delete_hospital)
            .put(update_hospital_handler)
        )
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .layer(cors)
}