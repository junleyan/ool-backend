# Hawaii Open Data Explorer

This project is a Next.js web application designed to simplify and enhance the discovery and analysis of publicly accessible government agency data.

Deployed Application: https://ool-frontend.vercel.app

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/HACC2024/Otter-Overlords.git
   ```
---
2. **Run the Frontend Application**

   Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

   **Install Dependencies**

   Run the following command to install the required dependencies:

   ```bash
   npm install
   ```

   **Add Environment File**

   Create a `.env` file in the current directory and add the following line:

   ```
   NEXT_PUBLIC_API_URL=<API_URL>
   ```

   **Run the Application in Development Mode**

   To start the development server, run:

   ```bash
   npm run dev
   ```

   This command will start the application, and it will be accessible at `http://localhost:3000`.

   **Build the Application for Production**

   If you want to build the application for production, run:

   ```bash
   npm run build
   ```

   After building, you can start the production server with:

   ```bash
   npm run start
   ```

   This will start the production server, and the application will be accessible at `http://localhost:3000`.
---
3. **Run the Backend Node.js Application**

   Navigate to the server directory in the root of the project:

   ```bash
   cd backend
   ```

   **Install Dependencies**

   Run the following command to install the required dependencies for the server:

   ```bash
   npm install
   ```

   **Add Environment File**

   Create a `.env` file in the backend directory and add the required environment variables. Example:

   ```
   OPENAI_API_KEY=<OPENAI_API_KEY>
   ```

   **Run the Backend Server**

   To start the backend server, run:

   ```bash
   npm run start
   ```

   This will start the backend server, and it will be accessible at `http://localhost:8000`.

