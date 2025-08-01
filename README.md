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
# execute below commands from /server directory (easiest)

# migrate changes to db
npx prisma migrate dev --name "change-description"

# create custom migration
npx prisma migrate dev --create-only --name "change-description"
# edit the migration file (server/prisma/migrations/timestamp_name/migration.sql)
npx prisma migrate dev

# -----------------------
# (for prototyping, this will not create migration script)
# sync schema and db
npx prisma db push

# generate prisma client
npx prisma generate
# -----------------------

# inspect the database
npx prisma studio
```

### Test Account Format
*If not exists yet, create a new one following the below format*  
userName: GhibliN (N >= 2)  
email:    ghibliN@email.com  
password: ghibliFORUM
