const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'incident-mgmt-secret-key';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ─── RBAC Roles ──────────────────────────────────────────────────────────────
// admin   – full CRUD + user management
// manager – create, read, update (no delete)
// viewer  – read-only

// ─── In-memory users store ───────────────────────────────────────────────────
const SALT_ROUNDS = 10;
const users = [
  {
    id: uuidv4(),
    username: process.env.ADMIN_USERNAME || 'admin',
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', SALT_ROUNDS),
    role: 'admin',
    name: 'Administrator'
  },
  {
    id: uuidv4(),
    username: 'manager1',
    password: bcrypt.hashSync('manager123', SALT_ROUNDS),
    role: 'manager',
    name: 'Jane Manager'
  },
  {
    id: uuidv4(),
    username: 'viewer1',
    password: bcrypt.hashSync('viewer123', SALT_ROUNDS),
    role: 'viewer',
    name: 'Bob Viewer'
  }
];

// ─── Auth middleware ──────────────────────────────────────────────────────────
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ─── Role authorization middleware factory ────────────────────────────────────
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

// ─── Auth routes ─────────────────────────────────────────────────────────────

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.json({ token, user: { id: user.id, username: user.username, role: user.role, name: user.name } });
});

// GET /api/auth/me  – returns current user info
app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username, role: req.user.role, name: req.user.name });
});

// ─── In-memory incidents store ────────────────────────────────────────────────
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

// GET all incidents with filtering  (all authenticated roles)
app.get('/api/incidents', authenticate, (req, res) => {
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

// GET single incident by ID  (all authenticated roles)
app.get('/api/incidents/:id', authenticate, (req, res) => {
  const incident = incidents.find(i => i.id === req.params.id);
  if (!incident) {
    return res.status(404).json({ error: 'Incident not found' });
  }
  res.json(incident);
});

// POST create new incident  (admin, manager)
app.post('/api/incidents', authenticate, authorize('admin', 'manager'), (req, res) => {
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

// PUT update incident  (admin, manager)
app.put('/api/incidents/:id', authenticate, authorize('admin', 'manager'), (req, res) => {
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

// DELETE incident  (admin only)
app.delete('/api/incidents/:id', authenticate, authorize('admin'), (req, res) => {
  const index = incidents.findIndex(i => i.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Incident not found' });
  }
  
  incidents.splice(index, 1);
  res.json({ message: 'Incident deleted successfully' });
});

// GET incident statistics  (all authenticated roles)
app.get('/api/incidents/stats/summary', authenticate, (req, res) => {
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
