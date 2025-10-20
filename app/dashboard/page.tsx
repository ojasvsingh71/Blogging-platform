"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/landing/footer";
import { trpc } from "@/lib/trpc/client";

export const dynamic = "force-dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Pencil, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardPage() {
  const { toast } = useToast();
  const { data: posts, isLoading, refetch } = trpc.posts.getAll.useQuery({});
  const deleteMutation = trpc.posts.delete.useMutation();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteMutation.mutateAsync({ id });

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const publishedPosts = posts?.filter((p) => p.published) || [];
  const draftPosts = posts?.filter((p) => !p.published) || [];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Dashboard</h1>
            <p className="text-xl text-blue-100">Manage your blog posts</p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl py-12">
          <div className="mb-8">
            <Link href="/dashboard/new">
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Published Posts ({publishedPosts.length})
                </h2>
                {publishedPosts.length > 0 ? (
                  <div className="grid gap-6">
                    {publishedPosts.map((post) => (
                      <Card key={post.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="default">Published</Badge>
                                {post.categories?.map(
                                  (category: { id: string; name: string }) => (
                                    <Badge
                                      key={category.id}
                                      variant="secondary"
                                    >
                                      {category.name}
                                    </Badge>
                                  )
                                )}
                              </div>
                              <CardTitle className="text-2xl">
                                {post.title}
                              </CardTitle>
                              <CardDescription className="mt-2">
                                By {post.authorName} •{" "}
                                {format(
                                  new Date(post.createdAt),
                                  "MMM d, yyyy"
                                )}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {post.excerpt ||
                              post.content.substring(0, 150) + "..."}
                          </p>
                          <div className="flex gap-2">
                            <Link href={`/blog/${post.slug}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </Link>
                            <Link href={`/dashboard/edit/${post.id}`}>
                              <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(post.id, post.title)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No published posts yet.</p>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Drafts ({draftPosts.length})
                </h2>
                {draftPosts.length > 0 ? (
                  <div className="grid gap-6">
                    {draftPosts.map((post) => (
                      <Card key={post.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">Draft</Badge>
                                {post.categories?.map(
                                  (category: { id: string; name: string }) => (
                                    <Badge
                                      key={category.id}
                                      variant="secondary"
                                    >
                                      {category.name}
                                    </Badge>
                                  )
                                )}
                              </div>
                              <CardTitle className="text-2xl">
                                {post.title}
                              </CardTitle>
                              <CardDescription className="mt-2">
                                By {post.authorName} •{" "}
                                {format(
                                  new Date(post.createdAt),
                                  "MMM d, yyyy"
                                )}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {post.excerpt ||
                              post.content.substring(0, 150) + "..."}
                          </p>
                          <div className="flex gap-2">
                            <Link href={`/dashboard/edit/${post.id}`}>
                              <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(post.id, post.title)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No drafts.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Toaster />
    </>
  );
}
