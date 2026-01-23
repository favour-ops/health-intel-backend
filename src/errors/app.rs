use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use tracing::error;
use crate::models::ApiResponse;

#[derive(Debug)]
pub enum AppError {
    NotFound,
    // Database now holds a String message to explain what went wrong
    Database(String),
    // New Conflict variant
    Conflict(String),
    BadRequest(String),
    Unauthorized,
    Forbidden,
    Internal,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message, error_code) = match &self {
            AppError::NotFound => (
                StatusCode::NOT_FOUND,
                "Resource not found",
                "NOT_FOUND",
            ),
            AppError::Database(msg) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                msg.as_str(),
                "DATABASE_ERROR",
            ),
            AppError::Conflict(msg) => (
                StatusCode::CONFLICT,
                msg.as_str(),
                "CONFLICT",
            ),
            AppError::BadRequest(msg) => (
                StatusCode::BAD_REQUEST,
                msg.as_str(),
                "BAD_REQUEST",
            ),
            AppError::Unauthorized => (
                StatusCode::UNAUTHORIZED,
                "Unauthorized",
                "UNAUTHORIZED",
            ),
            AppError::Forbidden => (
                StatusCode::FORBIDDEN,
                "Forbidden",
                "FORBIDDEN",
            ),
            AppError::Internal => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Internal server error",
                "INTERNAL_ERROR",
            ),
        };

        error!(
            error_code = error_code,
            http_status = status.as_u16(),
            message = message,
            "request failed"
        );

        let body = ApiResponse::<()>::error(message);

        (status, Json(body)).into_response()
    }
}