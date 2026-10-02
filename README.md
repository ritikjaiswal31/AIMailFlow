# AIMailFlow

---

## Project Overview

AIMailFlow is an AI-powered email response solution that generates context-aware replies using **Google Gemini AI**. The application uses **Spring Boot** for the backend and **React** for the frontend, with a **Chrome Extension** for Gmail integration. It provides tone-based email generation through REST APIs, while **WebClient** handles communication between the backend and Gemini AI.

---

## Key Features

* AI-powered, context-aware email reply generation using **Gemini AI**
* Context-aware responses based on email content
* Tone-based response generation, including **Professional, Casual, and Friendly**
* Gmail integration through a **Chrome Extension**
* API testing and validation using **Postman**

---

## Tech Stack

| Category       | Technologies               |
| -------------- | -------------------------- |
| Backend        | Spring Boot                |
| Frontend       | React                      |
| Communication  | REST APIs                  |
| Extension      | Chrome Extension           |
| API Testing    | Postman                    |

---

## Architecture

```text
                         AIMailFlow Application
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                  React Frontend          Chrome Extension
                                             (Gmail)
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                              REST API
                                  │
                                  ▼
                       Spring Boot Backend
                                  │
                                  ▼
                         MailController
                                  │
                                  ▼
                           MailService
                                  │
                           WebClient
                                  │
                                  ▼
                             Gemini AI
                                  │
                                  ▼
                         Generated Reply
                                  │
                                  ▼
                         React / Gmail

```
---

## Screenshots  

### AI Reply in Gmail

<img width="1486" height="644" alt="image" src="https://github.com/user-attachments/assets/52f18005-dee4-40be-ad52-7eaab2651571" />

<img width="1490" height="712" alt="image" src="https://github.com/user-attachments/assets/30fff2db-a3c6-4464-81c8-80865ac97426" />

---

### Chrome Extension

<img width="1009" height="626" alt="Screenshot 2025-08-29 031232" src="https://github.com/user-attachments/assets/55c94846-9299-4cc2-9616-599bdbaa8815" />

---

### Frontend Service

<img width="1429" height="886" alt="image" src="https://github.com/user-attachments/assets/6bb40bb4-55f7-46a8-a32c-774039af2634" />

<img width="1077" height="758" alt="Screenshot 2026-01-01 034230" src="https://github.com/user-attachments/assets/27594374-0863-4c62-914e-47ed2296d195" />

<img width="1071" height="762" alt="Screenshot 2026-01-01 034251" src="https://github.com/user-attachments/assets/c5b1c7bf-3d18-407f-be14-60818e11b7c4" />

<img width="1074" height="756" alt="Screenshot 2026-01-01 034311" src="https://github.com/user-attachments/assets/4c292404-117e-4129-b85d-e37a5146c218" />

---

### Backend Service 

<img width="1502" height="648" alt="image" src="https://github.com/user-attachments/assets/5dcfbcc3-bf2b-4114-97e9-a8431aa3ad7a" />

<img width="1377" height="591" alt="image" src="https://github.com/user-attachments/assets/c364fe2d-22d4-4737-81d0-e5761616a78d" />

---

### Postman Testing

<img width="1417" height="657" alt="image" src="https://github.com/user-attachments/assets/0baf852f-7de6-4a6e-8a24-52b2170a3784" />

<img width="1422" height="700" alt="image" src="https://github.com/user-attachments/assets/e8c7ca45-659e-4695-833a-ed6f4998cf14" />
