# Incident Management System

A full-stack incident management system with a React frontend dashboard and Node.js/Express backend API.

## Features

### Backend API
- RESTful API with Express.js
- In-memory data storage (easily extendable to use a database)
- Complete CRUD operations for incidents
- Filtering by status, priority, and assignee
- Real-time statistics endpoint
- Sample incident data for testing

### Frontend Dashboard
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
- **Full Incident Management**:
  - Create new incidents
  - View incident details
  - Edit existing incidents
  - Delete incidents
- **Responsive Design** - works on desktop, tablet, and mobile

## Project Structure

```
incident-management-system/
├── backend/
│   └── server.js          # Express API server
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── IncidentList.js
│   │   │   ├── IncidentFilters.js
│   │   │   ├── IncidentModal.js
│   │   │   ├── StatsPanel.js
│   │   │   └── *.css      # Component styles
│   │   ├── utils/
│   │   │   └── api.js     # API client functions
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

### Incidents
- `GET /api/incidents` - Get all incidents (supports filtering)
  - Query params: `status`, `priority`, `assignee`
- `GET /api/incidents/:id` - Get a specific incident
- `POST /api/incidents` - Create a new incident
- `PUT /api/incidents/:id` - Update an incident
- `DELETE /api/incidents/:id` - Delete an incident

### Statistics
- `GET /api/incidents/stats/summary` - Get incident statistics

### Health Check
- `GET /api/health` - API health check

## Usage

### Viewing Incidents
- The dashboard displays all incidents in a table format
- Click on any incident row to view full details

### Filtering Incidents
- Use the filter panel to narrow down incidents:
  - **Status Filter**: Show only incidents with a specific status
  - **Priority Filter**: Show only incidents with a specific priority
  - **Assignee Search**: Search for incidents by assignee name
- Click "Clear Filters" to reset all filters

### Creating an Incident
1. Click the "Create New Incident" button
2. Fill in the incident details:
   - Title (required)
   - Description (required)
   - Priority (Critical/High/Medium/Low)
   - Assignee
3. Click "Create" to save

### Editing an Incident
1. Click the "Edit" button on an incident row, or
2. Click an incident to view details, then click "Edit"
3. Update the fields
4. Click "Save Changes"

### Deleting an Incident
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
- **CORS** - Cross-origin resource sharing
- **body-parser** - Request body parsing
- **uuid** - Unique ID generation

### Frontend
- **React** - UI library
- **CSS3** - Styling with modern features
- **Fetch API** - HTTP client

## Future Enhancements

- User authentication and authorization
- Real-time updates using WebSockets
- File attachments for incidents
- Comment threads on incidents
- Email notifications
- Advanced analytics and reporting
- Export data to CSV/PDF
- Dark mode support
- Incident history and audit log

## License

MIT License
