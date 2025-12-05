💻 Local Installation Guide — Ledger App
🧱 Requirements

Before installing, make sure you have:

Tool	Version
Node.js	v18+ recommended
npm	Installed with Node
MongoDB	MongoDB Atlas or local MongoDB server
Git	Optional
📥 Clone Repository
git clone https://github.com/gnavneetsai41/Ledger.git
cd Ledger

🛠 Backend Installation
cd ledger-backend
npm install

Configure environment variables

Create a .env file inside ledger-backend:

MONGO_URI=your-mongodb-connection-url
PORT=5000

Start Backend Server
node server.js

If successful, output will show:
DB Connected
Running on port 5000


Backend API is available at:

http://localhost:5000/api

🎨 Frontend Installation

Open a new terminal window:

cd ledger-app
npm install

Setup API URL

Create a .env file inside ledger-app:

VITE_API_URL=http://localhost:5000/api

Start Frontend
npm run dev


After running, Vite will show something like:

http://localhost:5173


Open that in a browser — the app is ready 🎉

🧪 Testing Local Development
Service	URL
Frontend	http://localhost:5173

Backend	http://localhost:5000/api

Check API test	http://localhost:5000/api/person

If you see JSON response, backend works.
