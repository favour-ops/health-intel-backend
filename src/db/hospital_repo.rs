use sqlx::PgPool;
use crate::models::Hospital;
use crate::models::hospital::CreateHospitalRequest;

pub async fn fetch_all_hospitals(
    pool: &PgPool,
) -> Result<Vec<Hospital>, sqlx::Error> {
    let hospitals = sqlx::query_as!(
        Hospital,
        r#"
        SELECT 
            id, name, hospital_type, state, city, is_active, created_at, 
            latitude, longitude, total_beds, occupied_beds, has_emergency, has_oxygen, has_ventilators, has_ambulance
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
        SELECT 
            id, name, hospital_type, state, city, is_active, created_at, 
            latitude, longitude, total_beds, occupied_beds, has_emergency, has_oxygen, has_ventilators, has_ambulance
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
        INSERT INTO hospitals (
            name, hospital_type, state, city, 
            latitude, longitude, total_beds, occupied_beds, has_emergency,
            has_oxygen, has_ventilators, has_ambulance
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING 
            id, name, hospital_type, state, city, is_active, created_at, 
            latitude, longitude, total_beds, occupied_beds, has_emergency,
            has_oxygen, has_ventilators, has_ambulance
        "#,
        payload.name,
        payload.hospital_type,
        payload.state,
        payload.city,
        payload.latitude,
        payload.longitude,
        payload.total_beds.unwrap_or(0),
        payload.occupied_beds.unwrap_or(0),
        payload.has_emergency.unwrap_or(false),
        // New Fields (Default to false if missing)
        payload.has_oxygen.unwrap_or(false),
        payload.has_ventilators.unwrap_or(false),
        payload.has_ambulance.unwrap_or(false)
    )
    .fetch_one(pool)
    .await?;

    Ok(hospital)
}

pub async fn update_hospital(
    pool: &PgPool,
    id: uuid::Uuid,
    payload: CreateHospitalRequest,
) -> Result<Hospital, sqlx::Error> {
    let hospital = sqlx::query_as!(
        Hospital,
        r#"
        UPDATE hospitals
        SET 
            name = $1, 
            hospital_type = $2, 
            state = $3, 
            city = $4, 
            latitude = $5, 
            longitude = $6, 
            total_beds = $7, 
            occupied_beds = $8,
            has_emergency = $9,
            has_oxygen = $10,
            has_ventilators = $11,
            has_ambulance = $12
        WHERE id = $13
        RETURNING 
            id, name, hospital_type, state, city, is_active, created_at, 
            latitude, longitude, total_beds, occupied_beds, has_emergency,
            has_oxygen, has_ventilators, has_ambulance
        "#,
        payload.name,
        payload.hospital_type,
        payload.state,
        payload.city,
        payload.latitude,
        payload.longitude,
        payload.total_beds.unwrap_or(0),
        payload.occupied_beds.unwrap_or(0),
        payload.has_emergency.unwrap_or(false),
        // New Fields
        payload.has_oxygen.unwrap_or(false),
        payload.has_ventilators.unwrap_or(false),
        payload.has_ambulance.unwrap_or(false),
        id
    )
    .fetch_one(pool)
    .await?;

    Ok(hospital)
}

pub async fn delete_hospital(pool: &PgPool, hospital_id: uuid::Uuid) -> Result<u64, sqlx::Error> {
    let result = sqlx::query!(
        "DELETE FROM hospitals WHERE id = $1",
        hospital_id
    )
    .execute(pool)
    .await?;

    Ok(result.rows_affected()) // Returns how many rows were deleted (should be 1)
}