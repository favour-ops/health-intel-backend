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
    departments::{create_department_handler, get_hospital_departments},
    staff::{create_staff_handler, get_hospital_staff},
    patients::{create_patient_handler, get_patients_handler},
    visits::{create_visit_handler, get_hospital_visits},
    equipment::{create_equipment_handler, get_hospital_equipment},
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
        .route("/api/v1/departments", post(create_department_handler))
        .route("/api/v1/hospitals/:id/departments", get(get_hospital_departments))
        .route("/api/v1/staff", post(create_staff_handler))
        .route("/api/v1/hospitals/:id/staff", get(get_hospital_staff))
        .route("/api/v1/patients", get(get_patients_handler).post(create_patient_handler))
        .route("/api/v1/visits", post(create_visit_handler))
        .route("/api/v1/hospitals/:id/visits", get(get_hospital_visits))
        .route("/api/v1/equipment", post(create_equipment_handler))
        .route("/api/v1/hospitals/:id/equipment", get(get_hospital_equipment))
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .layer(cors)
}