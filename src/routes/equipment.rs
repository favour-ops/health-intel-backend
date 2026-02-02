use axum::{
    extract::{Path, State},
    Json,
};
use uuid::Uuid;
use validator::Validate;
use crate::{
    routes::state::AppState,
    models::{
        equipment::{Equipment, CreateEquipmentRequest},
        api_response::ApiResponse,
    },
    db::equipment_repo,
    errors::app::AppError,
};

#[utoipa::path(
    post,
    path = "/api/v1/equipment",
    tag = "Equipment",
    request_body = CreateEquipmentRequest,
    responses(
        (status = 200, description = "Equipment registered", body = ApiResponse<Equipment>)
    )
)]
pub async fn create_equipment_handler(
    State(state): State<AppState>,
    Json(payload): Json<CreateEquipmentRequest>,
) -> Result<Json<ApiResponse<Equipment>>, AppError> {
    if let Err(e) = payload.validate() {
        return Err(AppError::BadRequest(e.to_string()));
    }

    let item = equipment_repo::create_equipment(&state.db, payload).await?;
    Ok(Json(ApiResponse::success(item, Some("Equipment registered".to_string()))))
}

#[utoipa::path(
    get,
    path = "/api/v1/hospitals/{id}/equipment",
    tag = "Equipment",
    params(
        ("id" = Uuid, Path, description = "Hospital UUID")
    ),
    responses(
        (status = 200, description = "List of equipment", body = ApiResponse<Vec<Equipment>>)
    )
)]
pub async fn get_hospital_equipment(
    State(state): State<AppState>,
    Path(hospital_id): Path<Uuid>,
) -> Result<Json<ApiResponse<Vec<Equipment>>>, AppError> {
    let items = equipment_repo::get_hospital_equipment(&state.db, hospital_id).await?;
    Ok(Json(ApiResponse::success(items, None)))
}