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
