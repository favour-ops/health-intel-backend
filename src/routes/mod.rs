pub mod health;
pub mod hospitals;
pub mod router;
pub mod state;
pub mod auth;
pub mod departments;
pub mod staff;
pub mod patients;
pub mod visits;
pub mod equipment;

pub use router::create_router;
pub use state::AppState;
