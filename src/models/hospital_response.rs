use serde::Serialize;
use crate::models::hospital::Hospital;

#[derive(Serialize)]
pub struct HospitalsResponse {
    pub hospitals: Vec<Hospital>,
}
