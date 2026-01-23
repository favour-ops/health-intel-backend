use crate::errors::app::AppError;

impl From<sqlx::Error> for AppError {
    fn from(error: sqlx::Error) -> Self {
        if let sqlx::Error::Database(db_err) = &error {
            // PostgreSQL error code for Unique Violation is "23505"
            if db_err.code().as_deref() == Some("23505") {
                return AppError::Conflict("This record already exists.".to_string());
            }
            // PostgreSQL error code for Check Violation is "23514"
            if db_err.code().as_deref() == Some("23514") {
                 return AppError::BadRequest("Invalid data format (check constraint failed).".to_string());
            }
        }

        // Fallback for everything else
        AppError::Database(error.to_string())
    }
}