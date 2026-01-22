use serde::Serialize;
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, FromRow, Clone)]
pub struct Hospital {
    pub id: Uuid,
    pub name: String,
    pub hospital_type: String,
    pub state: String,
    pub city: String,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
}
