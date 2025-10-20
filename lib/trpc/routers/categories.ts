import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { categories } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional().default(''),
});

const updateCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
});

export const categoriesRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(categories)
      .orderBy(categories.name);
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [category] = await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.slug, input.slug))
        .limit(1);

      if (!category) {
        throw new Error('Category not found');
      }

      return category;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [category] = await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.id, input.id))
        .limit(1);

      if (!category) {
        throw new Error('Category not found');
      }

      return category;
    }),

  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const [newCategory] = await ctx.db
        .insert(categories)
        .values({
          ...input,
          updatedAt: new Date(),
        })
        .returning();

      return newCategory;
    }),

  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const [updatedCategory] = await ctx.db
        .update(categories)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(categories.id, id))
        .returning();

      if (!updatedCategory) {
        throw new Error('Category not found');
      }

      return updatedCategory;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});
