# Personal Finance Tracker

A responsive React dashboard for tracking income and expenses.

## Run locally

```bash
npm install
npm start
```

Create a `.env.local` file when the API is not using the default deployment:

```bash
REACT_APP_API_URL=http://localhost:8080
```

## Production build

```bash
npm run build
```

The dashboard derives income, expense, and balance from the transaction response, so a refresh uses one API request instead of three summary requests. It also includes responsive cards, transaction search and type filters, loading and empty states, inline form errors, and automatic logout on an expired token.

## Recommended next improvements

1. Move the backend JWT signing key and database password to Render environment variables, then rotate the currently committed secrets.
2. Add server-side pagination and filtering once a user has several hundred transactions.
3. Add integration tests for authentication, user ownership, and transaction CRUD before adding imports or recurring transactions.
4. Replace `Double` amounts with `BigDecimal` in the backend to avoid floating-point rounding issues in financial totals.
