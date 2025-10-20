import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { posts, postsToCategories, categories } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional().default(''),
  published: z.boolean().default(false),
  authorName: z.string().default('Anonymous'),
  categoryIds: z.array(z.string().uuid()).optional().default([]),
});

const updatePostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  published: z.boolean().optional(),
  authorName: z.string().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
});

export const postsRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        published: z.boolean().optional(),
        categoryId: z.string().uuid().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];

      if (input?.published !== undefined) {
        conditions.push(eq(posts.published, input.published));
      }

      let query = ctx.db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          content: posts.content,
          excerpt: posts.excerpt,
          published: posts.published,
          authorName: posts.authorName,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
        })
        .from(posts);

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }

      const allPosts = await query.orderBy(desc(posts.createdAt));

      if (input?.categoryId) {
        const postIdsInCategory = await ctx.db
          .select({ postId: postsToCategories.postId })
          .from(postsToCategories)
          .where(eq(postsToCategories.categoryId, input.categoryId));

        const postIds = postIdsInCategory.map((p) => p.postId);
        const filteredPosts = allPosts.filter((post) => postIds.includes(post.id));

        const postsWithCategories = await Promise.all(
          filteredPosts.map(async (post) => {
            const postCategories = await ctx.db
              .select({
                id: categories.id,
                name: categories.name,
                slug: categories.slug,
              })
              .from(postsToCategories)
              .innerJoin(categories, eq(postsToCategories.categoryId, categories.id))
              .where(eq(postsToCategories.postId, post.id));

            return {
              ...post,
              categories: postCategories,
            };
          })
        );

        return postsWithCategories;
      }

      const postsWithCategories = await Promise.all(
        allPosts.map(async (post) => {
          const postCategories = await ctx.db
            .select({
              id: categories.id,
              name: categories.name,
              slug: categories.slug,
            })
            .from(postsToCategories)
            .innerJoin(categories, eq(postsToCategories.categoryId, categories.id))
            .where(eq(postsToCategories.postId, post.id));

          return {
            ...post,
            categories: postCategories,
          };
        })
      );

      return postsWithCategories;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.slug, input.slug))
        .limit(1);

      if (!post) {
        throw new Error('Post not found');
      }

      const postCategories = await ctx.db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        })
        .from(postsToCategories)
        .innerJoin(categories, eq(postsToCategories.categoryId, categories.id))
        .where(eq(postsToCategories.postId, post.id));

      return {
        ...post,
        categories: postCategories,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1);

      if (!post) {
        throw new Error('Post not found');
      }

      const postCategories = await ctx.db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        })
        .from(postsToCategories)
        .innerJoin(categories, eq(postsToCategories.categoryId, categories.id))
        .where(eq(postsToCategories.postId, post.id));

      return {
        ...post,
        categories: postCategories,
      };
    }),

  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { categoryIds, ...postData } = input;

      const [newPost] = await ctx.db
        .insert(posts)
        .values({
          ...postData,
          updatedAt: new Date(),
        })
        .returning();

      if (categoryIds && categoryIds.length > 0) {
        await ctx.db.insert(postsToCategories).values(
          categoryIds.map((categoryId) => ({
            postId: newPost.id,
            categoryId,
          }))
        );
      }

      return newPost;
    }),

  update: publicProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, categoryIds, ...updateData } = input;

      const [updatedPost] = await ctx.db
        .update(posts)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, id))
        .returning();

      if (!updatedPost) {
        throw new Error('Post not found');
      }

      if (categoryIds !== undefined) {
        await ctx.db
          .delete(postsToCategories)
          .where(eq(postsToCategories.postId, id));

        if (categoryIds.length > 0) {
          await ctx.db.insert(postsToCategories).values(
            categoryIds.map((categoryId) => ({
              postId: id,
              categoryId,
            }))
          );
        }
      }

      return updatedPost;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(posts).where(eq(posts.id, input.id));
      return { success: true };
    }),
});
