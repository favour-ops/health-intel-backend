use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use utoipa::ToSchema;
use validator::Validate;

#[derive(Debug, Serialize, FromRow, ToSchema)]
pub struct Equipment {
    pub id: Uuid,
    pub hospital_id: Uuid,
    pub department_id: Option<Uuid>,
    pub name: String,
    pub serial_number: Option<String>,
    pub condition: String,
    pub is_operational: bool,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct CreateEquipmentRequest {
    pub hospital_id: Uuid,
    pub department_id: Option<Uuid>,
    #[validate(length(min = 2))]
    pub name: String,
    pub serial_number: Option<String>,
    #[validate(custom(function = "validate_condition"))]
    pub condition: String,
    pub is_operational: bool,
}

fn validate_condition(condition: &str) -> Result<(), validator::ValidationError> {
    match condition {
        "NEW" | "GOOD" | "FAIR" | "POOR" | "BROKEN" => Ok(()),
        _ => Err(validator::ValidationError::new("Invalid condition")),
    }
}