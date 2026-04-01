const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || (() => {
  console.warn('WARNING: JWT_SECRET environment variable is not set. Using insecure default. Set JWT_SECRET in production.');
  return 'incident-manager-secret-key';
})();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rate limiter for auth endpoints (max 20 requests per 15 minutes per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// In-memory user store
let users = [];

// Seed a default admin user (override via ADMIN_USERNAME / ADMIN_PASSWORD env vars)
(async () => {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (!process.env.ADMIN_PASSWORD) {
    console.warn('WARNING: ADMIN_PASSWORD environment variable is not set. Using default credentials. Set ADMIN_PASSWORD in production.');
  }
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  users.push({ id: uuidv4(), username: adminUsername, email: 'admin@example.com', passwordHash });
})();

// Auth middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// POST /api/auth/register
app.post('/api/auth/register', authLimiter, async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email and password are required' });
  }
  if (users.find(u => u.username === username || u.email === email)) {
    return res.status(409).json({ error: 'Username or email already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), username, email, passwordHash };
  users.push(user);
  const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
  res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } });
});

// POST /api/auth/login
app.post('/api/auth/login', authLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
});

// GET /api/auth/me
app.get('/api/auth/me', authLimiter, authenticate, (req, res) => {
  res.json({ user: req.user });
});

// In-memory database (for demo purposes)
let incidents = [
  {
    id: uuidv4(),
    title: 'Server Outage',
    description: 'Production server is down',
    status: 'open',
    priority: 'high',
    createdAt: new Date('2024-03-20T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-03-20T10:00:00Z').toISOString(),
    assignee: 'John Doe'
  },
  {
    id: uuidv4(),
    title: 'Database Connection Issue',
    description: 'Unable to connect to database',
    status: 'in-progress',
    priority: 'critical',
    createdAt: new Date('2024-03-21T14:30:00Z').toISOString(),
    updatedAt: new Date('2024-03-21T15:00:00Z').toISOString(),
    assignee: 'Jane Smith'
  },
  {
    id: uuidv4(),
    title: 'Slow API Response',
    description: 'API endpoints responding slowly',
    status: 'open',
    priority: 'medium',
    createdAt: new Date('2024-03-22T09:15:00Z').toISOString(),
    updatedAt: new Date('2024-03-22T09:15:00Z').toISOString(),
    assignee: 'Bob Johnson'
  },
  {
    id: uuidv4(),
    title: 'Login Bug',
    description: 'Users unable to login',
    status: 'resolved',
    priority: 'high',
    createdAt: new Date('2024-03-19T08:00:00Z').toISOString(),
    updatedAt: new Date('2024-03-19T16:00:00Z').toISOString(),
    assignee: 'Alice Brown'
  },
  {
    id: uuidv4(),
    title: 'UI Layout Issue',
    description: 'Dashboard layout broken on mobile',
    status: 'open',
    priority: 'low',
    createdAt: new Date('2024-03-23T11:45:00Z').toISOString(),
    updatedAt: new Date('2024-03-23T11:45:00Z').toISOString(),
    assignee: 'Charlie Wilson'
  }
];

// GET all incidents with filtering
app.get('/api/incidents', (req, res) => {
  let filteredIncidents = [...incidents];
  
  // Filter by status
  if (req.query.status) {
    filteredIncidents = filteredIncidents.filter(
      incident => incident.status === req.query.status
    );
  }
  
  // Filter by priority
  if (req.query.priority) {
    filteredIncidents = filteredIncidents.filter(
      incident => incident.priority === req.query.priority
    );
  }
  
  // Filter by assignee
  if (req.query.assignee) {
    filteredIncidents = filteredIncidents.filter(
      incident => incident.assignee.toLowerCase().includes(req.query.assignee.toLowerCase())
    );
  }
  
  // Sort by creation date (newest first by default)
  filteredIncidents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json(filteredIncidents);
});

// GET single incident by ID
app.get('/api/incidents/:id', (req, res) => {
  const incident = incidents.find(i => i.id === req.params.id);
  if (!incident) {
    return res.status(404).json({ error: 'Incident not found' });
  }
  res.json(incident);
});

// POST create new incident
app.post('/api/incidents', (req, res) => {
  const { title, description, priority, assignee } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  
  const newIncident = {
    id: uuidv4(),
    title,
    description,
    status: 'open',
    priority: priority || 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignee: assignee || 'Unassigned'
  };
  
  incidents.push(newIncident);
  res.status(201).json(newIncident);
});

// PUT update incident
app.put('/api/incidents/:id', (req, res) => {
  const index = incidents.findIndex(i => i.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Incident not found' });
  }
  
  const updatedIncident = {
    ...incidents[index],
    ...req.body,
    id: incidents[index].id, // Preserve the ID
    createdAt: incidents[index].createdAt, // Preserve creation date
    updatedAt: new Date().toISOString()
  };
  
  incidents[index] = updatedIncident;
  res.json(updatedIncident);
});

// DELETE incident
app.delete('/api/incidents/:id', (req, res) => {
  const index = incidents.findIndex(i => i.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Incident not found' });
  }
  
  incidents.splice(index, 1);
  res.json({ message: 'Incident deleted successfully' });
});

// GET incident statistics
app.get('/api/incidents/stats/summary', (req, res) => {
  const stats = {
    total: incidents.length,
    byStatus: {
      open: incidents.filter(i => i.status === 'open').length,
      'in-progress': incidents.filter(i => i.status === 'in-progress').length,
      resolved: incidents.filter(i => i.status === 'resolved').length,
      closed: incidents.filter(i => i.status === 'closed').length
    },
    byPriority: {
      critical: incidents.filter(i => i.priority === 'critical').length,
      high: incidents.filter(i => i.priority === 'high').length,
      medium: incidents.filter(i => i.priority === 'medium').length,
      low: incidents.filter(i => i.priority === 'low').length
    }
  };
  
  res.json(stats);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
