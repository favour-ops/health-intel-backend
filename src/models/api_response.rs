use serde::Serialize;
use utoipa::ToSchema;

// 1. Import the concrete types we want to use with ApiResponse
use crate::models::{
    hospital_response::HospitalsResponse,
    single_hospital_response::SingleHospitalResponse,
};

#[derive(Debug, Serialize, ToSchema)]
pub struct Meta {
    pub count: Option<u32>,
    pub message: Option<String>,
}

// 2. Define Aliases here so Swagger knows how to swap "T" for real types
#[derive(Debug, Serialize, ToSchema)]
#[aliases(
    // When code uses ApiResponse<HospitalsResponse>, Swagger generates "HospitalListResponse"
    HospitalListResponse = ApiResponse<HospitalsResponse>,
    // When code uses ApiResponse<SingleHospitalResponse>, Swagger generates "HospitalSingleResponse"
    HospitalSingleResponse = ApiResponse<SingleHospitalResponse>
)]
pub struct ApiResponse<T> {
    pub status: String,
    pub data: Option<T>,
    pub meta: Meta,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T, message: Option<String>) -> Self {
        Self {
            status: "success".to_string(),
            data: Some(data),
            meta: Meta {
                count: None,
                message,
            },
        }
    }

    pub fn error(message: &str) -> Self {
        Self {
            status: "error".to_string(),
            data: None,
            meta: Meta {
                count: None,
                message: Some(message.to_string()),
            },
        }
    }
}