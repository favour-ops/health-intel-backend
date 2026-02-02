use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use utoipa::ToSchema;
use validator::Validate;

#[derive(Debug, Serialize, FromRow, ToSchema)]
pub struct Department {
    pub id: Uuid,
    pub hospital_id: Uuid,
    pub name: String,
    pub department_type: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct CreateDepartmentRequest {
    pub hospital_id: Uuid,
    #[validate(length(min = 2, message = "Name must be at least 2 characters"))]
    pub name: String,
    #[validate(custom(function = "validate_dept_type"))]
    pub department_type: String,
}

fn validate_dept_type(dept_type: &str) -> Result<(), validator::ValidationError> {
    match dept_type {
        "MEDICAL" | "ADMIN" | "SUPPORT" => Ok(()),
        _ => Err(validator::ValidationError::new("Invalid department type")),
    }
}