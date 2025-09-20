CREATE DATABASE IF NOT EXISTS charityevents_db;
USE charityevents_db;

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    full_description TEXT,
    event_date DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    category_id INT,
    ticket_price DECIMAL(10, 2),
    goal_amount DECIMAL(10, 2),
    current_amount DECIMAL(10, 2) DEFAULT 0,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO categories (name, description) VALUES
('Fun Run', 'Charity running events'),
('Gala Dinner', 'Elegant fundraising dinners'),
('Silent Auction', 'Silent auction events'),
('Concert', 'Charity music concerts'),
('Workshop', 'Educational workshops');

INSERT INTO events (title, description, full_description, event_date, location, category_id, ticket_price, goal_amount, current_amount, image_url) VALUES
('City Charity Run 2025', '5km running event to raise funds for Children Hospital', 'Join our annual City Charity Run to raise funds for the intensive care unit of Children Hospital. The event includes 5km run, family entertainment area, and lucky draw activities.', '2025-10-15 08:00:00', 'Central Park', 1, 25.00, 50000.00, 32500.00, '/images/run.jpg'),

('Night of Hope Gala Dinner', 'Elegant fundraising dinner', 'Dress up for our annual Night of Hope Gala Dinner. Enjoy gourmet food, live music, and inspiring stories while supporting local homeless shelter projects.', '2025-11-20 19:00:00', 'Royal Hotel Ballroom', 2, 150.00, 100000.00, 75000.00, '/images/gala.jpg'),

('Art Silent Auction', 'Fundraising for youth art programs', 'Browse and bid on exquisite works from local artists. All proceeds will fund art education programs for underprivileged youth.', '2025-09-30 18:00:00', 'City Art Center', 3, 00.00, 20000.00, 12500.00, '/images/auction.jpg'),

('Love Concert', 'Charity performance by local bands', 'Enjoy an evening filled with music as five local bands perform for the Animal Protection Society.', '2025-10-05 19:30:00', 'Riverside Concert Hall', 4, 30.00, 30000.00, 18000.00, '/images/concert.jpg'),

('Coding Workshop', 'Programming education for underprivileged children', 'Join our free programming workshop to learn basic coding skills. Suitable for all ages, no experience required.', '2025-09-25 10:00:00', 'Technology Park', 5, 00.00, 15000.00, 8500.00, '/images/workshop.jpg'),

('Beach Cleanup Day', 'Protecting our marine environment', 'Join our community beach cleaning activity to help protect marine ecosystems. Gloves and garbage bags provided.', '2025-10-12 09:00:00', 'Sunshine Beach', 5, 00.00, 5000.00, 3200.00, '/images/beach.jpg'),

('Winter Warmth Donation', 'Collecting winter clothes for homeless', 'Help us collect warm clothing and blankets for homeless people before winter arrives.', '2025-11-05 10:00:00', 'Community Center', 5, 00.00, 8000.00, 4500.00, '/images/winter.jpg'),

('Christmas Charity Market', 'Festive handicraft market', 'Purchase unique handicrafts and gifts. All proceeds will be donated to the local food bank.', '2025-12-14 11:00:00', 'City Square', 3, 00.00, 25000.00, 12000.00, '/images/market.jpg');