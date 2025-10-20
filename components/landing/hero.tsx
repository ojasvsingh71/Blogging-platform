import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';

export function Hero() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-sky-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Share Your Stories
            <br />
            <span className="text-blue-600">Build Your Audience</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A modern, type-safe blogging platform built for creators who value simplicity,
            performance, and beautiful design. Start sharing your ideas today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/blog">
              <Button size="lg" className="text-lg px-8 py-6">
                Explore Blog <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Start Writing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
