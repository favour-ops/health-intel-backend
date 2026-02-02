use sqlx::PgPool;
use uuid::Uuid;
use crate::models::department::{Department, CreateDepartmentRequest};

pub async fn create_department(pool: &PgPool, payload: CreateDepartmentRequest) -> Result<Department, sqlx::Error> {
    sqlx::query_as!(
        Department,
        r#"
        INSERT INTO departments (hospital_id, name, department_type)
        VALUES ($1, $2, $3)
        RETURNING id, hospital_id, name, department_type, created_at
        "#,
        payload.hospital_id,
        payload.name,
        payload.department_type
    )
    .fetch_one(pool)
    .await
}

pub async fn get_departments_by_hospital(pool: &PgPool, hospital_id: Uuid) -> Result<Vec<Department>, sqlx::Error> {
    sqlx::query_as!(
        Department,
        "SELECT * FROM departments WHERE hospital_id = $1 ORDER BY name ASC",
        hospital_id
    )
    .fetch_all(pool)
    .await
}