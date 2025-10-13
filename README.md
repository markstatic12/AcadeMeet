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

      * **Create the Database:** Using **MySQL Workbench** or your preferred tool, create a new database named **`academeet_db`**.
      * **Create Local Config File:** Navigate to `backend/src/main/resources/` and create a new file named **`application-local.properties`**. (This file is ignored by Git).

3.  **Configure Local Credentials (Crucial for Collaboration):**

      * Edit your new **`application-local.properties`** file with your **unique MySQL username and password**.
      * **Do not commit this file.**

    <!-- end list -->

    ```properties
    # ----------------------------------------
    # LOCAL DEVELOPMENT ONLY: ENTER YOUR UNIQUE CREDENTIALS
    # This file overrides the default credentials in application.properties
    # ----------------------------------------
    spring.datasource.url=jdbc:mysql://localhost:3306/academeet_db?serverTimezone=UTC
    spring.datasource.username=YOUR_UNIQUE_USERNAME_HERE
    spring.datasource.password=YOUR_UNIQUE_PASSWORD_HERE
    spring.jpa.hibernate.ddl-auto=update
    ```

-----

### Running the Backend (Spring Boot)

Navigate to the backend directory (`cd backend`). You have three ways to run the application, but you **must** activate the **`local` profile** for your private credentials to be used:

#### Method 1: Maven Wrapper (Easiest CLI)

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

#### Method 2: Executable JAR

1.  First, build the project (if you haven't already): `./mvnw clean install`
2.  Then, run the JAR, specifying the active profile:
    ```bash
    java -jar target/academeet-0.0.1-SNAPSHOT.jar --spring.profiles.active=local
    ```

#### Method 3: Integrated Development Environment (IDE)

1.  Open the project in your IDE (IntelliJ, VS Code, etc.).
2.  Locate the main class (e.g., `AcadeMeetApplication.java`).
3.  In the run/debug configuration settings, set the **Active Profiles** parameter to `local`.
4.  Run the application.

-----

### Running the Frontend (React)

Open a **new terminal** and navigate to the frontend directory:

1.  Install dependencies:
    ```bash
    npm install
    # OR
    yarn install
    ```
2.  Start the development server:
    ```bash
    npm start
    # OR
    yarn start
    ```

The frontend will typically open in your browser at `http://localhost:3000`.

## Contact 📧

- Zander Aligato - zander.aligato@cit.edu
- Richemmae Bigno - richemmae.bigno@cit.edu
- Mark Anton Camoro - markanton.camoro@cit.edu

Project Link: https://github.com/markstatic12/AcadeMeet.git

