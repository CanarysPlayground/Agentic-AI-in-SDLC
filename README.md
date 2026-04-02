# Incident Management System

A full-stack incident management system with a React frontend dashboard and Node.js/Express backend API, featuring **Role-Based Access Control (RBAC)**.

## Features

### Backend API
- RESTful API with Express.js
- In-memory data storage (easily extendable to use a database)
- Complete CRUD operations for incidents
- Filtering by status, priority, and assignee
- Real-time statistics endpoint
- Sample incident data for testing
- **JWT authentication** with role-based authorization

### Frontend Dashboard
- **Login screen** with demo account hints
- **Modern React UI** with responsive design
- **Incident List View** with sortable columns
- **Advanced Filtering**:
  - Filter by status (Open, In Progress, Resolved, Closed)
  - Filter by priority (Critical, High, Medium, Low)
  - Search by assignee name
- **Status Tracking**:
  - Visual status badges
  - Priority indicators
  - Real-time statistics panel
- **Full Incident Management** (role-dependent):
  - Create new incidents *(admin, manager)*
  - View incident details *(all roles)*
  - Edit existing incidents *(admin, manager)*
  - Delete incidents *(admin only)*
- **User info & role badge** in the header
- **Responsive Design** - works on desktop, tablet, and mobile

## Role-Based Access Control (RBAC)

The system enforces three roles:

| Role | View Incidents | Create | Edit | Delete |
|------|---------------|--------|------|--------|
| **admin** | ✅ | ✅ | ✅ | ✅ |
| **manager** | ✅ | ✅ | ✅ | ❌ |
| **viewer** | ✅ | ❌ | ❌ | ❌ |

### Demo Accounts

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | admin |
| `manager1` | `manager123` | manager |
| `viewer1` | `viewer123` | viewer |

The admin username and password can be overridden via the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables. Set `JWT_SECRET` in production.

### How It Works

1. The user submits credentials to `POST /api/auth/login` and receives a JWT token.
2. Every subsequent API call includes the token as `Authorization: Bearer <token>`.
3. The backend `authenticate` middleware verifies the token; the `authorize` middleware checks the role.
4. The React frontend reads the user's role from the token response and shows/hides action buttons accordingly.

## Project Structure

```
incident-management-system/
├── backend/
│   └── server.js          # Express API server (auth + RBAC + incidents)
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Dashboard.js      # Role-aware dashboard
│   │   │   ├── Login.js          # Login screen
│   │   │   ├── IncidentList.js
│   │   │   ├── IncidentFilters.js
│   │   │   ├── IncidentModal.js
│   │   │   ├── StatsPanel.js
│   │   │   └── *.css      # Component styles
│   │   ├── utils/
│   │   │   └── api.js     # API client (with JWT support)
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

1. **Install backend dependencies:**
```bash
npm install
```

2. **Install frontend dependencies:**
```bash
cd frontend
npm install
cd ..
```

## Running the Application

### Option 1: Run Backend and Frontend Separately

1. **Start the backend server (in terminal 1):**
```bash
npm start
```
The backend API will run on `http://localhost:5000`

2. **Start the frontend development server (in terminal 2):**
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000` and will automatically open in your browser.

### Option 2: Quick Start Scripts

The project includes convenient npm scripts:

```bash
# Start backend server
npm start

# Start frontend (in a new terminal)
npm run client

# Install all dependencies (backend + frontend)
npm run install-all
```

## API Endpoints

All incident endpoints require a valid JWT token in the `Authorization: Bearer <token>` header.

### Authentication
- `POST /api/auth/login` - Login and receive a JWT token
- `GET /api/auth/me` - Get current authenticated user info

### Incidents
- `GET /api/incidents` - Get all incidents (supports filtering) — *all roles*
  - Query params: `status`, `priority`, `assignee`
- `GET /api/incidents/:id` - Get a specific incident — *all roles*
- `POST /api/incidents` - Create a new incident — *admin, manager*
- `PUT /api/incidents/:id` - Update an incident — *admin, manager*
- `DELETE /api/incidents/:id` - Delete an incident — *admin only*

### Statistics
- `GET /api/incidents/stats/summary` - Get incident statistics — *all roles*

### Health Check
- `GET /api/health` - API health check (no auth required)

## Usage

### Signing In
1. Open the app at `http://localhost:3000`
2. Enter your username and password (demo accounts are shown on the login page)
3. Your role badge will appear in the dashboard header after login

### Viewing Incidents
- The dashboard displays all incidents in a table format
- Click on any incident row to view full details

### Filtering Incidents
- Use the filter panel to narrow down incidents:
  - **Status Filter**: Show only incidents with a specific status
  - **Priority Filter**: Show only incidents with a specific priority
  - **Assignee Search**: Search for incidents by assignee name
- Click "Clear Filters" to reset all filters

### Creating an Incident *(admin, manager)*
1. Click the "Create New Incident" button
2. Fill in the incident details:
   - Title (required)
   - Description (required)
   - Priority (Critical/High/Medium/Low)
   - Assignee
3. Click "Create" to save

### Editing an Incident *(admin, manager)*
1. Click the "Edit" button on an incident row, or
2. Click an incident to view details, then click "Edit"
3. Update the fields
4. Click "Save Changes"

### Deleting an Incident *(admin only)*
1. Click an incident to view details
2. Click the "Delete" button
3. Confirm the deletion

## Data Model

### Incident Object
```javascript
{
  id: "uuid",
  title: "string",
  description: "string",
  status: "open" | "in-progress" | "resolved" | "closed",
  priority: "critical" | "high" | "medium" | "low",
  createdAt: "ISO 8601 date string",
  updatedAt: "ISO 8601 date string",
  assignee: "string"
}
```

## Customization

### Changing the API URL
The frontend is configured to use `http://localhost:5000/api` by default. To change this:

1. Create a `.env` file in the `frontend` directory
2. Add: `REACT_APP_API_URL=http://your-api-url/api`

### Adding Database Support
The backend currently uses in-memory storage. To add database support:

1. Install a database driver (e.g., MongoDB, PostgreSQL)
2. Replace the `incidents` array in `backend/server.js` with database queries
3. Update the CRUD operations to use your database

## Technologies Used

### Backend
- **Express.js** - Web framework
- **jsonwebtoken** - JWT creation and verification
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **body-parser** - Request body parsing
- **uuid** - Unique ID generation

### Frontend
- **React** - UI library
- **CSS3** - Styling with modern features
- **Fetch API** - HTTP client

## Future Enhancements

- Real-time updates using WebSockets
- File attachments for incidents
- Comment threads on incidents
- Email notifications
- Advanced analytics and reporting
- Export data to CSV/PDF
- Dark mode support
- Incident history and audit log
- Persistent database storage

## License

MIT License
