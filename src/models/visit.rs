use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use utoipa::ToSchema;
use validator::Validate;

#[derive(Debug, Serialize, FromRow, ToSchema)]
pub struct Visit {
    pub id: Uuid,
    pub hospital_id: Uuid,
    pub patient_id: Uuid,
    pub staff_id: Uuid,
    pub reason: String,
    pub status: String,
    pub start_time: DateTime<Utc>,
    pub end_time: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Validate, ToSchema)]
pub struct CreateVisitRequest {
    pub hospital_id: Uuid,
    pub patient_id: Uuid,
    pub staff_id: Uuid, // The Doctor ID
    #[validate(length(min = 3, message = "Reason must be at least 3 characters"))]
    pub reason: String,
    // Optional: User can specify a start time (for appointments), otherwise defaults to NOW
    pub start_time: Option<DateTime<Utc>>,
}