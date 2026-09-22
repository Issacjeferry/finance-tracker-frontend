# Personal Finance Tracker - Modern Web Frontend

A responsive personal finance and wealth management dashboard built with **React**, featuring real-time financial analytics, pure SVG data visualization charts, hardened session management, and **Google OAuth 2.0** authentication.

---

## Key Features

- **Visual Financial Analytics**:
  - **4 Hero Metric Cards**: Real-time Total Income, Total Expenses, Net Balance, and Savings Rate target indicator.
  - **Category Expense Donut Chart**: Lightweight, pure SVG responsive donut chart showing category distribution with percentage breakdowns and an interactive legend.
  - **Cash Flow & Liquidity Bar**: Proportional comparison bar comparing income vs. expenses with net liquidity badge.
- **Transaction Management**:
  - Instant live search by title or notes.
  - Quick filter pills (**All**, **Expenses**, **Income**).
  - Category dropdown filter.
  - Multi-attribute sorting (Date newest/oldest, Amount high/low).
  - Safe delete confirmation modal preventing accidental data loss.
- **Production-Ready Authentication**:
  - **Google OAuth 2.0**: Integrated `@react-oauth/google` with Google Identity Services for 1-click passwordless login.
  - **Email & Password**: Clean forms with validation and show/hide password toggles.
  - **Smart Session Validation**: [ProtectedRoute.js](src/components/ProtectedRoute.js) decodes JWT expiration timestamps and actively checks `/auth/me` on mount.
  - **Global 401/403 Interceptor**: Automatically purges stale tokens and redirects expired sessions to login.
- **Modern UI & Toast Feedback**:
  - Non-intrusive floating toast notifications (Success, Error, Warning, Info).
  - Glassmorphic navigation header and modern typography using *Plus Jakarta Sans*.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Core UI Component Architecture |
| **React Router v7** | Client-Side Routing & Protected Routes |
| **Axios** | HTTP Client with Request/Response Interceptors |
| **@react-oauth/google** | Google Identity Services (GIS) Sign-In |
| **Lucide React** | Modern Vector Iconography |
| **Vanilla CSS** | Custom Design System, Glassmorphic Tokens, Responsive Grid |

---

## Project Structure

```
src/
├── api.js                           # Centralized Axios client with JWT & 401/403 auto-logout
├── App.js                           # Top-level router, providers & routes
├── components/
│   ├── Auth/
│   │   └── GoogleSignInButton.js   # Google OAuth button with fallback hints
│   ├── Charts/
│   │   ├── CashFlowChart.js        # Pure SVG income vs expense comparison bar
│   │   └── CategoryExpenseChart.js # Pure SVG interactive donut chart
│   ├── Toast/
│   │   └── ToastContext.js         # Lightweight toast notification provider
│   ├── Dashboard.js                # Hero metric cards & chart container
│   ├── ProtectedRoute.js           # Active session validator & redirect guard
│   ├── TransactionForm.js          # Add / edit transaction modal
│   └── TransactionList.js          # Main page with search, filters, table & header
├── pages/
│   ├── Login.js                    # Email & Google login page
│   └── Register.js                 # Registration page
├── services/
│   └── transactionService.js       # Transaction CRUD & unified summary API
├── index.css                        # Design system & resets
└── style.css                        # Complete theme, cards, forms & animations
```

---

## Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure your variables in `.env`:

```env
# Backend API URL (defaults to localhost:8080 in development)
REACT_APP_API_BASE_URL=http://localhost:8080

# Optional Google OAuth 2.0 Client ID (from Google Cloud Console)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

> **Note**: In Google Cloud Console under *Authorized JavaScript origins*, make sure to add `http://localhost:3000` and `http://localhost`.

---

## Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm start
```
The application will open in your browser at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized production bundle in the `build/` folder.
