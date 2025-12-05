💼Simple Ledger Management System
This repository contains the complete stack for the Simple Ledger Management System, designed for
business owners to manage customer receivables and supplier payables.
The application uses a MERN-like stack ( MongoDB + Express + React / Vite + Node.js ).
🧱 Requirements
Before you begin, ensure you have the following tools installed on your system:
Tool Version Purpose
Node.js v18+ JavaScript runtime environment.
npm Latest Package manager for Node.js.
MongoDB N/A Database (Atlas cloud service or local server).
📥Getting Started
1. Clone the Repository
Clone the project to your local machine and navigate into the directory:
git clone [https://github.com/gnavneetsai41/Ledger.git](https://github.com/gnavneetsai4
cd Ledger
🛠 Backend Setup (Node.js/Express)
The backend handles the data storage, business logic (calculating balances), and API endpoints.
2. Install Backend Dependencies
Navigate to the backend directory and install the necessary packages (Express, Mongoose, dotenv,
etc.):
cd ledger-backend
npm install
3. Configure Environment Variables
Create a file named .env in the ledger-backend directory and add your MongoDB connection string
and port:
# .env file in ledger-backend/
# Replace this with your connection string (local or MongoDB Atlas)
MONGO_URI="your-mongodb-connection-url"
# Port the server will listen on
PORT=5000
4. Start the Backend Server
Execute the server.js file to start the API:
node server.js
If successful, the output will show:
DB Connected successfully
Running on port 5000
🎨 Frontend Setup (React/Vite)
The frontend is a React application built with Vite, providing a clean, minimalist dashboard.
5. Install Frontend Dependencies
Open a new terminal window, navigate to the frontend directory, and install its dependencies:
cd ../ledger-app
npm install
6. Setup API URL
Create a file named .env in the ledger-app directory. This tells the React app where to find the
backend API.
# .env file in ledger-app/
# VITE_ prefix is required for environment variables exposed to the browser via Vite
VITE_API_URL=http://localhost:5000/api
7. Start the Frontend Application
Run the Vite development server:
npm run dev
The output will show the local address, typically http://localhost:5173/ . Open this URL in your
browser.
🧪Testing Local Development
After both servers are running, you can test connectivity:
Service Address Expected Outcome
Frontend App http://localhost:5173/ The Ledger Dashboard UI loads.
Backend API
Check
http://localhost:5000/api/person A JSON array [] (if empty) or a list of
person objects is returned
