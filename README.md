# **Samahan Backend**

[Link for Documentation](DOCS.md)

### Tools that needs to be installed:

- Docker (https://docs.docker.com/desktop/install/windows-install/)
- Node (https://nodejs.org/en/download)
- NestJS CLI (https://docs.nestjs.com/cli/overview)
- VS Code (https://code.visualstudio.com/)

### Tech Stack

- [NestJS](https://nestjs.com/) - Back-end Framework
- [Prisma](https://www.prisma.io/) - Object Relational Mapping (ORM) Tool
- [Supabase](https://supabase.com/docs) - Database, Storage and Authentication Provider
- [PostgreSQL](https://www.postgresql.org/) - Database Management System
- [Docker](https://www.docker.com/) - Containerization Tool
- [Git](https://git-scm.com/)/[Github](https://github.com/) - Version Control
`
### Setting up your application

1. Clone the Repository:

```bash
git clone https://github.com/SAMAHAN-Systems-Development/samahan-all-for-more-backend.git
```

2. Fetch the updates:

```bash
git fetch
```

3. Switch to the branch of your ticket, for example:

```bash
git checkout 3-add-category
```

4. Install the libraries with this command:

```bash
npm i
```

5. Install and create the docker containers with this command (make sure that you already started your docker application):

```bash
npx supabase start
```

6. Generation of Jwt secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

7. Duplicate the `.env.example` file and rename it to `.env.`

You can accomplish this manually or run this command:

```
For Windows:
copy .env.example .env

For Linux:
cp .env.example .env
```

8. Update the database by the Prisma migrations with these commands:

```bash
npm run prisma:migrate:reset
```

```bash
npx prisma generate
```

### Running your application

If you just turned your pc on and you want to start the application, run the following commands:

1. Pull from the main

```bash
git pull origin main
```

2. Install the libraries

```bash
npm i
```

3. Run the docker containers (make sure that you already started your docker application)

```bash
npx supabase start
```

Note the `service role key` and set the value of `supabase_key` in your .env file to the value of the service role key.

4. Run the NestJS backend

```bash
npm run start
```

- 📌 After you finish programming, run this command to stop the docker containers:

  ```bash
  npx supabase stop
  ```
