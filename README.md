## Project Setup
OS: macOS

### Main Program
```bash
# Run the development server:
npm run dev
```

→ Open [http://localhost:3000](http://localhost:3000) with your browser.

### PostgreSQL
```bash
# Start the local PostgreSQL server
brew services start postgresql

# Stop the local PostgreSQL server
brew services stop postgresql
```

### Prisma
```bash
# initialize prisma (from `server/`)
npx prisma init

# sync schema and db (from `server/`)
npx prisma db psh

# generate prisma client (from root)
npm run prisma:generate
```