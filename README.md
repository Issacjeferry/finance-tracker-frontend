# FinSight — Personal Finance Intelligence (Frontend)

FinSight is a responsive React finance workspace that goes beyond CRUD. It combines transaction management, explainable financial-health scoring, anomaly detection, forecasting, goal planning, recurring commitments, an affordability simulator, Google OAuth, and a role-aware administration console.

## Portfolio highlights

- Explainable 100-point financial health score with factor-by-factor evidence
- Six-month cash-flow projection and statistically unusual-expense detection
- “Can I afford it?” what-if simulator
- Monthly budgets, savings goals with progress, and recurring payment planning
- Searchable/filterable transaction management with SVG analytics
- JWT and Google sign-in, protected routes, expiration handling, and role-aware UI
- Responsive administration dashboard for account, role, status and usage management
- Reusable finance calculation utilities with Jest tests

## Stack

React 19, React Router, Axios, Google Identity Services, Lucide icons, custom responsive CSS, Jest and Testing Library.

## Local setup

```powershell
Copy-Item .env.example .env
npm install
npm start
```

The app runs at `http://localhost:3000`. Configure the backend first and set `REACT_APP_API_BASE_URL` when it is not running on port 8080.

To enable Google sign-in, provide a web client ID in `REACT_APP_GOOGLE_CLIENT_ID` and register `http://localhost:3000` as an authorized JavaScript origin.

## Quality checks

```powershell
npm test -- --watchAll=false
npm run build
```

## Main modules

```text
src/components/
├── AdminDashboard.js          RBAC administration console
├── IntelligenceDashboard.js   score, forecast, anomalies and simulator
├── PlanningWorkspace.js       budgets, goals and recurring payments
├── TransactionList.js         application shell and transaction workspace
├── TransactionForm.js         validated add/edit flow
└── Charts/                     dependency-free SVG analytics
```

The API implementation is maintained in the companion `finance-tracker-backend` repository.
