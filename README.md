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
# sync schema and db (from root)
npx prisma db push

# generate prisma client (from root)
npx prisma generate
```

### Test Account
userName: AmonN (N >= 2)
email:    amonN@email.com
password: Amon1103