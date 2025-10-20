'use client';

import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/landing/footer';
import { PostEditor } from '@/components/post-editor';
import { Toaster } from '@/components/ui/toaster';
import { useParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function EditPostPage() {
  const params = useParams();
  const postId = params.id as string;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <PostEditor postId={postId} />
        </div>
      </main>
      <Footer />
      <Toaster />
    </>
  );
}
