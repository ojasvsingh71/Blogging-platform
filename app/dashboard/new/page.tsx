'use client';

import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/landing/footer';
import { PostEditor } from '@/components/post-editor';
import { Toaster } from '@/components/ui/toaster';

export const dynamic = 'force-dynamic';

export default function NewPostPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <PostEditor />
        </div>
      </main>
      <Footer />
      <Toaster />
    </>
  );
}
