use serde::Serialize;
use utoipa::ToSchema; // Import ToSchema

#[derive(Debug, Serialize, ToSchema)] // Add ToSchema
pub struct Meta {
    pub count: Option<u32>,
    pub message: Option<String>,
}

// Note: For generics like this, we will define specific aliases 
// (e.g., "HospitalSuccessResponse") in the main documentation file later.
#[derive(Debug, Serialize, ToSchema)] // Add ToSchema
pub struct ApiResponse<T> {
    pub status: String,
    pub data: Option<T>,
    pub meta: Meta,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T, message: Option<String>) -> Self {
        Self {
            status: "success".to_string(),
            data: Some(data),
            meta: Meta {
                count: None,
                message,
            },
        }
    }

    pub fn error(message: &str) -> Self {
        Self {
            status: "error".to_string(),
            data: None,
            meta: Meta {
                count: None,
                message: Some(message.to_string()),
            },
        }
    }
}