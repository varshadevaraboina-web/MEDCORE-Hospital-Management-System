# 🏥 MEDCORE – Hospital Management System

MEDCORE is a Java Full Stack Hospital Management System designed to simplify hospital administration by managing patients, doctors, appointments, and administrator access through a user-friendly dashboard.

## 🚀 Features

* Admin registration and login with JWT authentication
* Dashboard with hospital statistics
* Patient management (Add, View, Update, Delete)
* Doctor management (Add, View, Update, Delete)
* Appointment management
* Patient and doctor selection for appointments
* Search and filtering
* Responsive React dashboard

## 🛠️ Technologies Used

### Backend

* Java 25
* Spring Boot
* Spring Web
* Spring Data JPA
* Spring Security
* JWT Authentication
* Hibernate
* Maven

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Vite

### Database

* MySQL

### Development Tools

* Eclipse IDE
* Visual Studio Code
* MySQL Workbench
* Postman
* Git and GitHub

## 📁 Project Structure

```text
MEDCORE/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/medcore/MEDCORE/
│       │       ├── Controller/
│       │       ├── Entity/
│       │       ├── Repository/
│       │       ├── Service/
│       │       └── config/
│       │
│       └── resources/
│           └── application.properties
│
├── Frontend/
│   └── medcore-frontend/
│       └── src/
│
├── pom.xml
└── README.md
```

## ⚙️ Application Configuration

Before running the backend, configure these environment variables:

* `DB_URL`
* `DB_USERNAME`
* `DB_PASSWORD`
* `JWT_SECRET`

Create a MySQL database named `medcore`.

Do not commit actual database credentials or JWT secrets to GitHub.

## ▶️ How to Run

### 1. Start the Backend

Open the project in Eclipse and run `MedcoreApplication.java`.

Backend URL:

`http://localhost:7777`

### 2. Start the Frontend

Open the frontend folder in VS Code and run:

```bash
npm install
npm run dev
```

Frontend URL:

`http://localhost:5173`

## 👨‍💻 Project Information

**Project Name:** MEDCORE – Hospital Management System
**Project Type:** Java Full Stack Development
**Backend:** Spring Boot
**Frontend:** React.js
**Database:** MySQL

---

Developed as a Java Full Stack Development project.
