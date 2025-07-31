# 🧠 Medlinguitis – Meaningful Narratives, Smarter Care

**Medlinguitis** is an AI-powered platform that transforms unstructured patient narratives into structured, clinically meaningful insights for **Abdominal Wall Hernia (AWH)** patients. Designed using **Next.js**, **Firebase**, and state-of-the-art **NLP models**, Medlinguitis supports clinicians in delivering more empathetic, personalized care by surfacing key themes, emotional markers, and mental health risks hidden in narrative text.

---

## 🩺 Problem Statement

Abdominal Wall Hernia is not just a physical condition—it deeply affects mental health, body image, social interactions, and employment. Current Quality of Life (QoL) tools are limited in scope and fail to scale meaningfully across diverse patients.

---

## 💡 Our Solution

Medlinguitis uses AI to:

* Extract **QoL themes**
* Detect **emotions and sentiment**
* Identify **mental health signals**
* Summarize findings into **clinician-ready reports**

It bridges the communication gap between patients and doctors using natural language insights.

---

## 🔍 Core Features

* **Thematic Classification**: Uses PubMedBERT to identify 5 QoL domains:

  * Symptoms/Function
  * Body Image
  * Mental Health
  * Interpersonal Relationships
  * Employment/Finance

* **Emotion & Sentiment Analysis**: Extracts polarity and emotion scores (e.g., sadness, optimism, frustration)

* **Mental Health Detection**: Flags risk indicators like anxiety, hopelessness, or social isolation

* **Smart Excerpt Retrieval (RAG)**: Uses keyword & semantic search to find supporting quotes

* **AI-Powered PDF Reports**: Printable summaries with metadata, themes, excerpts, and mental health signals

* **Role-Based Dashboards**: Patients see personal reports; doctors manage & analyze all patient data

---

## 🧱 Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Frontend   | Next.js, Material UI              |
| Backend    | Next.js API Routes + FastAPI      |
| Database   | Firebase Realtime Database        |
| NLP Models | PubMedBERT, Zero-Shot, EmotionNet |
| Reporting  | PDFKit / html-pdf                 |

---

Thanks for the clarification! Here's the **updated section** of your documentation with the **correct authentication and authorization logic**:

---

## 🔐 Authentication & Authorization Logic

### ✅ Patients

* Authenticate via **token** stored after login.
* Access is restricted to their **own data only**.
* No `Patient_ID` is passed in params—it's derived from the authenticated patient's token.
* Applies to routes like:

  * `GET /api/report` → Returns the report for the token-bound patient.
  * `POST /api/form` → Saves form using patient’s token-based `Patient_ID`.

### 🧑‍⚕️ Doctors

* Authenticate via **token** after login.
* Use `Patient_ID` explicitly in **URL params or body** when accessing or modifying patient data.
* Doctor's token is verified **along with** the validity of the requested patient ID.
* Applies to routes like:

  * `GET /api/report/:id` → Fetch report for any patient.
  * `POST /api/pdf` → Upload a report for any patient.
  * `GET /api/patients` → View all patients.
  * `GET /api/dashboard` → Aggregate analysis for all patients.

---

### 🔒 Security Enforcement (Summary Table)

| Endpoint          | Auth Token Used | Patient\_ID in Param | Who Can Access | Access Rule                               |
| ----------------- | --------------- | -------------------- | -------------- | ----------------------------------------- |
| `/api/login`      | ❌               | ❌                    | Everyone       | Authenticates user, returns role + token  |
| `/api/form`       | ✅ (patient)     | ❌                    | Patient only   | Uses token to infer `Patient_ID`          |
| `/api/report`     | ✅ (patient)     | ❌                    | Patient only   | Report based on logged-in patient         |
| `/api/report/:id` | ✅ (doctor)      | ✅                    | Doctor only    | Requires valid token + param `Patient_ID` |
| `/api/dashboard`  | ✅ (doctor)      | ❌                    | Doctor only    | Shows combined stats                      |
| `/api/patients`   | ✅ (doctor)      | ❌                    | Doctor only    | List/manage patients                      |
| `/api/pdf`        | ✅ (doctor)      | ✅ (in body)          | Doctor only    | Upload PDF report for patient             |

---

This model ensures:

* **Patients can only access their own data**
* **Doctors can view/manage any patient** using proper ID & token-based verification

---

## 📁 Firebase Database Schema

```json
{
  "users": {
    "u001": {
      "Patient_ID": "MARYSIMPSON",
      "email": "nora@user.com",
      "password": "nora",
      "name": "Nora Ross",
      "role": "patient",
      "isReport": true
    },
    "admin001": {
      "name": "Addison Foster",
      "email": "test@doctor.com",
      "password": "doctor",
      "role": "doctor",
      "isReport": false
    }
  },
  "forms": {
    "MARYSIMPSON": {
      "Patient_ID": "MARYSIMPSON",
      "Metadata": {
        "Age": 60,
        "Gender": "Female",
        "Medical_History": "...",
        "Occupation": {
          "Job_Title": "Teacher",
          "Category": "Education"
        }
      },
      "Narratives": {
        "narrative1": "I feel discomfort while moving.",
        "narrative2": "It impacts my work and confidence."
      }
    }
  },
  "reports": {
    "MARYSIMPSON": {
      "report": {
        "themes": [...],
        "sentiment": "...",
        "emotions": "...",
        "mentalHealth": "...",
        "summary": "...",
        "pdfUrl": "..."
      }
    }
  }
}
```

---

## 🔀 Workflow Summary

### 🧍 Patient Flow

1. **Login/Signup** → `/api/login` or `/api/signup`
2. **Fill Narrative Form** → `/api/form`

   * Saves to `forms/Patient_ID`
   * Sends to FastAPI for processing
3. **View Report** → `/myreport`

   * Fetches from `reports/Patient_ID`
   * Option to print/download
4. **Logout** → Ends session

---

### 🧑‍⚕️ Doctor Flow

1. **Login/Signup** → `/api/login` or `/api/signup`
2. **View Dashboard** → `/dashboard`

   * Aggregated themes, emotions, mental health trends
3. **Manage Patients** → `/patients`

   * View, search, or add users
4. **Upload PDF** → `/api/pdf`

   * Manually upload a PDF report
5. **Logout** → Ends session

---

## 📊 API Endpoints

| Endpoint            | Method | Role    | Description                 |
| ------------------- | ------ | ------- | --------------------------- |
| `/api/signup`       | POST   | Both    | Register new user           |
| `/api/login`        | POST   | Both    | Authenticate user           |
| `/api/form`         | POST   | Patient | Submit form data            |
| `/api/report/[id]`  | GET    | Both    | Get report by `Patient_ID`  |
| `/api/isreport`     | POST   | System  | Update report status        |
| `/api/dashboard`    | GET    | Doctor  | Fetch analytics summary     |
| `/api/patients`     | GET    | Doctor  | List all patient users      |
| `/api/pdf`          | POST   | Doctor  | Upload PDF for patient      |
| `/api/authenticate` | POST   | System  | Validate user session/token |

---

## 🔐 Role-Based Access

| Route          | Patients | Doctors  |
| -------------- | -------- | -------- |
| `/form`        | ✅ Submit | ❌        |
| `/myreport`    | ✅ View   | ❌        |
| `/dashboard`   | ❌        | ✅ View   |
| `/patients`    | ❌        | ✅ Manage |
| `/report/[id]` | ✅ Own    | ✅ All    |
| `/pdf`         | ❌        | ✅ Upload |

---

## 📄 Sample Report Includes

* **Metadata**: Age, Gender, History
* **Themes**: QoL categories + confidence
* **Emotions**: Sadness, anger, optimism
* **Mental Health Flags**: Hopelessness, anxiety, withdrawal
* **Smart Excerpts**: Mapped quotes from patient text
* **PDF Summary**: Printable, shareable report

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/Gsingh2001/medlinguitis.git
cd medlinguitis
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Local Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧾 License

MIT License © 2025 — Sheffield Hallam University

---
