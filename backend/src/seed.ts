import pool from './config/db';
import bcrypt from 'bcryptjs';

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
};

const seed = async () => {
  try {
    console.log('Starting data migration...');

    // 1. Create Admin User (if not exists)
    const [existingAdmin] = await pool.query<any[]>('SELECT id FROM users WHERE email = ?', ['admin@jwerlly.com']);
    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        ['Admin', 'User', 'admin@jwerlly.com', hashedPassword, 'admin']
      );
      console.log('Admin user created.');
    }

    // 2. Clear existing ecommerce data (optional but good for clean seed)
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE product_images');
    await pool.query('TRUNCATE TABLE products');
    await pool.query('TRUNCATE TABLE categories');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    // 3. Import Categories
    const categoryNavItems = [
      "Mother's Day", "New and Features", "Engagement", "Wedding", "Diamonds",
      "Rings", "Necklace", "Earrings", "Bracelets", "Custom Jewelery",
      "Watches", "Sales and Clearence"
    ];

    const categoryMap = new Map();

    for (const catName of categoryNavItems) {
      const slug = slugify(catName);
      const [result] = await pool.query<any>(
        'INSERT INTO categories (name, slug) VALUES (?, ?)',
        [catName, slug]
      );
      categoryMap.set(catName, result.insertId);
    }
    console.log(`Imported ${categoryNavItems.length} categories.`);

    // 4. Import Products
    const allProducts = [
      { name: "Diamond Halo Ring", category: "Rings", price: 450, metal: "Gold", gemstone: "Diamond", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop" },
      { name: "Gold Chain Necklace", category: "Necklace", price: 320, metal: "Gold", gemstone: "None", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&h=500&fit=crop" },
      { name: "Rose Gold Earrings", category: "Earrings", price: 180, metal: "Rose Gold", gemstone: "Ruby", image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500&h=500&fit=crop" },
      { name: "Silver Bracelet", category: "Bracelets", price: 95, metal: "Silver", gemstone: "None", image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500&h=500&fit=crop" },
      { name: "Emerald Pendant", category: "Necklace", price: 520, metal: "Gold", gemstone: "Emerald", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop" },
      { name: "Sapphire Cocktail Ring", category: "Rings", price: 680, metal: "Silver", gemstone: "Sapphire", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop" },
      { name: "Diamond Stud Earrings", category: "Earrings", price: 390, metal: "Gold", gemstone: "Diamond", image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop" },
      { name: "Leather Wrap Bracelet", category: "Bracelets", price: 65, metal: "None", gemstone: "None", image: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500&h=500&fit=crop" },
      { name: "Ruby Heart Pendant", category: "Necklace", price: 470, metal: "Rose Gold", gemstone: "Ruby", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&h=500&fit=crop" },
      { name: "Gold Hoop Earrings", category: "Earrings", price: 210, metal: "Gold", gemstone: "None", image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&h=500&fit=crop" },
      { name: "Diamond Tennis Bracelet", category: "Bracelets", price: 890, metal: "Silver", gemstone: "Diamond", image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500&h=500&fit=crop" },
      { name: "Emerald Cut Ring", category: "Rings", price: 750, metal: "Gold", gemstone: "Emerald", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop" },
    ];

    for (const prod of allProducts) {
      const catId = categoryMap.get(prod.category) || null;
      const slug = slugify(prod.name);
      
      const [pResult] = await pool.query<any>(
        'INSERT INTO products (name, slug, price, category_id, status, featured) VALUES (?, ?, ?, ?, ?, ?)',
        [prod.name, slug, prod.price, catId, 'published', true]
      );
      
      const productId = pResult.insertId;
      
      // Add product image
      await pool.query(
        'INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, ?)',
        [productId, prod.image, true]
      );
    }
    console.log(`Imported ${allProducts.length} products.`);

    // 5. Create Home Page & Sections (if not exists)
    const [existingHome] = await pool.query<any[]>('SELECT id FROM pages WHERE slug = ?', ['home']);
    if (existingHome.length === 0) {
      const [pageResult] = await pool.query<any>(
        'INSERT INTO pages (title, slug, status) VALUES (?, ?, ?)',
        ['Home', 'home', 'published']
      );
      const homePageId = pageResult.insertId;

      const bannerContent = {
        title: "Highclass craftsmanship which you have always deserved",
        sub_title: "Welcome to jewelry for all occasions",
        description: "We are experts in a number of manufacturing techniques, blending old and new methods to give you the best of both.",
        btn_text: "Discover More",
        btn_link: "/shop"
      };

      await pool.query(
        'INSERT INTO page_sections (page_id, section_name, content, sort_order) VALUES (?, ?, ?, ?)',
        [homePageId, 'banner', JSON.stringify(bannerContent), 0]
      );
      console.log('Home page CMS content initialized.');
    }

    console.log('Data migration and seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    process.exit();
  }
};

seed();
