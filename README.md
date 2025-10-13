## AcadeMeet: Study & Share Platform 📚

**AcadeMeet** is a dynamic web application designed to help students connect, study in groups, and share valuable educational notes. It serves as a central hub for collaborative learning, making it easier to find study partners and access peer-contributed resources.

-----

## Features ✨

### Core Functionality

  * **Group Study Creation & Discovery:** Students can create new study groups based on subject or topic, and others can easily search and join relevant groups.
  * **Study Group Management:** Tools for group administrators to manage membership and group details.
  * **Note Sharing:** A dedicated feature for users to upload, share, browse, and download study notes, summaries, and educational materials.
  * **User Profiles:** Personalized profiles showing a user's joined groups and shared notes.

-----

## Technology Stack 🛠️

AcadeMeet is built as a monolithic application using the following primary technologies:

### Backend

| Technology | Description |
| :--- | :--- |
| **Spring Boot** | The primary framework for building the robust, scalable RESTful API. |
| **Java** | The core programming language. |
| **MySQL** | The relational database management system for persistent storage of user data, group information, and notes. |

### Frontend

| Technology | Description |
| :--- | :--- |
| **React** | The JavaScript library for building the user interface. |
| **npm/yarn** | Package managers for handling frontend dependencies. |
| **HTML/CSS/JavaScript** | Standard web technologies. |

-----

## Getting Started 🚀

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

  * **Java Development Kit (JDK) 17+**
  * **Node.js & npm/yarn** (for React frontend)
  * **MySQL Server**
  * **Git** (for cloning the repository)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/markstatic12/AcadeMeet.git
    cd academeet
    ```

2.  **Database Setup:**

      * Create a MySQL database named `academeet_db`.
      * Update the database connection details in the backend configuration file:
          * Location: `backend/src/main/resources/application.properties` (or `application.yml`)
          * Adjust the `spring.datasource.url`, `spring.datasource.username`, and `spring.datasource.password` properties.

3.  **Backend Setup & Run:**

      * Navigate to the backend directory:
        ```bash
        cd backend
        ```
      * Build the project using Maven/Gradle (e.g., using a wrapper):
        ```bash
        ./mvnw clean install # If using Maven
        ```
      * Run the Spring Boot application:
        ```bash
        java -jar target/academeet-0.0.1-SNAPSHOT.jar # Adjust the file name as needed
        # OR run from your IDE (e.g., IntelliJ, VS Code)
        ```
      * The backend will typically start on `http://localhost:8080`.

4.  **Frontend Setup & Run:**

      * Navigate to the frontend directory:
        ```bash
        cd ../frontend # Assuming 'frontend' is next to 'backend'
        ```
      * Install dependencies:
        ```bash
        npm install
        # OR
        yarn install
        ```
      * Start the React development server:
        ```bash
        npm start
        # OR
        yarn start
        ```
      * The frontend will typically open in your browser at `http://localhost:3000`.

-----

## Contact 📧

- Zander Aligato / zander.aligato@cit.edu
- Richemmae Bigno / richemmae.bigno@cit.edu
- Mark Anton Camoro / markanton.camoro@cit.edu

Project Link: https://github.com/markstatic12/AcadeMeet.git
