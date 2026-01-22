use axum::{extract::State, Json};

use crate::{
    db::hospital_repo::fetch_all_hospitals,
    models::{
        api_response::ApiResponse,
        hospital_response::HospitalsResponse,
    },
    routes::state::AppState,
};

pub async fn get_hospitals(
    State(state): State<AppState>,
) -> Json<ApiResponse<HospitalsResponse>> {
    let hospitals = fetch_all_hospitals(&state.db)
        .await
        .expect("Failed to fetch hospitals");

    let count = hospitals.len();

    let response = ApiResponse::success(
        HospitalsResponse { hospitals },
        Some(count),
    );

    Json(response)
}
