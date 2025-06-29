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

### Test Account Format
*If not exists yet, create a new one following the below format*  
userName: GhibliN (N >= 2)  
email:    ghibliN@email.com  
password: ghibliFORUM
