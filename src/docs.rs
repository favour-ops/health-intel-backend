use utoipa::OpenApi;
use crate::models::{
    hospital::{CreateHospitalRequest, Hospital},
    hospital_response::HospitalsResponse,
    single_hospital_response::SingleHospitalResponse,
    api_response::{ApiResponse, Meta}, // Only import ApiResponse and Meta
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
            // Register the generics. 
            // Utoipa sees the #[aliases] in api_response.rs and generates the correct names automatically.
            ApiResponse<HospitalsResponse>,
            ApiResponse<SingleHospitalResponse>,
        )
    ),
    tags(
        (name = "Hospitals", description = "Manage hospital records")
    )
)]
pub struct ApiDoc;