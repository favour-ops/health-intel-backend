use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use utoipa::ToSchema;
use validator::Validate;

#[derive(Debug, Serialize, FromRow, ToSchema)]
pub struct Staff {
    pub id: Uuid,
    pub hospital_id: Uuid,
    pub department_id: Uuid,
    pub first_name: String,
    pub last_name: String,
    pub role: String,
    pub email: Option<String>,
    pub contact_phone: Option<String>,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct CreateStaffRequest {
    pub hospital_id: Uuid,
    pub department_id: Uuid,
    #[validate(length(min = 2, message = "First name must be at least 2 characters"))]
    pub first_name: String,
    #[validate(length(min = 2, message = "Last name must be at least 2 characters"))]
    pub last_name: String,
    #[validate(custom(function = "validate_staff_role"))]
    pub role: String,
    #[validate(email(message = "Invalid email format"))]
    pub email: Option<String>,
    pub contact_phone: Option<String>,
}

fn validate_staff_role(role: &str) -> Result<(), validator::ValidationError> {
    match role {
        "DOCTOR" | "NURSE" | "ADMIN" | "SUPPORT" => Ok(()),
        _ => Err(validator::ValidationError::new("Invalid staff role")),
    }
}