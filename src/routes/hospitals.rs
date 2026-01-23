use axum::{
    extract::{Path, State},
    Json,
};
use uuid::Uuid;

use crate::{
    db::hospital_repo::{fetch_all_hospitals, fetch_hospital_by_id},
    errors::app::AppError,
    models::{
        ApiResponse,
        hospital_response::HospitalsResponse,
        single_hospital_response::SingleHospitalResponse,
    },
    routes::state::AppState,
};

/// GET /api/v1/hospitals
pub async fn get_hospitals(
    State(state): State<AppState>,
) -> Result<Json<ApiResponse<HospitalsResponse>>, AppError> {
    let hospitals = fetch_all_hospitals(&state.db)
    .await?; // ✅ no panic
    .map_err(|_| AppError::Database)?;
    
    Ok(Json(ApiResponse::success(
        HospitalsResponse { hospitals },
        None,
    )))
}

/// GET /api/v1/hospitals/:id
pub async fn get_hospital_by_id(
    Path(id): Path<Uuid>,
    State(state): State<AppState>,
) -> Result<Json<ApiResponse<SingleHospitalResponse>>, AppError> {
    let hospital = fetch_hospital_by_id(&state.db, id).await?; // ✅ propagate DB error

    let hospital = hospital.ok_or(AppError::NotFound)?; // ✅ business error

    Ok(Json(ApiResponse::success(
        SingleHospitalResponse { hospital },
        None,
    )))
}
