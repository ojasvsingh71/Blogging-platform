# Modern Blog Platform

A full-stack blog platform built with Next.js 13+, tRPC, Drizzle ORM, and PostgreSQL. Features a modern stack with type-safety across the full application, from database to frontend.

## Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **API**: tRPC for end-to-end type safety
- **Database**: PostgreSQL (via Neon.tech)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: (Coming soon)

## Features

- 📝 Create, edit, and delete blog posts
- 🏷️ Category management
- 🎨 Rich text editor for content
- 📱 Responsive design
- 🔍 SEO-friendly with static generation
- 🚀 Fast page loads with Next.js App Router
- 🔒 Type-safe API calls with tRPC
- 📊 Dashboard for content management

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- PostgreSQL database (we recommend Neon.tech)
- npm or yarn

### Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/ojasvsingh71/Blogging-platform.git
   cd Blogging-platform
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://username:password@host:port/database"
   ```

4. Run database migrations:

   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see your application.

## Project Structure

```
├── app/                 # Next.js App Router pages
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   └── landing/       # Landing page components
├── lib/               # Utility functions and configurations
│   ├── db/           # Database configuration and schema
│   └── trpc/         # tRPC setup and routers
└── public/           # Static files
```

## Database Schema

The application uses a PostgreSQL database with the following main tables:

- `posts`: Blog post content and metadata
- `categories`: Post categories
- `posts_to_categories`: Many-to-many relationship table

All tables use UUID primary keys for better scalability and security.

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run db:push`: Push schema changes to database
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [tRPC](https://trpc.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
