use sqlx::PgPool;
use crate::models::Hospital;

pub async fn fetch_all_hospitals(
    pool: &PgPool,
) -> Result<Vec<Hospital>, sqlx::Error> {
    let hospitals = sqlx::query_as::<_, Hospital>(
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
    let hospital = sqlx::query_as::<_, Hospital>(
        r#"
        SELECT id, name, hospital_type, state, city, is_active, created_at
        FROM hospitals
        WHERE id = $1
        "#
    )
    .bind(hospital_id)
    .fetch_optional(pool)
    .await?;

    Ok(hospital)
}

