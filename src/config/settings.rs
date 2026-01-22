use std::env;

#[derive(Clone)]
pub struct Settings {
    pub database_url: String,
}

impl Settings {
    pub fn from_env() -> Self {
        Self {
            database_url: env::var("DATABASE_URL")
                .expect("DATABASE_URL must be set"),
        }
    }
}
