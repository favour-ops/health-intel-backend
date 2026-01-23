use utoipa::OpenApi;
use crate::models::{
    hospital::{CreateHospitalRequest, Hospital},
    hospital_response::HospitalsResponse,
    single_hospital_response::SingleHospitalResponse,
    api_response::{ApiResponse, Meta},
};
use crate::routes::hospitals; // Import the module

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
            ApiResponse<HospitalsResponse>,
            ApiResponse<SingleHospitalResponse>,
        )
    ),
    tags(
        (name = "Hospitals", description = "Manage hospital records")
    )
)]
pub struct ApiDoc;