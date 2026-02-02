use axum::{
    extract::{Path, State},
    Json,
};
use uuid::Uuid;
use validator::Validate;
use crate::{
    routes::state::AppState,
    models::{
        staff::{Staff, CreateStaffRequest},
        api_response::ApiResponse,
    },
    db::staff_repo,
    errors::app::AppError,
};

/// Create a new staff member
#[utoipa::path(
    post,
    path = "/api/v1/staff",
    tag = "Staff",
    request_body = CreateStaffRequest,
    responses(
        (status = 200, description = "Staff created", body = ApiResponse<Staff>)
    )
)]
pub async fn create_staff_handler(
    State(state): State<AppState>,
    Json(payload): Json<CreateStaffRequest>,
) -> Result<Json<ApiResponse<Staff>>, AppError> {
    if let Err(e) = payload.validate() {
        return Err(AppError::BadRequest(e.to_string()));
    }

    let staff = staff_repo::create_staff(&state.db, payload).await?;
    Ok(Json(ApiResponse::success(staff, Some("Staff member created".to_string()))))
}

/// Get all staff for a hospital
#[utoipa::path(
    get,
    path = "/api/v1/hospitals/{id}/staff",
    tag = "Staff",
    params(
        ("id" = Uuid, Path, description = "Hospital UUID")
    ),
    responses(
        (status = 200, description = "List of staff", body = ApiResponse<Vec<Staff>>)
    )
)]
pub async fn get_hospital_staff(
    State(state): State<AppState>,
    Path(hospital_id): Path<Uuid>,
) -> Result<Json<ApiResponse<Vec<Staff>>>, AppError> {
    let staff = staff_repo::get_staff_by_hospital(&state.db, hospital_id).await?;
    Ok(Json(ApiResponse::success(staff, None)))
}