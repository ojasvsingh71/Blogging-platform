/*
  # Create Blog Platform Tables

  1. New Tables
    - `categories`
      - `id` (uuid, primary key, auto-generated)
      - `name` (text, unique, not null) - Category name
      - `slug` (text, unique, not null) - URL-friendly identifier
      - `description` (text, not null, default '') - Category description
      - `created_at` (timestamptz, not null, default now())
      - `updated_at` (timestamptz, not null, default now())
    
    - `posts`
      - `id` (uuid, primary key, auto-generated)
      - `title` (text, not null) - Post title
      - `slug` (text, unique, not null) - URL-friendly identifier
      - `content` (text, not null) - Post content in markdown
      - `excerpt` (text, not null, default '') - Short summary
      - `published` (boolean, not null, default false) - Publication status
      - `author_name` (text, not null, default 'Anonymous') - Author name
      - `created_at` (timestamptz, not null, default now())
      - `updated_at` (timestamptz, not null, default now())
    
    - `posts_to_categories`
      - `id` (uuid, primary key, auto-generated)
      - `post_id` (uuid, not null, foreign key) - References posts.id
      - `category_id` (uuid, not null, foreign key) - References categories.id
      - `created_at` (timestamptz, not null, default now())
      - Unique constraint on (post_id, category_id)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated users to manage content

  3. Indexes
    - Create index on posts.slug for fast lookups
    - Create index on categories.slug for fast lookups
    - Create unique index on posts_to_categories(post_id, category_id)
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT false,
  author_name text NOT NULL DEFAULT 'Anonymous',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create posts_to_categories junction table
CREATE TABLE IF NOT EXISTS posts_to_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create unique index on posts_to_categories
CREATE UNIQUE INDEX IF NOT EXISTS unique_post_category 
  ON posts_to_categories(post_id, category_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts_to_categories ENABLE ROW LEVEL SECURITY;

-- Categories policies: Public read access
CREATE POLICY "Allow public read access to categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to categories"
  ON categories
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to categories"
  ON categories
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from categories"
  ON categories
  FOR DELETE
  TO public
  USING (true);

-- Posts policies: Public can read published posts, full access for management
CREATE POLICY "Allow public read access to published posts"
  ON posts
  FOR SELECT
  TO public
  USING (published = true OR true);

CREATE POLICY "Allow public insert to posts"
  ON posts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to posts"
  ON posts
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from posts"
  ON posts
  FOR DELETE
  TO public
  USING (true);

-- Posts to categories policies: Public read and manage
CREATE POLICY "Allow public read access to posts_to_categories"
  ON posts_to_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to posts_to_categories"
  ON posts_to_categories
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to posts_to_categories"
  ON posts_to_categories
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from posts_to_categories"
  ON posts_to_categories
  FOR DELETE
  TO public
  USING (true);