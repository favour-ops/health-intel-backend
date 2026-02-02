use health_intel_backend::setup_app;
use tokio::net::TcpListener;
use reqwest::Client;
use serde_json::{json, Value};
use sqlx::PgPool;
use uuid::Uuid; // Make sure to add this import

// Helper to spawn app
async fn spawn_app() -> (String, PgPool) {
    let (app, pool) = setup_app().await;
    let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
    let port = listener.local_addr().unwrap().port();
    tokio::spawn(async move { axum::serve(listener, app).await.unwrap(); });
    (format!("http://127.0.0.1:{}", port), pool)
}

#[tokio::test]
async fn full_clinical_workflow_success() {
    let (addr, _pool) = spawn_app().await;
    let client = Client::new();

    // Generate random values to prevent "Duplicate Key" errors on repeated runs
    let random_id = Uuid::new_v4();
    let hospital_name = format!("Test Hospital {}", random_id);
    let doctor_email = format!("dr.{}@health.gov.ng", random_id);

    // 1. Create Hospital
    let resp = client.post(format!("{}/api/v1/hospitals", addr))
        .json(&json!({
            "name": hospital_name,
            "hospital_type": "PUBLIC",
            "state": "Lagos",
            "city": "Ikeja"
        }))
        .send().await.unwrap();
    
    // Check if creation failed (useful for debugging)
    if resp.status().as_u16() != 200 {
        panic!("Failed to create hospital: {:?}", resp.text().await.unwrap());
    }

    let hospital: Value = resp.json().await.unwrap();
    // FIX: Access "id" directly inside "data"
    let hospital_id = hospital["data"]["id"].as_str().expect("Hospital ID not found");

    // 2. Create Department
    let resp = client.post(format!("{}/api/v1/departments", addr))
        .json(&json!({
            "hospital_id": hospital_id,
            "name": "Cardiology",
            "department_type": "MEDICAL"
        }))
        .send().await.unwrap();
    let dept: Value = resp.json().await.unwrap();
    let dept_id = dept["data"]["id"].as_str().expect("Department ID not found");

    // 3. Create Doctor (Staff)
    let resp = client.post(format!("{}/api/v1/staff", addr))
        .json(&json!({
            "hospital_id": hospital_id,
            "department_id": dept_id,
            "first_name": "John",
            "last_name": "Doe",
            "role": "DOCTOR",
            "email": doctor_email
        }))
        .send().await.unwrap();
    let staff: Value = resp.json().await.unwrap();
    let staff_id = staff["data"]["id"].as_str().expect("Staff ID not found");

    // 4. Create Patient
    let resp = client.post(format!("{}/api/v1/patients", addr))
        .json(&json!({
            "first_name": "Jane",
            "last_name": "Patient",
            "date_of_birth": "1995-01-01",
            "gender": "FEMALE"
        }))
        .send().await.unwrap();
    let patient: Value = resp.json().await.unwrap();
    let patient_id = patient["data"]["id"].as_str().expect("Patient ID not found");

    // 5. Create Visit (The final link)
    let resp = client.post(format!("{}/api/v1/visits", addr))
        .json(&json!({
            "hospital_id": hospital_id,
            "patient_id": patient_id,
            "staff_id": staff_id,
            "reason": "Chest pain checkup"
        }))
        .send().await.unwrap();

    // ASSERTIONS
    assert_eq!(resp.status().as_u16(), 200);
    let visit: Value = resp.json().await.unwrap();
    
    assert_eq!(visit["status"], "success");
    assert_eq!(visit["data"]["reason"], "Chest pain checkup");
    assert_eq!(visit["data"]["status"], "PENDING");
}