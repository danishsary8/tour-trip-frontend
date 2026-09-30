# TourTrip

TourTrip is a Cambodia-focused tour booking frontend for guests, customers, and administrators. The current milestone establishes the Admin foundation and a polished mock-authenticated login flow while the future Laravel REST API is being designed.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Open `http://localhost:5173/login` and use:

```text
Email: admin@tourtrip.com
Password: Admin@123
OTP: 123456
```

## Quality checks

```bash
npm run lint
npm run build
```

Project conventions, architecture, design rules, and team workflow are documented in [AGENTS.md](./AGENTS.md). Task history and handoff notes live in [docs/WORKLOG.md](./docs/WORKLOG.md).
