'use client';

import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/landing/footer';
import { trpc } from '@/lib/trpc/client';

export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const { data: posts, isLoading: postsLoading } = trpc.posts.getAll.useQuery({
    published: true,
    categoryId: selectedCategory,
  });

  const { data: categories, isLoading: categoriesLoading } = trpc.categories.getAll.useQuery();

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-blue-100">
              Explore our latest articles and insights
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl py-12">
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Filter by Category</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === undefined ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(undefined)}
                size="sm"
              >
                All Posts
              </Button>
              {categoriesLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                categories?.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.id)}
                    size="sm"
                  >
                    {category.name}
                  </Button>
                ))
              )}
            </div>
          </div>

          {postsLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.categories?.map((category) => (
                        <Badge key={category.id} variant="secondary">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="text-2xl">{post.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm mt-2">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.authorName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt || post.content.substring(0, 150) + '...'}
                    </p>
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="ghost" className="group">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No posts found. Check back later!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
