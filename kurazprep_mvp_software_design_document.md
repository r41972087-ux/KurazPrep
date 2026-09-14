# Software Design Document: KurazPrep (MVP)

## 1. Introduction
**Project Name:** KurazPrep  
**Version:** 1.0 (Minimum Viable Product)  
**Purpose:** This document outlines the software architecture, technology stack, data models, and system interactions required to build and deploy the KurazPrep MVP. The MVP focuses on delivering offline-accessible, curriculum-aligned short notes and practice quizzes to Grade 12 students in Ethiopia, along with basic Telebirr monetization.

## 2. System Architecture Overview
KurazPrep will utilize a **Client-Server Architecture** with a strong emphasis on an **Offline-First Mobile Client**. 

*   **Mobile Client (Frontend):** Handles user interface, local data storage (for offline access), and content rendering.
*   **Backend API (Server):** Manages user authentication, content delivery, subscription status, and payment processing.
*   **Database:** Centralized storage for user profiles, educational content (Notes, Questions), and transaction logs.
*   **Third-Party Integrations:** Telebirr (Payments), SMS Gateway (OTP/Auth).

## 3. Technology Stack (Proposed)
*   **Mobile Frontend:** **Flutter (Dart)** 
    *   *Reasoning:* Cross-platform (Android/iOS) from a single codebase. Android is the dominant OS in Ethiopia. Flutter has excellent packages for local storage and offline state management.
*   **Local Mobile Database:** **Isar Database** or **Hive**
    *   *Reasoning:* Fast, lightweight NoSQL databases for Flutter, ideal for storing large text modules and JSON representations of quizzes for offline use.
*   **Backend Framework:** **Node.js with NestJS (TypeScript)** or **Python (Django)**
    *   *Reasoning:* Highly scalable, easy to build RESTful APIs. Django provides a great out-of-the-box admin panel for the content verification team. Let's assume **Node.js / Express** for a lightweight MVP.
*   **Primary Database:** **PostgreSQL**
    *   *Reasoning:* Robust relational database to handle structured data (Grades $\rightarrow$ Subjects $\rightarrow$ Units $\rightarrow$ Topics).
*   **Hosting/Infrastructure:** **AWS** or local Ethiopian data center (e.g., Safaricom ET/Ethio Telecom cloud) to reduce latency and data costs for local users.

## 4. Core Data Models (Entity Relationship)

*   **User:**
    *   `id` (UUID), `phone_number` (String, unique), `name` (String), `grade_level` (Int), `stream` (Enum: Natural/Social), `subscription_status` (Boolean), `subscription_expiry` (Date).
*   **Subject:**
    *   `id` (UUID), `name` (String - e.g., Physics), `stream` (Enum).
*   **Unit (Chapter):**
    *   `id` (UUID), `subject_id` (UUID - FK), `unit_number` (Int), `title` (String), `version_hash` (String - used for sync).
*   **ShortNote:**
    *   `id` (UUID), `unit_id` (UUID - FK), `content` (Markdown/HTML), `order_index` (Int).
*   **Question:**
    *   `id` (UUID), `unit_id` (UUID - FK), `question_text` (String), `options` (JSON), `correct_answer_index` (Int), `rationale` (String).
*   **QuizResult:**
    *   `id` (UUID), `user_id` (UUID - FK), `unit_id` (UUID - FK), `score` (Int), `timestamp` (DateTime).

## 5. Offline Synchronization Strategy
To address low internet connectivity, the app will use a **Delta Sync** mechanism:
1.  **Initial Download:** When a user selects a Subject (e.g., Grade 12 Physics), the app downloads a compressed JSON payload of all Units, ShortNotes, and Questions for that subject.
2.  **Version Hashing:** The backend assigns a `version_hash` to each Unit.
3.  **Sync Check:** When the user connects to Wi-Fi/Data, the app sends a lightweight request comparing local `version_hash`es with the server.
4.  **Delta Update:** The server only sends data for Units where the `version_hash` has changed (e.g., a typo was fixed by the QA team).
5.  **Telemetry Sync:** The app uploads locally stored `QuizResult` data to the server to update the user's progress dashboard.

## 6. API Endpoints (MVP Scope)

**Authentication:**
*   `POST /api/v1/auth/request-otp` (Accepts phone number)
*   `POST /api/v1/auth/verify-otp` (Returns JWT token)

**Content Delivery:**
*   `GET /api/v1/subjects` (Lists available subjects based on user's stream)
*   `GET /api/v1/subjects/:id/sync` (Returns full payload of a subject for offline storage)

**Telemetry & Progress:**
*   `POST /api/v1/progress/quiz` (Uploads completed quiz scores)
*   `GET /api/v1/progress/dashboard` (Retrieves user weak points and stats)

**Payments:**
*   `POST /api/v1/payments/telebirr/initiate` (Starts a payment prompt on user's phone)
*   `POST /api/v1/payments/telebirr/webhook` (Telebirr confirms payment; backend activates subscription)

## 7. Security and Anti-Piracy Measures (MVP)
*   **Authentication:** JWT (JSON Web Tokens) with short expiry times and refresh tokens.
*   **Content Protection:** The local Isar/Hive database on the mobile device will be encrypted. 
*   **Copy Prevention:** Flutter UI will disable long-press text selection and standard screenshot capabilities (using tools like `flutter_windowmanager` for Android) to prevent easy scraping and redistribution on Telegram.