#!/usr/bin/env bash
# ==============================================================================
# SALON BOOKING APPLICATION - DATABASE SEEDING SCRIPT (FOR AWS DOCKER INSTANCE)
# ==============================================================================
set -e

echo "🌱 Starting database seeding across microservices..."

# 1. SEED USER DATABASE (userdb -> user_db)
echo "👤 Seeding Users (Owner & Customer)..."
sudo docker exec -i userdb mysql -uroot -proot user_db << 'EOF'
-- Clear existing seed data if any
DELETE FROM user WHERE email IN ('owner@salonbook.com', 'customer@salonbook.com');

-- Insert Salon Owner (role: 2 = SALON_OWNER) and Customer (role: 0 = CUSTOMER)
INSERT INTO user (id, full_name, email, phone, username, password, role, created_at, updated_at)
VALUES 
(1, 'The Grooming Co. Owner', 'owner@salonbook.com', '9876543210', 'grooming_owner', 'password123', 2, NOW(), NOW()),
(2, 'Rahul Verma', 'customer@salonbook.com', '9812345678', 'rahul_customer', 'password123', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), password=VALUES(password);
EOF

# 2. SEED SALON DATABASE (salondb -> salon_db)
echo "💈 Seeding Salons & Salon Images..."
sudo docker exec -i salondb mysql -uroot -proot salon_db << 'EOF'
DELETE FROM salon_images WHERE salon_id IN (1, 2);
DELETE FROM salon WHERE id IN (1, 2);

INSERT INTO salon (id, name, address, phone_number, email, city, owner_id, open_time, close_time)
VALUES 
(1, 'The Grooming Co. - Luxury Care', '104 Park Avenue, Indiranagar', '9876543210', 'contact@groomingco.com', 'Bangalore', 1, '09:00:00', '21:00:00'),
(2, 'Elegance Hair & Spa Studio', '45 MG Road, Koramangala', '9876543211', 'info@elegancehair.com', 'Bangalore', 1, '10:00:00', '20:00:00');

INSERT INTO salon_images (salon_id, images)
VALUES 
(1, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'),
(1, 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80'),
(2, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'),
(2, 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80');
EOF

# 3. SEED CATEGORY DATABASE (categorydb -> category_db)
echo "🏷️ Seeding Service Categories..."
sudo docker exec -i categorydb mysql -uroot -proot category_db << 'EOF'
DELETE FROM category WHERE id IN (1, 2, 3, 4);

INSERT INTO category (id, name, image, salon_id)
VALUES 
(1, 'Hair Care', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80', 1),
(2, 'Beard & Shave', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=400&q=80', 1),
(3, 'Facial & Skin Care', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80', 1),
(4, 'Hair Styling & Spa', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80', 2);
EOF

# 4. SEED SERVICE OFFERING DATABASE (service-offeringdb -> service_db)
echo "✂️ Seeding Service Offerings (Hair Cut, Beard Trim, Facial, Spa)..."
sudo docker exec -i service-offeringdb mysql -uroot -proot service_db << 'EOF'
DELETE FROM service_offering WHERE id IN (1, 2, 3, 4, 5);

INSERT INTO service_offering (id, name, description, price, duration, salon_id, category_id, image)
VALUES 
(1, 'Classic Men Hair Cut', 'Precision styling, soothing wash and blow dry', 349, 30, 1, 1, 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=400&q=80'),
(2, 'Royal Beard Grooming & Trim', 'Hot towel, beard shaping and organic oil care', 249, 25, 1, 2, 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=400&q=80'),
(3, 'Gold Radiance Facial', 'Deep skin cleansing, scrub, and soothing massage', 699, 45, 1, 3, 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80'),
(4, 'Hair Spa & Scalp Therapy', 'Intensive nourishment for damaged and dry hair', 799, 50, 1, 1, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80'),
(5, 'Deluxe Women Hair Cut & Style', 'Wash, custom layer cut and heat styling', 599, 45, 2, 4, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80');
EOF

echo "✅ All database tables successfully seeded with realistic salon data!"

