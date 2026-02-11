require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow local dev and deployed frontend
const allowedOrigins = [
    process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    'https://e-commerce-platform-1-mkz8.onrender.com',
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// Increase JSON body size limit to handle product images (base64)
// Frontend restricts each image to 2MB and max 5 images => 10MB max
app.use(express.json({ limit: '10mb' }));


// Supabase client (service role for server-side operations)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Supabase environment variables are not set. API will not work until they are configured.');
}

const supabase = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '');

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-env';

// Helpers
function mapDbUserToAppUser(row) {
    if (!row) return null;
    return {
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        role: row.role,
        phone: row.phone || undefined,
        avatar: row.avatar || undefined,
        isVerified: row.is_verified,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function createAuthResponse(userRow) {
    const user = mapDbUserToAppUser(userRow);
    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: '1h',
    });
    const refreshToken = jwt.sign({ sub: user.id }, JWT_SECRET, {
        expiresIn: '7d',
    });
    return { user, token, refreshToken };
}

// Middleware to protect routes
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Missing Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Invalid Authorization header format' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}

// Health check
app.get('/', (req, res) => {
    res.json({ success: true, message: 'nourEssalam API is running' });
});

// Auth routes
app.post('/auth/register', async (req, res) => {
    const { email, password, firstName, lastName, phone } = req.body || {};

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields',
        });
    }

    try {
        // Check if email already exists
        const { data: existing, error: existingError } = await supabase
            .from('app_users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (existingError) {
            console.error('Supabase error (check existing user):', existingError);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const now = new Date().toISOString();
        const id = `user-${Date.now()}`;

        const { data: inserted, error: insertError } = await supabase
            .from('app_users')
            .insert({
                id,
                email,
                password_hash: passwordHash,
                first_name: firstName,
                last_name: lastName,
                role: 'customer',
                phone: phone || null,
                is_verified: false,
                created_at: now,
                updated_at: now,
            })
            .select('*')
            .single();

        if (insertError) {
            console.error('Supabase error (insert user):', insertError);
            return res.status(500).json({ success: false, message: 'Failed to create user' });
        }

        const authResponse = createAuthResponse(inserted);
        res.status(201).json({ success: true, data: authResponse });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const { data: userRow, error } = await supabase
            .from('app_users')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Supabase error (login):', error);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (!userRow) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, userRow.password_hash);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const authResponse = createAuthResponse(userRow);
        res.json({ success: true, data: authResponse });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Products routes
app.get('/products', async (_req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('id, data')
            .order('id', { ascending: true });

        if (error) {
            console.error('Supabase error (get products):', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch products' });
        }

        const products = (data || []).map(row => ({
            ...row.data,
            id: row.id,
        }));

        res.json({ success: true, data: products });
    } catch (err) {
        console.error('Get products error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/products', authMiddleware, async (req, res) => {
    const product = req.body;

    if (!product || !product.id) {
        return res.status(400).json({ success: false, message: 'Product with id is required' });
    }

    try {
        const now = new Date().toISOString();
        product.createdAt = product.createdAt || now;
        product.updatedAt = now;

        const { data, error } = await supabase
            .from('products')
            .insert({
                id: product.id,
                data: product,
            })
            .select('id, data')
            .single();

        if (error) {
            console.error('Supabase error (create product):', error);
            return res.status(500).json({ success: false, message: 'Failed to create product' });
        }

        res.status(201).json({
            success: true,
            data: { ...data.data, id: data.id },
        });
    } catch (err) {
        console.error('Create product error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/products/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const updates = req.body || {};

    try {
        const { data: existing, error: fetchError } = await supabase
            .from('products')
            .select('id, data')
            .eq('id', id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Supabase error (fetch product for update):', fetchError);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (!existing) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const merged = {
            ...existing.data,
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('products')
            .update({ data: merged })
            .eq('id', id)
            .select('id, data')
            .single();

        if (error) {
            console.error('Supabase error (update product):', error);
            return res.status(500).json({ success: false, message: 'Failed to update product' });
        }

        res.json({ success: true, data: { ...data.data, id: data.id } });
    } catch (err) {
        console.error('Update product error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.delete('/products/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Supabase error (delete product):', error);
            return res.status(500).json({ success: false, message: 'Failed to delete product' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Delete product error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Orders routes
app.get('/orders', authMiddleware, async (req, res) => {
    const userId = req.user.sub;
    const role = req.user.role;

    try {
        let query = supabase
            .from('orders')
            .select('id, data')
            .order('created_at', { ascending: false });

        // Non-admin users only see their own orders
        if (role !== 'admin') {
            query = query.eq('user_id', userId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Supabase error (get orders):', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
        }

        const orders = (data || []).map(row => ({
            ...row.data,
            id: row.id,
        }));

        res.json({ success: true, data: orders });
    } catch (err) {
        console.error('Get orders error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/orders', authMiddleware, async (req, res) => {
    const order = req.body;
    const userId = req.user.sub;

    if (!order) {
        return res.status(400).json({ success: false, message: 'Order payload is required' });
    }

    try {
        const now = new Date().toISOString();
        const id = order.id || `order-${Date.now()}`;
        const orderNumber = order.orderNumber || `NE-${Date.now().toString().slice(-6)}`;

        const normalized = {
            ...order,
            id,
            orderNumber,
            userId,
            createdAt: order.createdAt || now,
            updatedAt: now,
        };

        const { data, error } = await supabase
            .from('orders')
            .insert({
                id,
                user_id: userId,
                data: normalized,
            })
            .select('id, data')
            .single();

        if (error) {
            console.error('Supabase error (create order):', error);
            return res.status(500).json({ success: false, message: 'Failed to create order' });
        }

        res.status(201).json({ success: true, data: { ...data.data, id: data.id } });
    } catch (err) {
        console.error('Create order error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/orders/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body || {};
    const userId = req.user.sub;
    const role = req.user.role;

    if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
    }

    try {
        const { data: existing, error: fetchError } = await supabase
            .from('orders')
            .select('id, user_id, data')
            .eq('id', id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Supabase error (fetch order for update):', fetchError);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (!existing) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Only admins or the owner of the order can update it
        if (role !== 'admin' && existing.user_id !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
        }

        const now = new Date().toISOString();
        const current = existing.data || {};

        const updatedTimeline = [
            ...(current.timeline || []),
            {
                id: `ot-${Date.now()}`,
                status,
                description: `Order ${status}`,
                timestamp: now,
            },
        ];

        const updated = {
            ...current,
            status,
            updatedAt: now,
            timeline: updatedTimeline,
        };

        const { data, error } = await supabase
            .from('orders')
            .update({ data: updated })
            .eq('id', id)
            .select('id, data')
            .single();

        if (error) {
            console.error('Supabase error (update order):', error);
            return res.status(500).json({ success: false, message: 'Failed to update order' });
        }

        res.json({ success: true, data: { ...data.data, id: data.id } });
    } catch (err) {
        console.error('Update order error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`nourEssalam API listening on port ${PORT}`);
});

