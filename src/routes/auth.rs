use axum::{extract::State, Json};
use bcrypt::verify;
use jsonwebtoken::{encode, Header, EncodingKey};
use std::time::{SystemTime, UNIX_EPOCH};
use validator::Validate;

use crate::{
    routes::state::AppState,
    models::{
        user::{LoginRequest, LoginResponse, Claims},
        api_response::ApiResponse,
    },
    errors::app::AppError,
    db::user_repo,
};

#[utoipa::path(
    post,
    path = "/api/v1/login",
    tag = "Auth",
    request_body = LoginRequest,
    responses(
        (status = 200, description = "Login successful", body = LoginResponse),
        (status = 401, description = "Invalid credentials")
    )
)]
pub async fn login_handler(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<ApiResponse<LoginResponse>>, AppError> {
    // 1. Validate Input
    if let Err(e) = payload.validate() {
        return Err(AppError::BadRequest(e.to_string()));
    }

    // 2. Find User
    let user = user_repo::find_admin_by_email(&state.db, &payload.email)
        .await?
        .ok_or(AppError::Unauthorized)?; 

    // 3. Verify Password
    let valid = verify(&payload.password, &user.password_hash).unwrap_or(false);
    if !valid {
        return Err(AppError::Unauthorized);
    }

    // 4. Generate Token (Expires in 24 hours)
    let expiration = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() as usize + (24 * 3600);

    let claims = Claims {
        sub: user.id.to_string(),
        exp: expiration,
        iat: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs() as usize,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(state.jwt_secret.as_bytes()),
    ).map_err(|_| AppError::Internal)?;

    // 5. Return Success
    Ok(Json(ApiResponse::success(
        LoginResponse { token, user },
        Some("Login successful".to_string()),
    )))
}