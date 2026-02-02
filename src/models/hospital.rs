use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use validator::Validate;
use utoipa::ToSchema; // Import ToSchema

#[derive(Debug, Serialize, FromRow, Clone, ToSchema)] // Add ToSchema
pub struct Hospital {
    pub id: Uuid,
    pub name: String,
    pub hospital_type: String,
    pub state: String,
    pub city: String,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
    pub total_beds: Option<i32>,
    pub has_emergency: Option<bool>,
    pub occupied_beds: i32,
    pub has_oxygen: bool,
    pub has_ventilators: bool,
    pub has_ambulance: bool,
}

#[derive(Debug, Deserialize, Validate, ToSchema)] // Add ToSchema
pub struct CreateHospitalRequest {
    #[validate(length(min = 3, message = "Name must be at least 3 characters"))]
    pub name: String,

    #[validate(length(min = 1, message = "Hospital type is required"))]
    pub hospital_type: String,

    #[validate(length(min = 1, message = "State is required"))]
    pub state: String,

    #[validate(length(min = 1, message = "City is required"))]
    pub city: String,

    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
    pub total_beds: Option<i32>,
    pub has_emergency: Option<bool>,
    pub occupied_beds: Option<i32>,
    pub has_oxygen: Option<bool>,
    pub has_ventilators: Option<bool>,
    pub has_ambulance: Option<bool>,
}