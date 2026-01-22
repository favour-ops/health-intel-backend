use serde::Serialize;

#[derive(Serialize)]
pub struct ApiResponse<T> {
    pub status: String,
    pub data: T,
    pub meta: Meta,
}

#[derive(Serialize)]
pub struct Meta {
    pub timestamp: i64,
    pub count: Option<usize>,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T, count: Option<usize>) -> Self {
        Self {
            status: "success".to_string(),
            data,
            meta: Meta {
                timestamp: chrono::Utc::now().timestamp(),
                count,
            },
        }
    }
}
