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
| :------------------------- | :-------------------------------------------------------------- |
| **React (Vite)**           | Framework for building dynamic and component-based UIs.         |
| **JavaScript (ES6+)**      | The main programming language used for logic and interactivity. |
| **Tailwind CSS**           | Utility-first CSS framework for fast and responsive design.     |
| **Node.js (v22 LTS)**      | Runtime environment for development and dependency management.  |


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
or
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```
or
```bash
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

#### Method 2: Executable JAR

1.  First, build the project (if you haven't already): `./mvnw clean install` or `mvn clean install`
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


## Frontend (React + Vite) ⚛️

The **AcadeMeet Frontend** is built using **React** with **Vite** as the development environment.
It provides a fast, modular, and visually appealing interface for users to study collaboratively, share notes, and manage study groups seamlessly.

---

### Prerequisites

* **Node.js v22 LTS** (recommended)

---

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/<your-repo-url>.git
   cd AcadeMeet/frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   Once started, open your browser at:
   👉 [http://localhost:5173](http://localhost:5173)

4. **Build for production (if needed):**

   ```bash
   npm run build
   ```

   The optimized build will be located in the **`dist/`** folder.

5. **Preview the production build:**

   ```bash
   npm run preview
   ```

---

## Folder Structure 📁

```
frontend/
├── src/
│   ├── assets/         # Images, icons, and static files
│   ├── components/     # Reusable React components
│   ├── App.jsx         # Main application component
│   ├── index.css       # Tailwind CSS entry point
│   └── main.jsx        # Application entry file
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## Development Notes 💡

* Always create a **new branch** before starting a feature:

  ```bash
  git checkout -b feature/your-task-name
  ```
* After pulling updates, always run:

  ```bash
  npm install
  ```

  to sync new dependencies.
* Do **not** push `node_modules/` or `dist/` folders to GitHub.
* Tailwind is **pre-configured** — use utility classes directly in React components.
* The project is structured for future integration with the Spring Boot backend.


## Troubleshooting ⚙️

| Issue                                             | Fix                                                                                                                                         |
| :------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm error could not determine executable to run` | Uninstall Tailwind and reinstall version 3.4.13:<br>`npm uninstall tailwindcss`<br>`npm install -D tailwindcss@3.4.13 postcss autoprefixer` |
| `EBADENGINE` warning                              | Ensure Node.js version is **v20 LTS** (avoid v21).                                                                                          |
| Port already in use                               | Run `npx vite --port 5174` or close the previous dev server.                                                                                |
| CSS not applying                                  | Check `index.css` includes:<br>`@tailwind base; @tailwind components; @tailwind utilities;`                                                 |

## Contact 📧

- Zander Aligato - zander.aligato@cit.edu
- Richemmae Bigno - richemmae.bigno@cit.edu
- Mark Anton Camoro - markanton.camoro@cit.edu

Project Link: https://github.com/markstatic12/AcadeMeet.git

