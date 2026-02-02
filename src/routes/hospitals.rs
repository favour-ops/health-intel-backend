use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use uuid::Uuid;

use crate::db::hospital_repo;
use crate::models::{api_response::ApiResponse, hospital::CreateHospitalRequest};
use crate::routes::state::AppState;

/// Create a new hospital
#[utoipa::path(
    post,
    path = "/api/v1/hospitals",
    tag = "hospitals",
    request_body = CreateHospitalRequest,
    responses(
        (status = 201, description = "Hospital created successfully", body = inline(ApiResponse<crate::models::Hospital>))
    )
)]
pub async fn create_hospital_handler(
    State(state): State<AppState>, // <--- 2. Accept AppState, not PgPool
    Json(payload): Json<CreateHospitalRequest>,
) -> Result<Json<ApiResponse<crate::models::Hospital>>, (StatusCode, Json<ApiResponse<()>>)> {
    // 3. Access the DB pool via state.db
    let hospital = hospital_repo::create_hospital(&state.db, payload)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::error(&e.to_string())),
            )
        })?;

    Ok(Json(ApiResponse::success(hospital, Some("Hospital created successfully".to_string()))))
}

/// Get all hospitals
#[utoipa::path(
    get,
    path = "/api/v1/hospitals",
    tag = "hospitals",
    responses(
        (status = 200, description = "List of all hospitals", body = inline(ApiResponse<Vec<crate::models::Hospital>>))
    )
)]
pub async fn get_hospitals(
    State(state): State<AppState>, // <--- Change here
) -> Result<Json<ApiResponse<Vec<crate::models::Hospital>>>, (StatusCode, Json<ApiResponse<()>>)> {
    let hospitals = hospital_repo::fetch_all_hospitals(&state.db) // <--- Change here
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::error(&e.to_string())),
            )
        })?;

    Ok(Json(ApiResponse::success(hospitals, None)))
}

/// Get hospital by ID
#[utoipa::path(
    get,
    path = "/api/v1/hospitals/{id}",
    tag = "hospitals",
    params(
        ("id" = Uuid, Path, description = "Hospital ID")
    ),
    responses(
        (status = 200, description = "Hospital details", body = inline(ApiResponse<crate::models::Hospital>)),
        (status = 404, description = "Hospital not found")
    )
)]
pub async fn get_hospital_by_id(
    State(state): State<AppState>, // <--- Change here
    Path(id): Path<Uuid>,
) -> Result<Json<ApiResponse<crate::models::Hospital>>, (StatusCode, Json<ApiResponse<()>>)> {
    let hospital = hospital_repo::fetch_hospital_by_id(&state.db, id) // <--- Change here
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::error(&e.to_string())),
            )
        })?;

    match hospital {
        Some(h) => Ok(Json(ApiResponse::success(h, None))),
        None => Err((
            StatusCode::NOT_FOUND,
            Json(ApiResponse::error("Hospital not found")),
        )),
    }
}

/// Update a hospital
#[utoipa::path(
    put,
    path = "/api/v1/hospitals/{id}",
    tag = "hospitals",
    params(
        ("id" = Uuid, Path, description = "Hospital ID")
    ),
    request_body = CreateHospitalRequest,
    responses(
        (status = 200, description = "Hospital updated successfully", body = inline(ApiResponse<crate::models::Hospital>)),
        (status = 404, description = "Hospital not found")
    )
)]
pub async fn update_hospital_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(payload): Json<CreateHospitalRequest>,
) -> Result<Json<ApiResponse<crate::models::Hospital>>, (StatusCode, Json<ApiResponse<()>>)> {
    
    let hospital = hospital_repo::update_hospital(&state.db, id, payload)
        .await
        .map_err(|e| {
            // Check if error is "RowNotFound"
            match e {
                sqlx::Error::RowNotFound => (
                    StatusCode::NOT_FOUND,
                    Json(ApiResponse::error("Hospital not found")),
                ),
                _ => (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(ApiResponse::error(&e.to_string())),
                )
            }
        })?;

    Ok(Json(ApiResponse::success(hospital, Some("Hospital updated successfully".to_string()))))
}

/// Delete a hospital
#[utoipa::path(
    delete,
    path = "/api/v1/hospitals/{id}",
    tag = "hospitals",
    params(
        ("id" = Uuid, Path, description = "Hospital ID")
    ),
    responses(
        (status = 200, description = "Hospital deleted successfully"),
        (status = 404, description = "Hospital not found")
    )
)]
pub async fn delete_hospital(
    State(state): State<AppState>, // <--- Change here
    Path(id): Path<Uuid>,
) -> Result<Json<ApiResponse<()>>, (StatusCode, Json<ApiResponse<()>>)> {
    
    let rows_deleted = hospital_repo::delete_hospital(&state.db, id) // <--- Change here
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::error(&e.to_string())),
            )
        })?;

    if rows_deleted == 0 {
        return Err((
            StatusCode::NOT_FOUND,
            Json(ApiResponse::error("Hospital not found")),
        ));
    }

    Ok(Json(ApiResponse::success((), Some("Hospital deleted successfully".to_string()))))
}