use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{NaiveDate, DateTime, Utc};
use utoipa::ToSchema;
use validator::Validate;

#[derive(Debug, Serialize, FromRow, ToSchema)]
pub struct Patient {
    pub id: Uuid,
    pub hospital_id: Option<Uuid>,
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: NaiveDate,
    pub gender: String,
    pub contact_phone: Option<String>,
    pub emergency_contact: Option<String>,
    pub address: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct CreatePatientRequest {
    pub hospital_id: Option<Uuid>,
    #[validate(length(min = 2))]
    pub first_name: String,
    #[validate(length(min = 2))]
    pub last_name: String,
    pub date_of_birth: NaiveDate, // Format: YYYY-MM-DD
    #[validate(custom(function = "validate_gender"))]
    pub gender: String,
    pub contact_phone: Option<String>,
    pub emergency_contact: Option<String>,
    pub address: Option<String>,
}

fn validate_gender(gender: &str) -> Result<(), validator::ValidationError> {
    match gender {
        "MALE" | "FEMALE" | "OTHER" => Ok(()),
        _ => Err(validator::ValidationError::new("Invalid gender")),
    }
}