# WhyStack

WhyStack is a "Decision Memory" system that captures the **WHY** behind code changes. It integrates with GitHub to track Pull Requests and allows developers to document design decisions, alternatives considered, and tradeoffs for each PR.

## Features
- **GitHub Auth**: Secure login via GitHub OAuth.
- **Repository Import**: Import any of your GitHub repositories to track.
- **PR Tracking**: Automatically tracks PRs (Open, Merged, Closed) via Webhooks (`idempotent`).
- **Decision Records**: Store structured decisions (What, Why, Options, Tradeoffs).
- **Search**: Full-text search for decisions by keyword, author, or repository.
- **Access Control**: Only PR authors, Repo owners, or Collaborators can document decisions.

## Setup

1. **Install Dependencies**
   Navigate to the server directory:
   ```bash
   cd server
   npm install
   ```

2. **Configuration**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/whystack
   SESSION_SECRET=your_secure_random_string
   
   # GitHub OAuth App
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback
   
   # GitHub Webhooks
   GITHUB_WEBHOOK_SECRET=your_webhook_secret
   
   CLIENT_URL=http://localhost:3000
   ```

3. **Running the Server**
   ```bash
   npm start
   ```

## API Endpoints

### Auth
- `GET /auth/github`: Login with GitHub
- `GET /auth/me`: Get current user session

### Projects
- `GET /projects/github`: List your GitHub repos
- `POST /projects/import`: Import a repo `{ githubRepoId, name, owner, visibility }`
- `GET /projects`: List imported projects

### Decisions
- `POST /decisions/:pullRequestId`: Create/Update decision
- `GET /decisions/:pullRequestId`: Get decision for a PR
- `GET /decisions?q=searchterm`: Search decisions

### Webhooks
- `POST /webhooks/github`: Endpoint for GitHub `pull_request` events.
