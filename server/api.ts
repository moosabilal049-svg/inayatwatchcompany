import { Router, Request, Response } from 'express';
import { db } from './db';
import fs from 'fs';
import path from 'path';

export const apiRouter = Router();

// In-memory token storage for admin sessions
const validTokens = new Set<string>();

// Middleware to check admin auth
function requireAdmin(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized. Admin login required.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!validTokens.has(token)) {
    res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    return;
  }
  next();
}

// -------------------------------------------------------------
// AUTH ROUTES
// -------------------------------------------------------------
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const settings = db.getSettings();

  if (
    (email === settings.admin_email || email === 'admin@inayatwatches.pk') &&
    (password === settings.admin_password_hash || password === 'inayat123')
  ) {
    const token = `token_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
    validTokens.add(token);
    res.json({
      success: true,
      token,
      user: {
        email: settings.admin_email,
        role: 'admin',
        name: 'Inayat Watch Admin',
      },
    });
    return;
  }

  res.status(401).json({ error: 'Invalid email or password.' });
});

apiRouter.get('/auth/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ valid: false });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (validTokens.has(token)) {
    res.json({ valid: true });
    return;
  }
  res.status(401).json({ valid: false });
});

apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    validTokens.delete(token);
  }
  res.json({ success: true });
});

// -------------------------------------------------------------
// BRANDS ROUTES
// -------------------------------------------------------------
apiRouter.get('/brands', (req: Request, res: Response) => {
  const brands = db.getBrands();
  // Attach product counts
  const products = db.getProducts();
  const brandsWithCount = brands.map(b => {
    const count = products.filter(p => p.brand_id.toLowerCase() === b.slug.toLowerCase()).length;
    return {
      ...b,
      product_count: count,
    };
  });
  res.json(brandsWithCount);
});

apiRouter.get('/brands/:slug', (req: Request, res: Response) => {
  const brand = db.getBrandBySlug(req.params.slug);
  if (!brand) {
    res.status(404).json({ error: 'Brand not found' });
    return;
  }
  const products = db.getProducts({ brand_id: brand.slug });
  res.json({
    brand,
    products,
    product_count: products.length,
  });
});

apiRouter.put('/brands/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = db.updateBrand(id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Brand not found' });
    return;
  }
  res.json(updated);
});

// -------------------------------------------------------------
// PRODUCTS ROUTES
// -------------------------------------------------------------
apiRouter.get('/products', (req: Request, res: Response) => {
  const { brand, category, search, featured, new_arrival, on_sale, sort } = req.query;

  const products = db.getProducts({
    brand_id: brand as string,
    category: category as string,
    search: search as string,
    featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
    new_arrival: new_arrival === 'true' ? true : new_arrival === 'false' ? false : undefined,
    on_sale: on_sale === 'true' ? true : on_sale === 'false' ? false : undefined,
    sort: sort as string,
  });

  res.json(products);
});

apiRouter.get('/products/:slug', (req: Request, res: Response) => {
  const product = db.getProductBySlug(req.params.slug) || db.getProductById(req.params.slug);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  // Get related products from the same brand (excluding this product)
  let related = db.getProducts({ brand_id: product.brand_id }).filter(p => p.id !== product.id);
  // If not enough from same brand, complement with other featured products
  if (related.length < 4) {
    const others = db.getProducts().filter(p => p.id !== product.id && !related.some(r => r.id === p.id));
    related = [...related, ...others.slice(0, 4 - related.length)];
  }

  const brand = db.getBrandBySlug(product.brand_id);

  res.json({
    product,
    brand,
    related: related.slice(0, 4),
  });
});

apiRouter.post('/products', requireAdmin, (req: Request, res: Response) => {
  try {
    const {
      name,
      slug,
      brand_id,
      category,
      description,
      price,
      sale_price,
      sku,
      stock,
      images,
      featured,
      new_arrival,
      on_sale,
      specifications,
    } = req.body;

    if (!name || !brand_id || price === undefined) {
      res.status(400).json({ error: 'Name, brand, and price are required fields.' });
      return;
    }

    // Verify brand exists
    const validBrand = db.getBrandBySlug(brand_id);
    if (!validBrand) {
      res.status(400).json({ error: `Selected brand '${brand_id}' is invalid.` });
      return;
    }

    const newProduct = db.addProduct({
      name: name.trim(),
      slug: slug || '',
      brand_id: validBrand.slug,
      category: category || 'General',
      description: description || '',
      price: Number(price) || 0,
      sale_price: sale_price ? Number(sale_price) : null,
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      stock: Number(stock) || 0,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80'],
      featured: Boolean(featured),
      new_arrival: Boolean(new_arrival),
      on_sale: Boolean(on_sale),
      specifications: specifications || {},
    });

    res.status(201).json(newProduct);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create product' });
  }
});

apiRouter.put('/products/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.sale_price !== undefined) {
      updates.sale_price = updates.sale_price ? Number(updates.sale_price) : null;
    }
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    // If brand is changed, ensure it's a valid brand slug
    if (updates.brand_id) {
      const validBrand = db.getBrandBySlug(updates.brand_id);
      if (validBrand) {
        updates.brand_id = validBrand.slug;
      }
    }

    const updated = db.updateProduct(id, updates);
    if (!updated) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update product' });
  }
});

apiRouter.delete('/products/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteProduct(id);
  if (!deleted) {
    res.status(404).json({ error: 'Product not found or already deleted' });
    return;
  }
  res.json({ success: true, message: 'Product deleted successfully' });
});

// -------------------------------------------------------------
// IMAGE UPLOAD ROUTE
// -------------------------------------------------------------
apiRouter.post('/upload', requireAdmin, (req: Request, res: Response) => {
  try {
    const { data, filename } = req.body;
    if (!data) {
      res.status(400).json({ error: 'No image data provided' });
      return;
    }

    // Check if it's already an external HTTP URL
    if (data.startsWith('http://') || data.startsWith('https://')) {
      res.json({ url: data });
      return;
    }

    // Otherwise handle base64 data url
    const matches = data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ error: 'Invalid base64 image data string' });
      return;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    let ext = 'jpg';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('jpeg')) ext = 'jpg';

    const safeBase = (filename || 'watch-image').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 30);
    const uniqueFilename = `${safeBase}-${Date.now()}.${ext}`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;
    res.json({ url: publicUrl });
  } catch (err: any) {
    console.error('Image upload failed:', err);
    res.status(500).json({ error: err.message || 'Image processing failed' });
  }
});

// -------------------------------------------------------------
// ORDERS ROUTES
// -------------------------------------------------------------
apiRouter.post('/orders', (req: Request, res: Response) => {
  try {
    const { customer_name, phone, whatsapp, email, address, city, order_notes, items, subtotal, delivery_charges, total, payment_method } = req.body;

    if (!customer_name || !phone || !address || !items || !items.length) {
      res.status(400).json({ error: 'Customer name, phone, address, and at least one item are required.' });
      return;
    }

    const order = db.addOrder({
      customer_name: customer_name.trim(),
      phone: phone.trim(),
      whatsapp: (whatsapp || phone).trim(),
      email: email ? email.trim() : undefined,
      address: address.trim(),
      city: (city || 'Pakistan').trim(),
      order_notes: order_notes ? order_notes.trim() : undefined,
      items,
      subtotal: Number(subtotal) || 0,
      delivery_charges: Number(delivery_charges) || 0,
      total: Number(total) || 0,
      payment_method: payment_method || 'Cash on Delivery',
    });

    res.status(201).json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to place order' });
  }
});

apiRouter.get('/orders', requireAdmin, (req: Request, res: Response) => {
  const orders = db.getOrders();
  res.json(orders);
});

apiRouter.get('/orders/:id', requireAdmin, (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(order);
});

apiRouter.put('/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = db.updateOrderStatus(id, status);
  if (!updated) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(updated);
});

// -------------------------------------------------------------
// STATS & SETTINGS ROUTES
// -------------------------------------------------------------
apiRouter.get('/admin/stats', requireAdmin, (req: Request, res: Response) => {
  const stats = db.getStats();
  res.json(stats);
});

apiRouter.get('/settings', (req: Request, res: Response) => {
  const settings = db.getSettings();
  // Do not expose admin password hash to public
  const { admin_password_hash, ...publicSettings } = settings;
  res.json(publicSettings);
});

apiRouter.put('/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  const { admin_password_hash, ...publicSettings } = updated;
  res.json(publicSettings);
});
