use axum::{
    extract::{Query, State},
    Json,
};
use serde::Deserialize;
use uuid::Uuid;
use validator::Validate;
use crate::{
    routes::state::AppState,
    models::{
        patient::{Patient, CreatePatientRequest},
        api_response::ApiResponse,
    },
    db::patient_repo,
    errors::app::AppError,
};

#[derive(Deserialize)]
pub struct PatientQuery {
    pub hospital_id: Option<Uuid>,
}

#[utoipa::path(
    post,
    path = "/api/v1/patients",
    tag = "Patients",
    request_body = CreatePatientRequest,
    responses(
        (status = 200, description = "Patient created", body = ApiResponse<Patient>)
    )
)]
pub async fn create_patient_handler(
    State(state): State<AppState>,
    Json(payload): Json<CreatePatientRequest>,
) -> Result<Json<ApiResponse<Patient>>, AppError> {
    if let Err(e) = payload.validate() {
        return Err(AppError::BadRequest(e.to_string()));
    }

    let patient = patient_repo::create_patient(&state.db, payload).await?;
    Ok(Json(ApiResponse::success(patient, Some("Patient created successfully".to_string()))))
}

#[utoipa::path(
    get,
    path = "/api/v1/patients",
    tag = "Patients",
    params(
        ("hospital_id" = Option<Uuid>, Query, description = "Filter by Hospital ID")
    ),
    responses(
        (status = 200, description = "List of patients", body = ApiResponse<Vec<Patient>>)
    )
)]
pub async fn get_patients_handler(
    State(state): State<AppState>,
    Query(params): Query<PatientQuery>,
) -> Result<Json<ApiResponse<Vec<Patient>>>, AppError> {
    let patients = patient_repo::get_patients(&state.db, params.hospital_id).await?;
    Ok(Json(ApiResponse::success(patients, None)))
}