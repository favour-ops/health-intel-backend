use sqlx::PgPool;
use uuid::Uuid;
use crate::models::staff::{Staff, CreateStaffRequest};

pub async fn create_staff(pool: &PgPool, payload: CreateStaffRequest) -> Result<Staff, sqlx::Error> {
    sqlx::query_as!(
        Staff,
        r#"
        INSERT INTO staff (hospital_id, department_id, first_name, last_name, role, email, contact_phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, hospital_id, department_id, first_name, last_name, role, email, contact_phone, is_active, created_at
        "#,
        payload.hospital_id,
        payload.department_id,
        payload.first_name,
        payload.last_name,
        payload.role,
        payload.email,
        payload.contact_phone
    )
    .fetch_one(pool)
    .await
}

pub async fn get_staff_by_hospital(pool: &PgPool, hospital_id: Uuid) -> Result<Vec<Staff>, sqlx::Error> {
    sqlx::query_as!(
        Staff,
        "SELECT * FROM staff WHERE hospital_id = $1 ORDER BY last_name ASC",
        hospital_id
    )
    .fetch_all(pool)
    .await
}