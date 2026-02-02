use axum::{
    extract::{Path, State},
    Json,
};
use uuid::Uuid;
use validator::Validate;
use crate::{
    routes::state::AppState,
    models::{
        visit::{Visit, CreateVisitRequest},
        api_response::ApiResponse,
    },
    db::visit_repo,
    errors::app::AppError,
};

/// Create a new visit (appointment)
#[utoipa::path(
    post,
    path = "/api/v1/visits",
    tag = "Visits",
    request_body = CreateVisitRequest,
    responses(
        (status = 200, description = "Visit created", body = ApiResponse<Visit>)
    )
)]
pub async fn create_visit_handler(
    State(state): State<AppState>,
    Json(payload): Json<CreateVisitRequest>,
) -> Result<Json<ApiResponse<Visit>>, AppError> {
    if let Err(e) = payload.validate() {
        return Err(AppError::BadRequest(e.to_string()));
    }

    let visit = visit_repo::create_visit(&state.db, payload).await?;
    Ok(Json(ApiResponse::success(visit, Some("Visit scheduled successfully".to_string()))))
}

/// Get visits for a hospital
#[utoipa::path(
    get,
    path = "/api/v1/hospitals/{id}/visits",
    tag = "Visits",
    params(
        ("id" = Uuid, Path, description = "Hospital UUID")
    ),
    responses(
        (status = 200, description = "List of visits", body = ApiResponse<Vec<Visit>>)
    )
)]
pub async fn get_hospital_visits(
    State(state): State<AppState>,
    Path(hospital_id): Path<Uuid>,
) -> Result<Json<ApiResponse<Vec<Visit>>>, AppError> {
    let visits = visit_repo::get_hospital_visits(&state.db, hospital_id).await?;
    Ok(Json(ApiResponse::success(visits, None)))
}