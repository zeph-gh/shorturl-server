# ShortURL Server

A Express.js backend for the URL shortening service.

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/zeph-gh/shorturl-server.git
   cd shorturl-server
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add your database connection string:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/shorturl_db"
   ```

   Replace with your actual PostgreSQL database credentials.

4. **Database Setup:**

   - Ensure PostgreSQL is running
   - Generate Prisma client:
     ```bash
     npx prisma generate
     ```

5. **Start the server:**
   ```bash
   pnpm dev
   ```

The server will run on `http://localhost:3000`.

## API Endpoints

- `POST /api/shorten` - Shorten a URL

  - Body: `{ "url": "https://example.com" }`
  - Response: `{ "shortUrl": "http://localhost:3000/abc123" }`

- `GET /:code` - Redirect to original URL
  - Example: `http://localhost:3000/abc123` redirects to the original URL

## Frontend Client

To use the full URL shortening service with a user interface, you can also run the [ShortURL Client](https://github.com/zeph-gh/shorturl-client):

```bash
git clone https://github.com/zeph-gh/shorturl-client.git
cd shorturl-client
pnpm install
pnpm dev
```

The client will run on `http://localhost:3001` and connect to this server.
