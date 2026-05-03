# Fruit Shop Backend

This backend uses FastAPI and PostgreSQL to store orders and contact form messages.

## Setup

1. Install Python packages:
   ```bash
   cd "h:\website demo\backend"
   python -m pip install -r requirements.txt
   ```

2. Create a PostgreSQL database:
   - Database name: `nila_fruit`
   - Username/password: `postgres` / `postgres` (or update `.env`)

3. Copy `.env.example` to `.env` and update the `DATABASE_URL` if needed.

4. Run the backend server from the project root (`h:\website demo`):
   ```bash
   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
   ```

   If you are inside the `backend` folder, run instead:
   ```bash
   python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

- `POST /api/orders` — save a new order
- `POST /api/contact` — save a contact message
- `GET /api/orders` — list orders
- `GET /api/contact` — list contact messages

## Notes

- The frontend now sends order and contact data to `http://localhost:8000/api`.
- If the backend is unavailable, the website still stores a local fallback copy in browser storage.
