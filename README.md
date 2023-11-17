# Callforce.ai - Understand Calls with AI

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

To install all dependencies run: 
```bash
npm install
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


## Set Up Fastapi Worker

For the transcribing, summarising and embedding logic this app relies on this [Fastapi Worker](https://github.com/RocketDav1d/callforce-worker-backend)

## Set up env variables

For this App to work you have to create accounts for:
- [Supabase](https://supabase.com/)
- [Hubspot](https://developers.hubspot.de/)
- [Google Dev Console](https://console.cloud.google.com/)
- [AWS S3](https://aws.amazon.com/de/s3/)
- [OpenAI](https://openai.com/)
- [Stripe](https://stripe.com/de)
- [NextAuth](https://next-auth.js.org/)


## Project Structure
To get a better understading of the Project take a look at this [Relational Diagram](https://lucid.app/lucidspark/af4257ef-5473-496c-bd14-3463326e44ee/edit?invitationId=inv_0ebaa207-f1ed-4419-badb-0f3fb79022be&page=0_0#)


## Tech Stack

- Frontend: NextJS 13 with TypeScript
- Component Library: shadcn/ui, radix-ui, lucide-react
- Data Fetching: TanStack Query
- Backend: NextJS
- Worker Backend: Fastapi Python
- Database: Postgres Database using Prisma ORM
- Authentication: In the Frontend, using NextAuth
- Hosting: 
    - NextJS App hosted on Vercel
    - FastApi Worker hosted on Heroku
    - Postgres Database hosted on Supabase
    - chroma db instance hosted on AWS 


## Deploy on Vercel

The easiest way to deploy your own version of this app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
