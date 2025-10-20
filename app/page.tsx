import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Navigation } from "@/components/navigation";

export default function Home() {
  try {
    if (!process.env.DATABASE_URL) {
      console.log("Database url missing");
    } else {
      console.log("Database connected");
    }
  } catch (err) {
    console.log("DB Connection error", err);
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
