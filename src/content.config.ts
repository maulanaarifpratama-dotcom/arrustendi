import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const base = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  draft: z.boolean().default(false)
});

export const collections = {
  berita: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/berita' }),
    schema: base
  }),
  artikel: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/artikel' }),
    schema: base.extend({ category: z.string().default('Sedekah & Wakaf'), author: z.string().default('Tim DKM Ar-Rustendi') })
  })
};
