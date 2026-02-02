use utoipa::OpenApi;
use crate::models::{
    hospital::{CreateHospitalRequest, Hospital},
    hospital_response::HospitalsResponse,
    single_hospital_response::SingleHospitalResponse,
    department::{Department, CreateDepartmentRequest},
    staff::{Staff, CreateStaffRequest},
    patient::{Patient, CreatePatientRequest},
    visit::{Visit, CreateVisitRequest},
    equipment::{Equipment, CreateEquipmentRequest},
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
            Department,
            CreateDepartmentRequest,       
            HospitalListResponse,
            HospitalSingleResponse,
            Staff,
            CreateStaffRequest,
            Patient,
            CreatePatientRequest,
            Visit,
            CreateVisitRequest,
            Equipment,
            CreateEquipmentRequest,
        )
    ),
    tags(
        (name = "Hospitals", description = "Manage hospital records")
    )
)]
pub struct ApiDoc;