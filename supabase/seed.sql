-- Initial Seed Data for Slovor MP
-- Aligned with Masterplan V2

-- 1. Initial Categories
-- (Assuming categories table has: id, name, slug, icon, description, created_at, updated_at)
INSERT INTO categories (name, slug, icon, description)
VALUES
    ('Real Estate', 'real-estate', 'home', 'Find your dream home or commercial property'),
    ('Vehicles', 'vehicles', 'car', 'Cars, motorcycles, and other vehicles'),
    ('Electronics', 'electronics', 'laptop', 'Smartphones, computers, and gadgets'),
    ('Jobs', 'jobs', 'briefcase', 'Find your next career opportunity'),
    ('Services', 'services', 'tool', 'Local services and professional help'),
    ('Home & Garden', 'home-garden', 'sofa', 'Everything for your home and lifestyle')
ON CONFLICT (slug) DO NOTHING;

-- 2. Default Platform Settings
INSERT INTO platform_settings (key, value, description)
VALUES
    ('site_name', '"Slovor Marketplace"', 'The name of the platform'),
    ('allow_registrations', 'true', 'Enable/disable new user sign-ups'),
    ('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
    ('default_currency', '"EUR"', 'Base currency for the platform')
ON CONFLICT (key) DO NOTHING;
