use serde::Serialize;

#[derive(Serialize)]
pub struct Meta {
    pub count: Option<usize>,
    pub message: Option<String>,
}

#[derive(Serialize)]
pub struct ApiResponse<T> {
    pub status: String,
    pub data: Option<T>,
    pub meta: Meta,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T, count: Option<usize>) -> Self {
        Self {
            status: "success".to_string(),
            data: Some(data),
            meta: Meta {
                count,
                message: None,
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
