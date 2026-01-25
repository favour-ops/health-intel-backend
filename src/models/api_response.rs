use serde::Serialize;
use utoipa::ToSchema;

use crate::models::{
    hospital_response::HospitalsResponse,
    single_hospital_response::SingleHospitalResponse,
};

#[derive(Debug, Serialize, ToSchema)]
pub struct Meta {
    pub count: Option<u32>,
    pub message: Option<String>,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct ApiResponse<T> {
    pub status: String,
    pub data: Option<T>,
    pub meta: Meta,
}

// Type aliases for concrete API responses
pub type HospitalListResponse = ApiResponse<HospitalsResponse>;
pub type HospitalSingleResponse = ApiResponse<SingleHospitalResponse>;

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