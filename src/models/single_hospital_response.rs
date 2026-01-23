use serde::Serialize;
use crate::models::hospital::Hospital;
use utoipa::ToSchema; // Import ToSchema

#[derive(Debug, Serialize, ToSchema)] // Add ToSchema
pub struct SingleHospitalResponse {
    pub hospital: Hospital,
}