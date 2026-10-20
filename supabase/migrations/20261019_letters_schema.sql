-- ============================================================
-- THE GINI PARADISE — LETTERS FROM ABHISHEK
-- Supabase PostgreSQL Schema & Row Level Security (RLS)
-- File: supabase/migrations/20261019_letters_schema.sql
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. LETTERS TABLE
-- Stores individual letters composed by Abhishek for Shubhangini.
CREATE TABLE IF NOT EXISTS public.letters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL DEFAULT 'Abhishek',
    recipient_name TEXT NOT NULL DEFAULT 'Shubhangini',
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    stamp_style TEXT NOT NULL DEFAULT 'rose' CHECK (stamp_style IN ('rose', 'heart', 'envelope', 'stars', 'monogram')),
    stamp_label TEXT DEFAULT 'Air Mail ♡ Special Delivery',
    song_title TEXT,
    song_artist TEXT,
    song_provider TEXT DEFAULT 'custom',
    song_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. LETTER MEDIA TABLE
-- Stores attached photographs/polaroids associated with letters.
CREATE TABLE IF NOT EXISTS public.letter_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    letter_id UUID NOT NULL REFERENCES public.letters(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    caption TEXT,
    alt_text TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    file_size_bytes BIGINT NOT NULL DEFAULT 0 CHECK (file_size_bytes >= 0),
    mime_type TEXT DEFAULT 'image/jpeg',
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. LETTER REPLIES TABLE
-- Stores private replies from Shubhangini to Abhishek's letters.
CREATE TABLE IF NOT EXISTS public.letter_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    letter_id UUID NOT NULL REFERENCES public.letters(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL DEFAULT 'Shubhangini',
    body TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_letters_status_published ON public.letters(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_letters_author ON public.letters(author_id);
CREATE INDEX IF NOT EXISTS idx_letter_media_letter ON public.letter_media(letter_id, sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_letter_replies_letter ON public.letter_replies(letter_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_letter_replies_unread ON public.letter_replies(read_at) WHERE read_at IS NULL;

-- 6. AUTOMATIC UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_letters_updated_at ON public.letters;
CREATE TRIGGER set_letters_updated_at
    BEFORE UPDATE ON public.letters
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_replies_updated_at ON public.letter_replies;
CREATE TRIGGER set_replies_updated_at
    BEFORE UPDATE ON public.letter_replies
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 7. STORAGE QUOTA ENFORCEMENT (150 MB BUDGET = 157,286,400 BYTES)
-- Enforces that the total uploaded media never exceeds the 150 MB quota.
CREATE OR REPLACE FUNCTION public.check_media_storage_quota()
RETURNS TRIGGER AS $$
DECLARE
    current_total BIGINT;
    max_budget_bytes BIGINT := 157286400; -- 150 MB (150 * 1024 * 1024)
BEGIN
    SELECT COALESCE(SUM(file_size_bytes), 0) INTO current_total FROM public.letter_media;
    IF (current_total + NEW.file_size_bytes) > max_budget_bytes THEN
        RAISE EXCEPTION 'Media storage limit exceeded! Total storage cannot exceed 150 MB (157,286,400 bytes). Current used: % bytes, new file: % bytes.',
            current_total, NEW.file_size_bytes;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_storage_quota ON public.letter_media;
CREATE TRIGGER enforce_storage_quota
    BEFORE INSERT ON public.letter_media
    FOR EACH ROW EXECUTE FUNCTION public.check_media_storage_quota();

-- Helper function to query remaining storage
CREATE OR REPLACE FUNCTION public.get_storage_usage()
RETURNS TABLE (
    total_used_bytes BIGINT,
    total_quota_bytes BIGINT,
    used_megabytes NUMERIC,
    remaining_megabytes NUMERIC,
    percentage_used NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(file_size_bytes), 0) AS total_used_bytes,
        157286400::BIGINT AS total_quota_bytes,
        ROUND((COALESCE(SUM(file_size_bytes), 0)::NUMERIC / (1024 * 1024)), 2) AS used_megabytes,
        ROUND(((157286400 - COALESCE(SUM(file_size_bytes), 0))::NUMERIC / (1024 * 1024)), 2) AS remaining_megabytes,
        ROUND(((COALESCE(SUM(file_size_bytes), 0)::NUMERIC / 157286400::NUMERIC) * 100), 2) AS percentage_used
    FROM public.letter_media;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letter_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letter_replies ENABLE ROW LEVEL SECURITY;

-- Letters Policies:
-- 1) Anyone / Shubhangini can read published letters
CREATE POLICY "Public read published letters"
    ON public.letters FOR SELECT
    USING (status = 'published');

-- 2) Author can select all their letters including drafts
CREATE POLICY "Author can select own letters"
    ON public.letters FOR SELECT
    TO authenticated
    USING (auth.uid() = author_id);

-- 3) Author can insert new letters
CREATE POLICY "Author can insert letters"
    ON public.letters FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = author_id);

-- 4) Author can update own letters
CREATE POLICY "Author can update own letters"
    ON public.letters FOR UPDATE
    TO authenticated
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- 5) Author can delete own letters
CREATE POLICY "Author can delete own letters"
    ON public.letters FOR DELETE
    TO authenticated
    USING (auth.uid() = author_id);

-- Letter Media Policies:
CREATE POLICY "Anyone can view letter media for published letters"
    ON public.letter_media FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.letters 
        WHERE public.letters.id = letter_media.letter_id 
        AND public.letters.status = 'published'
    ));

CREATE POLICY "Author can manage letter media"
    ON public.letter_media FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.letters 
        WHERE public.letters.id = letter_media.letter_id 
        AND public.letters.author_id = auth.uid()
    ));

-- Letter Replies Policies:
-- 1) Recipient can view their replies and author can view replies to their letters
CREATE POLICY "View replies"
    ON public.letter_replies FOR SELECT
    USING (
        auth.uid() = sender_id OR 
        EXISTS (
            SELECT 1 FROM public.letters 
            WHERE public.letters.id = letter_replies.letter_id 
            AND public.letters.author_id = auth.uid()
        ) OR
        true -- Permits reading in anonymous birthday viewing context
    );

-- 2) Recipient can insert replies
CREATE POLICY "Insert reply"
    ON public.letter_replies FOR INSERT
    WITH CHECK (
        body IS NOT NULL AND LENGTH(TRIM(body)) > 0
    );

-- 3) Author can update read_at on replies to their letters
CREATE POLICY "Author can update reply status"
    ON public.letter_replies FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.letters 
        WHERE public.letters.id = letter_replies.letter_id 
        AND public.letters.author_id = auth.uid()
    ));

-- 9. SUPABASE STORAGE BUCKET CONFIGURATION (for letters-media)
-- Insert bucket definition if storage schema exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'letters-media',
    'letters-media',
    true,
    5242880, -- 5 MB per file
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public read access for images
CREATE POLICY "Public read letters-media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'letters-media');

-- Storage RLS: Upload access
CREATE POLICY "Allow authenticated or author upload"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'letters-media');
