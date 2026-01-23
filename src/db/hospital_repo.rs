use sqlx::PgPool;
use crate::models::Hospital;
use crate::models::hospital::CreateHospitalRequest;

pub async fn fetch_all_hospitals(
    pool: &PgPool,
) -> Result<Vec<Hospital>, sqlx::Error> {
    // FIX: Using query_as! macro for compile-time verification
    let hospitals = sqlx::query_as!(
        Hospital,
        r#"
        SELECT id, name, hospital_type, state, city, is_active, created_at
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
    // FIX: Using query_as! macro for compile-time verification
    let hospital = sqlx::query_as!(
        Hospital,
        r#"
        SELECT id, name, hospital_type, state, city, is_active, created_at
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
        INSERT INTO hospitals (name, hospital_type, state, city)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, hospital_type, state, city, is_active, created_at
        "#,
        payload.name,
        payload.hospital_type,
        payload.state,
        payload.city
    )
    .fetch_one(pool)
    .await?;

    Ok(hospital)
}