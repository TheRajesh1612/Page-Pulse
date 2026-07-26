# Page Pulse

A production-grade URL Audit Service.

**Live Frontend Demo**: [https://page-pulseaudit.vercel.app](https://page-pulseaudit.vercel.app/)  
**Live Backend API**: [https://page-pulse-p0nm.onrender.com](https://page-pulse-p0nm.onrender.com)

## Features

- **Input Validation**: Validates protocol and URL structure.
- **Request Timeouts**: Prevents hanging on slow sites.
- **Concurrency Limits**: Protects the server from excessive parallel tasks.
- **Structured Error Responses**: Consistent JSON format for all errors.
- **Caching**: Caches audit results to speed up identical requests.
- **Rate Limiting**: Limits requests per client (IP) to prevent abuse.
- **Structured Logging with Request IDs**: Every log is tagged with a unique Request ID for traceability.
- **CI/CD Ready**: GitHub Actions configured.

## Project Structure

- `client/`: Frontend React application (Vite)
- `server/`: Backend Express API service
- `.github/`: CI/CD workflows

## Setup & Local Development

### 1. Server Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Client Setup
1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm run dev
   ```

## Live Deployment

The project is deployed using two separate platforms:

### Client (Frontend) - Vercel
1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import the GitHub repository.
4. Set the Root Directory to `client`.
5. Framework preset should be automatically detected as Vite.
6. Deploy to get your live URL!

### Server (Backend) - Render
1. Push this repository to GitHub.
2. Go to [Render.com](https://render.com/).
3. Create a new "Web Service" and connect your GitHub repository.
4. Set the Root Directory to `server`.
5. Set the Build Command to `npm install` and the Start Command to `npm run start` or `node index.js`.
6. Add necessary environment variables (e.g. `PORT`).
7. Deploy to get your live API URL!

## API Documentation

### POST `/api/v1/audit`

Audits a given URL.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "cached": false,
  "data": {
    "url": "https://example.com",
    "statusCode": 200,
    "responseTimeMs": 145,
    "seo": {
      "title": "Example Domain",
      "description": null,
      "hasTitle": true,
      "hasDescription": false
    },
    "auditedAt": "2023-10-24T12:00:00Z"
  }
}
```

---

# Architecture Document (Task B)

Task B of the assignment requires designing the system for scale (10,000 audits/day with bursts of up to 500 concurrent requests).

Please see the dedicated **[ARCHITECTURE.md](./ARCHITECTURE.md)** file for the complete:
- System Architecture Diagram
- Technology Decision Record (ADR)
- Failure Mode Analysis
- Observability and Rollback Plan
