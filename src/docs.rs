use utoipa::OpenApi;
use crate::models::{
    hospital::{CreateHospitalRequest, Hospital},
    hospital_response::HospitalsResponse,
    single_hospital_response::SingleHospitalResponse,
    api_response::{Meta, HospitalListResponse, HospitalSingleResponse},
};
use crate::routes::hospitals;

#[derive(OpenApi)]
#[openapi(
    paths(
        hospitals::get_hospitals,
        hospitals::create_hospital_handler,
        hospitals::get_hospital_by_id
    ),
    components(
        schemas(
            Hospital,
            CreateHospitalRequest,
            HospitalsResponse,
            SingleHospitalResponse,
            Meta,
            // Register the response types with their proper aliases
            HospitalListResponse,
            HospitalSingleResponse,
        )
    ),
    tags(
        (name = "Hospitals", description = "Manage hospital records")
    )
)]
pub struct ApiDoc;