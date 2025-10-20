import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Navigation } from "@/components/navigation";

export default function Home() {

  if(!process.env.DATABASE_URL){
    console.log("Database url missing");
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
