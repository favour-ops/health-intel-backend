use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};

use crate::errors::app::AppError;

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let status = match self {
            AppError::NotFound => StatusCode::NOT_FOUND,
            AppError::Database => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::Internal => StatusCode::INTERNAL_SERVER_ERROR,
        };

        let body = Json(serde_json::json!({
            "success": false,
            "error": self.to_string()
        }));

        (status, body).into_response()
    }
}
