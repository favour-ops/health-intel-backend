use sqlx::PgPool;
use crate::models::Hospital;
use crate::models::hospital::CreateHospitalRequest;

pub async fn fetch_all_hospitals(
    pool: &PgPool,
) -> Result<Vec<Hospital>, sqlx::Error> {
    let hospitals = sqlx::query_as!(
        Hospital,
        r#"
        SELECT id, name, hospital_type, state, city, is_active, created_at, latitude, longitude
        FROM hospitals
        ORDER BY created_at DESC
        "#
    )
    .fetch_all(pool)
    .await?;

    Ok(hospitals)
}

pub async fn fetch_hospital_by_id(
    pool: &PgPool,
    hospital_id: uuid::Uuid,
) -> Result<Option<Hospital>, sqlx::Error> {
    let hospital = sqlx::query_as!(
        Hospital,
        r#"
        SELECT id, name, hospital_type, state, city, is_active, created_at, latitude, longitude
        FROM hospitals
        WHERE id = $1
        "#,
        hospital_id
    )
    .fetch_optional(pool)
    .await?;

    Ok(hospital)
}

pub async fn create_hospital(
    pool: &PgPool,
    payload: CreateHospitalRequest,
) -> Result<Hospital, sqlx::Error> {
    let hospital = sqlx::query_as!(
        Hospital,
        r#"
        INSERT INTO hospitals (name, hospital_type, state, city, latitude, longitude)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, hospital_type, state, city, is_active, created_at, latitude, longitude
        "#,
        payload.name,
        payload.hospital_type,
        payload.state,
        payload.city,
        payload.latitude, 
        payload.longitude 
    )
    .fetch_one(pool)
    .await?;

    Ok(hospital)
}