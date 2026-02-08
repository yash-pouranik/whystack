# WhyStack (Decision Memory System)

WhyStack is a system designed to capture, persist, and make searchable the reasoning ("WHY") behind GitHub Pull Requests. It ensures that engineering decisions are not lost over time and treats decisions as first-class entities tied to code changes.

## 🚀 Features
- **GitHub Integration**: Authenticate via GitHub and import repositories.
- **PR Tracking**: Automatically tracks Pull Requests via webhooks.
- **Decision Records**: Create structured decision records (What, Why, Options, Tradeoffs) linked to PRs.
- **Searchable History**: Query decisions by keywords, repository, author, or date.
- **Clean UI**: A modern interface built with React and Tailwind CSS.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router, Lucide React.
- **Backend**: Node.js, Express, Mongoose (MongoDB).
- **Authentication**: GitHub OAuth.
- **Database**: MongoDB.

## 📋 Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (Local instance or Atlas cluster)
- **GitHub OAuth App** (Client ID & Secret)

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yash-pouranik/whystack.git
cd whystack
```

### 2. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your credentials:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/whystack
   SESSION_SECRET=supersecretkey
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback
   GITHUB_WEBHOOK_SECRET=your_webhook_secret
   CLIENT_URL=http://localhost:5173
   ```

### 3. Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## 🏃‍♂️ Usage

### Running the Application

1. **Start the Backend Server**:
   Open a terminal in the `server` directory and run:
   ```bash
   npm start
   ```
   The server will start on port 5000 (or your configured port).

2. **Start the Frontend Development Server**:
   Open a new terminal in the `client` directory and run:
   ```bash
   npm run dev
   ```
   Access the application at `http://localhost:5173`.

### GitHub Configuration
To enable GitHub login and repo imports:
1. Go to **GitHub Developer Settings** > **OAuth Apps**.
2. Create a new OAuth App.
3. Set the **Authorization callback URL** to match your `GITHUB_CALLBACK_URL` (e.g., `http://localhost:5000/auth/github/callback`).
4. Copy the Client ID and Client Secret to your `.env` file.

To enable PR tracking:
1. Go to your repository settings on GitHub > **Webhooks**.
2. Add a new webhook pointing to your server's webhook endpoint (e.g., `https://your-domain.com/webhooks/github`).
3. Select `pull_request` events.
4. Set the secret to match `GITHUB_WEBHOOK_SECRET` in your `.env`.

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements.

## 📄 License
This project is licensed under the ISC License.
