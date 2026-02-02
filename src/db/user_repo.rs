use sqlx::PgPool;
use crate::models::user::AdminUser;

pub async fn find_admin_by_email(pool: &PgPool, email: &str) -> Result<Option<AdminUser>, sqlx::Error> {
    sqlx::query_as!(
        AdminUser,
        "SELECT id, email, password_hash FROM admins WHERE email = $1",
        email
    )
    .fetch_optional(pool)
    .await
}