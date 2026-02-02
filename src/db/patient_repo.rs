use sqlx::PgPool;
use uuid::Uuid;
use crate::models::patient::{Patient, CreatePatientRequest};

pub async fn create_patient(pool: &PgPool, payload: CreatePatientRequest) -> Result<Patient, sqlx::Error> {
    sqlx::query_as!(
        Patient,
        r#"
        INSERT INTO patients (hospital_id, first_name, last_name, date_of_birth, gender, contact_phone, emergency_contact, address)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, hospital_id, first_name, last_name, date_of_birth, gender, contact_phone, emergency_contact, address, created_at
        "#,
        payload.hospital_id,
        payload.first_name,
        payload.last_name,
        payload.date_of_birth,
        payload.gender,
        payload.contact_phone,
        payload.emergency_contact,
        payload.address
    )
    .fetch_one(pool)
    .await
}

pub async fn get_patients(pool: &PgPool, hospital_id: Option<Uuid>) -> Result<Vec<Patient>, sqlx::Error> {
    match hospital_id {
        Some(id) => {
            sqlx::query_as!(
                Patient,
                "SELECT * FROM patients WHERE hospital_id = $1 ORDER BY created_at DESC",
                id
            )
            .fetch_all(pool)
            .await
        }
        None => {
            sqlx::query_as!(
                Patient,
                "SELECT * FROM patients ORDER BY created_at DESC LIMIT 100"
            )
            .fetch_all(pool)
            .await
        }
    }
}