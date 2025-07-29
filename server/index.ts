import express from 'express';
import session from 'express-session';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users, portfolioItems, contacts } from '../shared/schema';
import { eq } from 'drizzle-orm';
import path from 'path';
import { fileURLToPath } from 'url';
import ConnectPgSimple from 'connect-pg-simple';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Database setup
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Session store
const PgSession = ConnectPgSimple(session);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(session({
  store: new PgSession({
    conString: process.env.DATABASE_URL,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Auth middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (req.session?.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Simple hardcoded credentials for demo
    if (email === 'admin@portfolio.com' && password === 'admin123') {
      req.session.userId = 1;
      res.json({ success: true, user: { id: 1, email } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Logout failed' });
    } else {
      res.json({ success: true });
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  if (req.session?.userId) {
    res.json({ user: { id: req.session.userId, email: 'admin@portfolio.com' } });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Portfolio routes
app.get('/api/portfolio', async (req, res) => {
  try {
    const items = await db.select().from(portfolioItems).orderBy(portfolioItems.createdAt);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio items' });
  }
});

app.post('/api/portfolio', requireAuth, async (req, res) => {
  try {
    const { title, description, category, imageUrl, tags } = req.body;
    
    const [item] = await db.insert(portfolioItems).values({
      title,
      description,
      category,
      imageUrl,
      tags: tags || [],
    }).returning();
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create portfolio item' });
  }
});

app.put('/api/portfolio/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, imageUrl, tags } = req.body;
    
    const [item] = await db.update(portfolioItems)
      .set({
        title,
        description,
        category,
        imageUrl,
        tags: tags || [],
        updatedAt: new Date(),
      })
      .where(eq(portfolioItems.id, parseInt(id)))
      .returning();
    
    if (!item) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update portfolio item' });
  }
});

app.delete('/api/portfolio/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [item] = await db.delete(portfolioItems)
      .where(eq(portfolioItems.id, parseInt(id)))
      .returning();
    
    if (!item) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete portfolio item' });
  }
});

// Contact routes
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, message, projectType } = req.body;
    
    const [contact] = await db.insert(contacts).values({
      name,
      email,
      message,
      projectType: projectType || 'general',
    }).returning();
    
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

app.get('/api/contacts', requireAuth, async (req, res) => {
  try {
    const contactList = await db.select().from(contacts).orderBy(contacts.createdAt);
    res.json(contactList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});