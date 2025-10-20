"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/landing/footer";
import { trpc } from "@/lib/trpc/client";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Loader2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const {
    data: post,
    isLoading,
    error,
  } = trpc.posts.getBySlug.useQuery({ slug });

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="container mx-auto px-4 max-w-4xl py-20 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Post Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The post you're looking for doesn't exist.
            </p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        ) : post ? (
          <>
            <div className="bg-white border-b">
              <div className="container mx-auto px-4 max-w-4xl py-12">
                <Link href="/blog">
                  <Button variant="ghost" size="sm" className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                  </Button>
                </Link>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories?.map(
                    (category: { id: string; name: string }) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    )
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {post.title}
                </h1>

                <div className="flex items-center gap-6 text-gray-600">
                  <span className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {post.authorName}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {format(new Date(post.createdAt), "MMMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl py-12">
              <article className="prose prose-lg max-w-none">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </article>
            </div>
          </>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
