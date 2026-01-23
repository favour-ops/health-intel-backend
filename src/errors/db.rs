use crate::errors::app::AppError;

impl From<sqlx::Error> for AppError {
    fn from(_: sqlx::Error) -> Self {
        AppError::Database
    }
}
