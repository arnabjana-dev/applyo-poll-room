# Real-Time Poll Rooms - Arnab Jana

A minimal full-stack web application that allows users to create a poll, share it via a unique link, and collect votes with results updating in real time for all viewers.

Live Demo: <PUBLIC_URL_HERE>  
Repository: <GITHUB_URL_HERE>

---

## 🚀 Features

### 1. Poll Creation

- Create a poll with a question and at least 2 options.
- Generates a unique, shareable URL (`/poll/:pollId`).
- Poll data is persisted in the database.

---

### 2. Join by Link

- Anyone with the share link can view the poll.
- No authentication required.
- Each device can vote once per poll.

---

### 3. Real-Time Results

- Votes update instantly for all connected users.
- Implemented using WebSockets (Socket.IO).
- No page refresh required.

Flow:

1. User submits vote.
2. Backend stores vote in database.
3. Backend emits updated results to the poll room.
4. All connected clients receive the update.

---

### 4. Fairness / Anti-Abuse Mechanisms

Since the app does not use authentication, layered protections are implemented.

#### Mechanism 1 — Device-Based (Browser) Vote Uniqueness (Strict)

- When a user first visits the app, the server generates a signed `voter_token`.
- The token is stored as an HttpOnly, Secure cookie.
- The token is cryptographically signed (JWT-based).
- Each vote is stored with `(poll_id, voter_token)`.

A unique database constraint ensures:

UNIQUE (poll_id, voter_token)

This guarantees:

- One vote per device per poll.
- Race-condition safety at the database level.

Tampered tokens are rejected because the signature becomes invalid.

---

#### Mechanism 2 — IP-Based Rate Limiting (Soft Protection)

- IP-based rate limiting is applied to prevent automated abuse.
- Example: max 100 requests per minute per IP.
- This protects against bot attacks and rapid vote flooding.

Important:

- IP is NOT used as identity.
- It is only used to limit burst abuse.
- This avoids blocking legitimate users on shared networks (e.g., college WiFi).

---

### 5. Persistence

All data is stored in a relational database (PostgreSQL).

Tables:

- `polls`
- `options`
- `votes`

Votes are never stored in memory.

On page load:

- Poll details are fetched from DB.
- Vote counts are calculated from DB.
- If user already voted, UI reflects that state.

Data survives:

- Page refresh
- Server restart
- New user sessions

Database is the single source of truth.

---

### 6. Edge Cases Handled

- Poll creation with fewer than 2 options is rejected.
- Voting on a non-existent poll returns error.
- Duplicate vote attempts are rejected.
- WebSocket reconnection handled gracefully.
- Invalid or tampered `voter_token` rejected.

---

## 🏗 Architecture Overview

Frontend:

- React.js
- Socket.IO client

Backend:

- Node.js + Express
- Socket.IO
- JWT for signed voter tokens

Database:

- PostgreSQL

Deployment:

- Publicly accessible URL
- Backend and DB hosted separately

---

## ⚠ Known Limitations

1. Cookie Clearing
   - If a user clears browser cookies, they receive a new `voter_token`.
   - This allows them to vote again.
   - Without authentication, this cannot be fully prevented.

2. Shared Devices
   - Multiple users on the same device share the same `voter_token`.

3. IP-Based Protection is Soft
   - Rate limiting protects against burst attacks.
   - It does not prevent distributed attacks.
   - IP is not reliable identity due to NAT, VPN, and shared networks.

4. No User Accounts
   - No persistent identity across devices.
   - Voting is device-scoped, not user-scoped.

5. Poll Closing Not Implemented
   - Polls remain open indefinitely unless extended.

---

## 🔮 Possible Improvements

- Optional authentication for stronger fairness.
- Poll expiration / closing feature.
- CAPTCHA for additional abuse prevention.
- Advanced anomaly detection (pattern-based abuse detection).
- Redis adapter for horizontal WebSocket scaling.
- Admin dashboard for poll management.

---

## 📦 How to Run Locally

1. Clone repository
2. Install dependencies
3. Configure environment variables
4. Run backend and frontend
5. Open `http://localhost:<PORT>`

---

## 📄 License

For assignment submission purposes.
