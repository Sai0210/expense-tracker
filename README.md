
# Java Full-Stack Expense Tracker

A robust, local-first financial management tool built to demonstrate a modern three-tier architecture using **Spring Boot** and **React**.

## 🚀 Key Features
* **Full CRUD Functionality**: Users can create, view, edit, and delete transactions with real-time UI updates.
* **Bulk CSV Import**: Automated engine that parses bank statements and handles duplicate detection.
* **Smart Logic**: A dedicated Service Layer that calculates total spending and handles business logic.
* **Data Validation**: Implemented Jakarta Validation to ensure data integrity (e.g., no negative expenses).
* **Advanced Search**: Partial-match searching and date-range filtering for financial insights.

## 🛠️ Technical Stack
* **Backend**: Java 17, Spring Boot 3/4, Spring Data JPA.
* **Frontend**: React (Hooks, Axios).
* **Database**: SQLite for local persistence.
* **Error Handling**: Global `@RestControllerAdvice` for clean API error responses.

## 📦 Project Structure
```text
/expense-tracker
  ├── /src (Java Backend Source)
  ├── /frontend (React UI Source)
  ├── tracker.db (Local SQLite Database)
  └── pom.xml (Maven Configuration)
```


## ⚙️ How to Run Locally

### Prerequisites

* Java 17 or higher
* Node.js & npm

### Step 1: Start the Backend

1. Open the project in IntelliJ or your preferred IDE.
2. Run `ExpenseTrackerApplication.java`.
3. The API will be available at `http://localhost:8080`.

### Step 2: Start the Frontend

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the UI: `npm start`
4. View the app at `http://localhost:3000`.

```
