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
}