# Urban Trace — Frontend (React + Vite)

## Setup & Run

```bash
cd Urban-Trace-main

# 1. Dependencies install karo
npm install

# 2. Development server start karo
npm run dev
```

Frontend `http://localhost:5173` pe chalega.

## Backend Connection

`src/service/api.ts` mein `BASE_URL` already `http://127.0.0.1:8000/api` set hai.
Backend pehle start karo, phir frontend.

## Fixes Applied

1. `src/types/issue.ts` — `latitude`/`longitude` backend fields se match
2. `src/data/mockIssues.ts` — `lat`/`lng` → `latitude`/`longitude` fix
3. `src/components/map/IssueMap.tsx` — `latitude`/`longitude` support + `lat`/`lng` fallback
4. `src/service/api.ts` — `createIssue`, `updateIssueStatus`, `deleteIssue`, `getDashboardStats` added
5. `src/features/citizen/IssueReportForm.tsx` — `createIssue` API use karta hai
6. `src/features/citizen/CitizenPortal.tsx` — backend se real issues load karta hai
