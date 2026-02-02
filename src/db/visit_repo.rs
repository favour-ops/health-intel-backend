use sqlx::PgPool;
use uuid::Uuid;
use crate::models::visit::{Visit, CreateVisitRequest};

pub async fn create_visit(pool: &PgPool, payload: CreateVisitRequest) -> Result<Visit, sqlx::Error> {
    sqlx::query_as!(
        Visit,
        r#"
        INSERT INTO visits (hospital_id, patient_id, staff_id, reason, status, start_time)
        VALUES ($1, $2, $3, $4, 'PENDING', COALESCE($5, NOW()))
        RETURNING id, hospital_id, patient_id, staff_id, reason, status, start_time, end_time, created_at
        "#,
        payload.hospital_id,
        payload.patient_id,
        payload.staff_id,
        payload.reason,
        payload.start_time
    )
    .fetch_one(pool)
    .await
}

pub async fn get_hospital_visits(pool: &PgPool, hospital_id: Uuid) -> Result<Vec<Visit>, sqlx::Error> {
    sqlx::query_as!(
        Visit,
        "SELECT * FROM visits WHERE hospital_id = $1 ORDER BY start_time DESC",
        hospital_id
    )
    .fetch_all(pool)
    .await
}