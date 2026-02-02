use sqlx::PgPool;
use uuid::Uuid;
use crate::models::equipment::{Equipment, CreateEquipmentRequest};

pub async fn create_equipment(pool: &PgPool, payload: CreateEquipmentRequest) -> Result<Equipment, sqlx::Error> {
    sqlx::query_as!(
        Equipment,
        r#"
        INSERT INTO equipment (hospital_id, department_id, name, serial_number, condition, is_operational)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, hospital_id, department_id, name, serial_number, condition, is_operational, created_at
        "#,
        payload.hospital_id,
        payload.department_id,
        payload.name,
        payload.serial_number,
        payload.condition,
        payload.is_operational
    )
    .fetch_one(pool)
    .await
}

pub async fn get_hospital_equipment(pool: &PgPool, hospital_id: Uuid) -> Result<Vec<Equipment>, sqlx::Error> {
    sqlx::query_as!(
        Equipment,
        "SELECT * FROM equipment WHERE hospital_id = $1 ORDER BY name ASC",
        hospital_id
    )
    .fetch_all(pool)
    .await
}