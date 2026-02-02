use axum::{
    extract::{Path, State},
    Json,
};
use uuid::Uuid;
use validator::Validate;
use crate::{
    routes::state::AppState,
    models::{
        department::{Department, CreateDepartmentRequest},
        api_response::ApiResponse,
    },
    db::department_repo,
    errors::app::AppError,
};

#[utoipa::path(
    post,
    path = "/api/v1/departments",
    request_body = CreateDepartmentRequest,
    responses(
        (status = 200, description = "Department created", body = ApiResponse<Department>)
    )
)]
pub async fn create_department_handler(
    State(state): State<AppState>,
    Json(payload): Json<CreateDepartmentRequest>,
) -> Result<Json<ApiResponse<Department>>, AppError> {
    if let Err(e) = payload.validate() {
        return Err(AppError::BadRequest(e.to_string()));
    }

    let department = department_repo::create_department(&state.db, payload).await?;
    Ok(Json(ApiResponse::success(department, Some("Department created".to_string()))))
}

#[utoipa::path(
    get,
    path = "/api/v1/hospitals/{id}/departments",
    params(
        ("id" = Uuid, Path, description = "Hospital UUID")
    ),
    responses(
        (status = 200, description = "List of departments", body = ApiResponse<Vec<Department>>)
    )
)]
pub async fn get_hospital_departments(
    State(state): State<AppState>,
    Path(hospital_id): Path<Uuid>,
) -> Result<Json<ApiResponse<Vec<Department>>>, AppError> {
    let departments = department_repo::get_departments_by_hospital(&state.db, hospital_id).await?;
    Ok(Json(ApiResponse::success(departments, None)))
}