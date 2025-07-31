```markdown
# Medlinguitis 🧠✨

**Medlinguitis** is an AI-driven platform that transforms unstructured patient narratives into structured, clinically actionable Quality of Life (QoL) insights for **Abdominal Wall Hernia (AWH)** patients. Built using **Next.js**, **Material UI**, and **Firebase**, it empowers clinicians and researchers with thematic analysis, mental health signals, emotion detection, and automated PDF reporting.

---

## 🩺 Problem Statement

Abdominal Wall Hernia is a complex condition that impacts not only physical health but also **mental well-being, body image, social relationships**, and **employment**. Existing QoL tools often fail to capture these themes in depth, and manual analysis is slow, inconsistent, and unscalable.

---

## 💡 Our Solution

Medlinguitis uses **NLP models**, **emotion recognition**, and **Retrieval-Augmented Generation (RAG)** to extract core themes from narratives, identify mental health markers, and generate detailed summaries for doctors and patients.

---

## 🔍 Core Features

- **Thematic Classification** (PubMedBERT-based)  
  Classifies text into five QoL domains: Symptoms/Function, Body Image, Mental Health, Interpersonal Relationships, Employment/Finance

- **Sentiment & Emotion Analysis**  
  Detects polarity (positive/neutral/negative) and emotion scores (sadness, optimism, anger, etc.)

- **Mental Health Signal Detection**  
  Flags risk markers like anxiety, hopelessness, frustration, and social withdrawal

- **Smart Excerpt Finder (RAG)**  
  Uses both keyword and semantic search to find supporting quotes

- **AI-Generated PDF Reports**  
  Downloadable and clinician-friendly summaries of the patient’s QoL profile

- **Interactive AI Chatbot**  
  Explore patient data through natural language queries

- **Role-Based Access**  
  Separate views and features for **patients** and **doctors**

---

## 🧱 Tech Stack

- **Frontend**: Next.js + Material UI
- **Backend**: Next.js API Routes
- **Database**: Firebase Realtime Database
- **NLP Models**: PubMedBERT, Emotion Detection, Zero-Shot Classification
- **PDF Generation**: PDFKit / html-pdf

---

---

## 🔐 Authentication

Supports **role-based login**:
- **Patients** submit narratives and view their personal reports
- **Doctors** access and manage all patient data and reports

Example users:
```json
{
  "user_id": "u001",
  "Patient_ID": "MARYSIMPSON",
  "email": "nora@user.com",
  "password": "nora",
  "name": "Nora Ross",
  "role": "patient",
  "isReport": true
}
````

```json
{
  "admin_id": "admin001",
  "name": "Addison Foster",
  "email": "test@doctor.com",
  "password": "doctor",
  "role": "doctor",
  "isReport": false
}
```

---

## 📊 API Endpoints

| Endpoint            | Method | Description                       |
| ------------------- | ------ | --------------------------------- |
| `/api/dashboard`    | GET    | Returns summary analytics         |
| `/api/authenticate` | POST   | Authenticates a user              |
| `/api/login`        | POST   | Handles login                     |
| `/api/signup`       | POST   | Handles registration              |
| `/api/form`         | POST   | Accepts narrative inputs          |
| `/api/isreport`     | POST   | Updates `isReport` status         |
| `/api/patients`     | GET    | Returns patient list              |
| `/api/pdf`          | POST   | To Upload PDF                     |
| `/api/report/[id]`  | GET    | Retrieves specific PDF            |

---

## 📄 Sample Report

An automatically generated report contains:

* **Metadata**: Age, Gender, Medical History, Previous Hernia Repairs, Medications
* **Detected QoL Themes**: With confidence scores
* **Sentiment & Emotion**: Optimism, anger, sadness, etc.
* **Mental Health Signals**: Frustration, withdrawal, feeling overwhelmed
* **Narrative Excerpts**: Linked to specific themes with citations
* **Summary**: Empathetic overview of the patient’s Quality of Life concerns

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Gsingh2001/medlinguitis.git
cd medlinguitis
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧾 License

MIT License © 2025 \ Sheffield Hallam University

---

## 📫 Contact

* Email: [medlinguitis@gmail.com](mailto:medlinguitis@gmail.com)
* GitHub: [@your-username](https://github.com/your-username)
* Twitter: [@medlinguitis](https://twitter.com/medlinguitis) *(if applicable)*

---
