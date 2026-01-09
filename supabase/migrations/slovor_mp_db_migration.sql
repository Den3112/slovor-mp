-- SQL-скрипт для модернизации базы данных Slovor Marketplace
-- Предполагается использование PostgreSQL

-- 1. Расширение сущности "Users"
ALTER TABLE Users
ADD COLUMN phone_number VARCHAR(20) DEFAULT NULL,
ADD COLUMN avatar_url VARCHAR(255) DEFAULT NULL,
ADD COLUMN bio TEXT DEFAULT NULL,
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN verification_level VARCHAR(50) DEFAULT 'none',
ADD COLUMN rating DECIMAL(3, 2) DEFAULT 0.00,
ADD COLUMN review_count INTEGER DEFAULT 0;

-- 2. Расширение сущности "Listings"
ALTER TABLE Listings
ADD COLUMN condition VARCHAR(50) DEFAULT NULL,
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN featured_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN views_count INTEGER DEFAULT 0,
ADD COLUMN negotiable BOOLEAN DEFAULT FALSE;

-- Добавление поля для гибких атрибутов (JSONB для PostgreSQL)
ALTER TABLE Listings
ADD COLUMN attributes JSONB DEFAULT '{}';

-- 3. Создание новых таблиц для премиум-функций

-- Таблица User_Verifications
CREATE TABLE User_Verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    document_data JSONB NOT NULL, -- Например, ссылки на сканы документов или метаданные
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- pending, approved, rejected
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица Favorites
CREATE TABLE Favorites (
    user_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES Listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, listing_id)
);

-- Таблица Messages (для внутреннего чата)
CREATE TABLE Messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES Listings(id) ON DELETE SET NULL, -- Сообщение может быть не привязано к объявлению
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица Reviews
CREATE TABLE Reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    target_user_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE, -- Пользователь, о котором оставлен отзыв
    listing_id UUID REFERENCES Listings(id) ON DELETE SET NULL, -- Отзыв может быть привязан к конкретному объявлению
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица Payments_Subscriptions (для платных услуг)
CREATE TABLE Payments_Subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES Listings(id) ON DELETE SET NULL, -- Если услуга привязана к объявлению
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR' NOT NULL,
    service_type VARCHAR(100) NOT NULL, -- 'featured', 'bump', 'top', 'subscription_plan'
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
    transaction_id VARCHAR(255) DEFAULT NULL,
    payment_gateway VARCHAR(100) DEFAULT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Создание индексов для оптимизации производительности

-- Индексы для Users
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_is_verified ON Users(is_verified);

-- Индексы для Listings
CREATE INDEX idx_listings_category_id ON Listings(category_id);
CREATE INDEX idx_listings_user_id ON Listings(user_id);
CREATE INDEX idx_listings_status ON Listings(status);
CREATE INDEX idx_listings_created_at ON Listings(created_at DESC);
CREATE INDEX idx_listings_featured_status_created_at ON Listings(status, is_featured, created_at DESC);

-- Полнотекстовый поиск (пример для PostgreSQL, требует настройки ts_vector)
-- ALTER TABLE Listings ADD COLUMN tsv_content TSVECTOR;
-- UPDATE Listings SET tsv_content = to_tsvector('russian', title || ' ' || description);
-- CREATE INDEX idx_listings_tsv_content ON Listings USING GIN(tsv_content);
-- CREATE FUNCTION update_listings_tsv() RETURNS TRIGGER AS $$
-- BEGIN
--    NEW.tsv_content = to_tsvector('russian', NEW.title || ' ' || NEW.description);
--    RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
-- CREATE TRIGGER trg_listings_tsv_update BEFORE INSERT OR UPDATE ON Listings
-- FOR EACH ROW EXECUTE FUNCTION update_listings_tsv();

-- Индексы для User_Verifications
CREATE INDEX idx_user_verifications_user_id ON User_Verifications(user_id);
CREATE INDEX idx_user_verifications_status ON User_Verifications(status);

-- Индексы для Favorites
-- PRIMARY KEY (user_id, listing_id) уже создает уникальный индекс

-- Индексы для Messages
CREATE INDEX idx_messages_sender_receiver ON Messages(sender_id, receiver_id);
CREATE INDEX idx_messages_listing_id ON Messages(listing_id);
CREATE INDEX idx_messages_created_at ON Messages(created_at DESC);

-- Индексы для Reviews
CREATE INDEX idx_reviews_reviewer_id ON Reviews(reviewer_id);
CREATE INDEX idx_reviews_target_user_id ON Reviews(target_user_id);
CREATE INDEX idx_reviews_listing_id ON Reviews(listing_id);

-- Индексы для Payments_Subscriptions
CREATE INDEX idx_payments_user_id ON Payments_Subscriptions(user_id);
CREATE INDEX idx_payments_listing_id ON Payments_Subscriptions(listing_id);
CREATE INDEX idx_payments_status ON Payments_Subscriptions(status);
CREATE INDEX idx_payments_service_type ON Payments_Subscriptions(service_type);
