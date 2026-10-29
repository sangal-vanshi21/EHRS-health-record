# Electronic Health Record System (EHRS01)
> **Domain:** Healthcare and Pharma | **Contract / Work Type:** New Product Development  
> **Managed by:** EdTech | **Project Manager:** Gaurav Kumar | **Timeline:** 20 Days / Multi-Sprint Scope

---

## 🏥 Executive Project Summary

The **Electronic Health Record System (EHRS01)** is a comprehensive, web-based clinical and administrative health platform designed for large healthcare organizations comprising multiple hospitals, outpatient clinics, and specialized care centers. The project aims to eliminate fragmented patient data across legacy silos, replace manual paper-based charting with structured digital clinical workflows, enhance care coordination, and empower patients through secure digital health access.

### 🎯 Organization Vision
> *"To provide innovative healthcare solutions that improve patient outcomes, enhance clinical workflows, and promote care coordination."*

### 📐 SMART Objectives
- **Specific:** Develop and implement a comprehensive, web-based Electronic Health Records (EHR) system to manage patient data, streamline clinical workflows, and improve care coordination.
- **Attainable:** Leverages a cross-functional 24-member team (Onsite & Offshore), proven Node.js/React architectures, and open healthcare interoperability standards (HL7 & FHIR).
- **Relevant:** Directly aligns with the organization's mission to optimize clinician productivity and patient quality of care.
- **Time-bound:** Core product increments delivered within a 20-day timeline across agile sprint cadences.

---

## 🚀 Key Features & The 6 Epics in Scope

### 1. Epic 1: Patient Management & Demographics (Duration: 3 Sprints)
- **Master Patient Index (MPI):** Registration, demographics, contact details, emergency contacts, blood group, and insurance policy verification.
- **Patient 360 Profile:** Full chronological view of active conditions, surgical history, allergy risks, past encounters, and active prescriptions.
- **Real-Time Patient Directory:** Fast search by patient name, MRN (Medical Record Number), or email.

### 2. Epic 2: Clinical Documentation & SOAP Notes (Duration: 4 Sprints)
- **Clinical Encounters:** Capture outpatient, acute, and telehealth consultations with date, clinician signature, and department.
- **Biometric Vitals:** Record Blood Pressure (systolic/diastolic), Heart Rate, Oxygen Saturation ($SpO_2$), Temperature, and Respiratory Rate.
- **Dynamic BMI Calculator:** Automatic Body Mass Index computation from patient height and weight.
- **Structured 4-Quadrant SOAP Notes:**
  - **S (Subjective):** Chief complaint and History of Present Illness (HPI).
  - **O (Objective):** Physical exam findings and vital observations.
  - **A (Assessment):** Clinical diagnoses, differential considerations, and ICD-10 coding.
  - **P (Plan):** Diagnostic workup, prescriptions, referrals, and patient education.

### 3. Epic 3: Computerized Provider Order Entry (CPOE) & Diagnostics (Duration: 3 Sprints)
- **Diagnostic Orders Placement:** Order Laboratory panels (CBC, CMP-14, HbA1c, Lipid Panel, Urinalysis) and Imaging studies (Chest X-Ray, CT Brain, MRI Spine, Echo).
- **Priority Triage:** Set orders to *Routine*, *Urgent*, or *STAT*.
- **Verified Results Review:** Quantitative lab values with reference intervals and automatic flags (*Normal*, *High*, *Critical*).
- **Simulated PACS DICOM Web Viewer:** High-fidelity radiograph viewer with zoom, contrast inversion, window level controls, and radiologist impressions.

### 4. Epic 4: Medication Management & E-Prescribing (e-Rx) (Duration: 3 Sprints)
- **e-Prescribing Engine:** Direct transmission to pharmacy networks (Surescripts / NCPDP SCRIPT standard).
- **Clinical Decision Support (CDS) Contraindication Detection:** Real-time cross-referencing between patient documented allergies and prescribed drug classes (e.g., Penicillin cross-reactivity with Amoxicillin/Ampicillin, Sulfa allergy with Bactrim).
- **Clinician Override Safeguards:** Prevents contraindicated prescriptions while providing documented emergency clinical override with logged justification.
- **Regimen Lifecycle:** Active list maintenance, refill count tracking, and discontinuation reasons.

### 5. Epic 5: System Integration & Interoperability Hub (Duration: 4 Sprints)
- **HL7 v2.5.1 Gateway:**
  - Automated message generation: `ADT^A01` (Admit/Visit), `ADT^A08` (Demographic Update), `ORU^R01` (Lab Results), and `RDE^O11` (Pharmacy Orders).
  - Built-in HL7 parser: dissects raw ER7 pipe-delimited strings into structured MSH, PID, PV1, OBR, OBX, and RXE segments.
- **HL7 FHIR Release 4 (R4) REST API:**
  - `/api/fhir/Patient`: FHIR R4 Patient resources and searchset bundles.
  - `/api/fhir/Observation`: Vital signs and laboratory observations.
  - `/api/fhir/MedicationRequest`: Prescription orders.
  - `/api/fhir/DiagnosticReport`: Diagnostic and imaging reports.
  - `/api/fhir/$everything`: Complete patient record FHIR bundle.
  - `/api/fhir/metadata`: FHIR CapabilityStatement conformance statement.
- **External IT Connectors:** Simulated active connectors for Enterprise EMR, PACS (Port 104 DICOM Web), LIS (MLLP Port 2575), and Pharmacy Gateway.

### 6. Epic 6: Patient Portal & Secure Communication (Duration: 3 Sprints)
- **Dual Role Switcher:** Toggle seamlessly between *Clinician View* (Dr. Rachel Adams) and *Patient Portal View* (Eleanor Vance).
- **Self-Service Appointment Booking:** Patients can schedule In-Person or Telehealth visits with specific providers and receive confirmations.
- **Secure Messaging:** HIPAA-ready encrypted two-way message inbox between patients and the care team.
- **Personal Health Records Access:** Direct patient access to lab results, vital signs history, and active medications.

---

## 📊 Agile Performance & Delivery Metrics

As mandated in the project specification, delivery performance is measured across Strategic, Tactical, and Operational tiers:

| Tier | Metric Name | Target | Current Value | Clinical & Delivery Driver |
| :--- | :--- | :---: | :---: | :--- |
| **Strategic** | Business Value Delivered | 100% | **84%** | CPOE adoption, e-Rx safety checks, EHR digitization |
| **Strategic** | Customer & Clinician Satisfaction (CSAT) | 90% | **92.4%** | Physician & nurse usability surveys across 4 clinics |
| **Strategic** | Time to First Viable Increment | 10 days | **8 days** | Sprint 3 release of core patient & encounter modules |
| **Tactical** | Release Burn-up | 450 pts | **362 pts** | Cumulative story points delivered across releases |
| **Tactical** | Defect Leakage | < 5% | **2.1%** | Stories passing internal QA with defects in Staging |
| **Tactical** | Cycle Time | < 3.5 days | **2.8 days** | Time elapsed from 'In-Progress' to 'Done' |
| **Tactical** | Escaped Defect Cost | < $5,000 | **$1,250** | Remediation cost of non-blocking UAT findings |
| **Operational** | Team Velocity | 35 pts | **38.5 pts/sprint** | Average points completed per sprint |
| **Operational** | Defect Density | < 1.5 | **0.62 / KLOC** | Defects per 1,000 lines of verified code |
| **Operational** | Code Coverage | >= 85% | **91.2%** | Automated unit & integration test coverage |
| **Operational** | Automated Test Pass Rate | >= 98% | **99.4%** | CI test pass rate across 300+ test cases |
| **Operational** | Deployment Frequency | Daily/On-demand| **4.2 / week** | CI/CD automated staging deployments |

---

## 👥 Team Structure & Organization (24 Members)

| Role | Count | Location | Key Responsibilities | Primary Tools |
| :--- | :---: | :--- | :--- | :--- |
| **Product Owner** | 1 | Onsite | Backlog grooming, stakeholder management, acceptance criteria | Jira, Confluence |
| **Project Manager** | 1 | Onsite | Project planning, risk management, progress tracking | Jira, MS Project |
| **Scrum Masters** | 2 | 1 Onsite, 1 Offshore | Sprint planning, stand-ups, retrospectives, obstacle removal | Jira, Confluence |
| **Technical Leads** | 2 | 1 Onsite, 1 Offshore | Technical design, code reviews, architectural governance | VS Code, SonarQube |
| **Front-End Developers** | 6 | 2 Onsite, 4 Offshore | React 19 UI components, Patient 360 chart, Patient Portal | React, Tailwind, Jest |
| **Back-End Developers** | 8 | 2 Onsite, 6 Offshore | REST APIs, FHIR R4 resources, HL7 engine, DB schemas | Node.js, Express, Postman |
| **DevOps Engineers** | 3 | 1 Onsite, 2 Offshore | CI/CD pipeline, AWS infrastructure, Terraform, Ansible | Jenkins, AWS CodePipeline |
| **QA Lead & Engineers** | 7 | 2 Onsite, 5 Offshore | Test plans, automated regression, clinical UAT verification | Selenium, Cucumber, Jest |
| **Business Analysts** | 2 | Onsite | Clinical workflow analysis, user stories, clinician interviews | Jira, Confluence |

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Tailwind CSS v4, Lucide Icons, Vite
- **Backend:** Node.js v24, Express 4.x
- **Standards:** HL7 v2.5.1 (ER7 pipe-delimited), HL7 FHIR Release 4 (R4) JSON
- **Testing:** Node.js native test runner (`node:test`, `node:assert`)
- **Architecture:** Modular Service-Repository pattern with integrated REST API and SPA static bundling

---

## 🚦 How to Run the Project

### Prerequisites
- Node.js (v18 or higher; v24 recommended)
- npm (v9 or higher)

### Option 1: Run Full Production App on Port 5000 (Recommended)
This runs the Node.js API server and serves the built React frontend simultaneously:

```bash
cd server
npm start
```
Open your browser and navigate to:  
👉 **http://localhost:5000**

---

### Option 2: Run Development Mode with Hot-Reload
In two separate terminal windows:

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
```
*API runs on `http://localhost:5000` with watch mode enabled.*

**Terminal 2 (Frontend with Vite):**
```bash
cd client
npm run dev
```
*Vite frontend runs on `http://localhost:3000` with instant hot-module replacement and `/api` proxying.*

---

## 🧪 Running Automated Tests

To run the built-in test suite:

```bash
cd server
npm test
```

### Verified Test Cases:
1. `Patient Service`: Retrieve initial cohort, search, and register new patients with MRN generation.
2. `Clinical Service`: Objective BMI calculations and structured 4-quadrant SOAP encounter signing.
3. `Order Management (CPOE)`: Diagnostic order placement and verified lab results entry.
4. `Medication Service`: Clinical decision support allergy contraindication detection, blocking, and clinician override.
5. `HL7 Interoperability`: Generation of `ADT^A01`, `ADT^A08`, `ORU^R01`, `RDE^O11` messages and segment parsing.
6. `FHIR Interoperability`: FHIR R4 Patient, Observation, MedicationRequest, and DiagnosticReport bundles.
7. `Patient Portal`: Appointment scheduling and two-way secure messaging.
8. `Agile Metrics`: Strategic, tactical, and operational metric calculation and progress tracking.

---

## 🔗 Key API Endpoints

- `GET /api/health` — Service health check
- `GET /api/patients` — List patients (supports `?search=` and `?status=`)
- `POST /api/patients` — Register new patient (triggers HL7 ADT notification)
- `GET /api/encounters` — List encounters & SOAP notes
- `POST /api/encounters` — Record encounter and vital signs
- `GET /api/orders` — List CPOE diagnostic orders
- `POST /api/orders` — Place diagnostic order (Labs / Imaging / Procedures)
- `GET /api/medications` — Active medication orders
- `POST /api/medications` — e-Prescribe medication (with allergy contraindication check)
- `GET /api/fhir/Patient` — FHIR R4 Patient resource bundle
- `GET /api/fhir/Observation` — FHIR R4 Vital Signs & Lab observations
- `GET /api/fhir/MedicationRequest` — FHIR R4 Prescriptions
- `GET /api/fhir/DiagnosticReport` — FHIR R4 Diagnostic reports
- `GET /api/fhir/$everything` — Complete FHIR R4 health record bundle
- `GET /api/hl7/samples/:type` — Sample HL7 v2 messages (`ADT_A01`, `ADT_A08`, `ORU_R01`, `RDE_O11`)
- `POST /api/hl7/parse` — Parse raw HL7 pipe-delimited string
- `GET /api/metrics` — Full Agile delivery performance dataset
