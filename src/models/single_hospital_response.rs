use serde::Serialize;
use crate::models::Hospital;

#[derive(Serialize)]
pub struct SingleHospitalResponse {
    pub hospital: Hospital,
}
