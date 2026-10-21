Sukhanak

A specialized digital publishing platform dedicated to Urdu literature and prose, designed with an interface and functionality inspired by Medium.

Technology Stack

· Frontend Framework: Next.js (App Router) and React
· Backend Services: Firebase (Authentication, Firestore, Cloud Storage)
· Deployment & Hosting: Vercel

System Requirements

· Node.js: Version 22 or higher is strictly required (mandatory prerequisite for the Firebase Admin SDK).

Local Development Setup

To initialize and run the project locally, follow these steps:

```bash
# Install project dependencies
npm install

# Create local environment variables file
cp .env.example .env.local
# Note: Populate the .env.local file with your respective Firebase credentials before proceeding.

# Start the development server
npm run dev