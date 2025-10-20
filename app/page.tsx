import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Navigation } from "@/components/navigation";
import { db } from "@/lib/db";

export default async function Home() {
  try {
    const posts = await db.select().from(db.schema.posts).limit(1);
    console.log("Database connected:", posts.length, "posts found");
  } catch (err) {
    console.error("DB connection error:", err);
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        <Features />
      </main>
      <Footer />
    </>
  );
}
