use axum::{
    extract::{Path, State},
    Json,
};
use uuid::Uuid;
use validator::Validate;

use crate::{
    db::hospital_repo::{create_hospital, fetch_all_hospitals, fetch_hospital_by_id},
    errors::app::AppError,
    models::{
        api_response::{ApiResponse, HospitalListResponse, HospitalSingleResponse},
        hospital::CreateHospitalRequest,
        hospital_response::HospitalsResponse,
        single_hospital_response::SingleHospitalResponse,
    },
    routes::state::AppState,
};

/// List all hospitals
#[utoipa::path(
    get,
    path = "/api/v1/hospitals",
    tag = "Hospitals",
    responses(
        (status = 200, description = "List of all hospitals", body = HospitalListResponse)
    )
)]
pub async fn get_hospitals(
    State(state): State<AppState>,
) -> Result<Json<HospitalListResponse>, AppError> {
    let hospitals = fetch_all_hospitals(&state.db).await?;
    
    Ok(Json(HospitalListResponse(ApiResponse::success(
        HospitalsResponse { hospitals },
        None,
    ))))
}

/// Get a single hospital by ID
#[utoipa::path(
    get,
    path = "/api/v1/hospitals/{id}",
    tag = "Hospitals",
    params(
        ("id" = Uuid, Path, description = "Hospital UUID")
    ),
    responses(
        (status = 200, description = "Hospital details", body = HospitalSingleResponse),
        (status = 404, description = "Hospital not found")
    )
)]
pub async fn get_hospital_by_id(
    Path(id): Path<Uuid>,
    State(state): State<AppState>,
) -> Result<Json<HospitalSingleResponse>, AppError> {
    let hospital = fetch_hospital_by_id(&state.db, id).await?; 
    let hospital = hospital.ok_or(AppError::NotFound)?; 

    Ok(Json(HospitalSingleResponse(ApiResponse::success(
        SingleHospitalResponse { hospital },
        None,
    ))))
}

/// Create a new hospital
#[utoipa::path(
    post,
    path = "/api/v1/hospitals",
    tag = "Hospitals",
    request_body = CreateHospitalRequest,
    responses(
        (status = 200, description = "Hospital created successfully", body = HospitalSingleResponse),
        (status = 400, description = "Invalid input data"),
        (status = 409, description = "Hospital with this name already exists")
    )
)]
pub async fn create_hospital_handler(
    State(state): State<AppState>,
    Json(payload): Json<CreateHospitalRequest>,
) -> Result<Json<HospitalSingleResponse>, AppError> {
    if let Err(validation_errors) = payload.validate() {
        return Err(AppError::BadRequest(validation_errors.to_string()));
    }

    let hospital = create_hospital(&state.db, payload).await?;

    Ok(Json(HospitalSingleResponse(ApiResponse::success(
        SingleHospitalResponse { hospital },
        None,
    ))))
}