# Quick Start Guide - Incident Management System

## Prerequisites
- Node.js v14+ and npm v6+
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation Steps

### 1. Clone the repository
```bash
git clone https://github.com/CanarysPlayground/Agentic-AI-in-SDLC.git
cd Agentic-AI-in-SDLC
```

### 2. Install Dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

## Running the Application

### Terminal 1 - Start Backend Server
```bash
npm start
```
Server runs on: http://localhost:5000

### Terminal 2 - Start Frontend Application
```bash
cd frontend
npm start
```
Frontend runs on: http://localhost:3000

The browser will automatically open to the dashboard.

## Using the Dashboard

### 1. View Incidents
- All incidents are displayed in a table
- Click any incident row to view full details

### 2. Filter Incidents
- **By Status**: Open, In Progress, Resolved, Closed
- **By Priority**: Critical, High, Medium, Low  
- **By Assignee**: Type to search by name
- Click "Clear Filters" to reset

### 3. Create New Incident
1. Click "Create New Incident" button
2. Fill in required fields (Title, Description)
3. Set Priority and Assignee (optional)
4. Click "Create"

### 4. Edit Incident
1. Click "Edit" button on any incident row
2. Update fields as needed
3. Click "Save Changes"

### 5. Delete Incident
1. Click on an incident to view details
2. Click "Delete" button
3. Confirm deletion

## API Endpoints

### Incidents
- `GET /api/incidents` - List all incidents (supports filtering)
- `GET /api/incidents/:id` - Get single incident
- `POST /api/incidents` - Create new incident
- `PUT /api/incidents/:id` - Update incident
- `DELETE /api/incidents/:id` - Delete incident

### Statistics
- `GET /api/incidents/stats/summary` - Get incident statistics

### Query Parameters (GET /api/incidents)
- `status` - Filter by status (open, in-progress, resolved, closed)
- `priority` - Filter by priority (critical, high, medium, low)
- `assignee` - Search by assignee name

## Example API Requests

### Get all open incidents
```bash
curl http://localhost:5000/api/incidents?status=open
```

### Get all critical priority incidents
```bash
curl http://localhost:5000/api/incidents?priority=critical
```

### Create a new incident
```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Issue",
    "description": "Description here",
    "priority": "high",
    "assignee": "John Doe"
  }'
```

### Update an incident
```bash
curl -X PUT http://localhost:5000/api/incidents/{incident-id} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "resolved"
  }'
```

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:

**Backend:**
```bash
PORT=5001 npm start
```

**Frontend:**
Update `frontend/src/utils/api.js` to use the new backend port.

### CORS Issues
The backend is configured with CORS enabled. If you still face issues, check that:
1. Backend is running on port 5000
2. Frontend is making requests to `http://localhost:5000/api`

### Backend Not Loading
Ensure all dependencies are installed:
```bash
npm install
```

### Frontend Not Loading
```bash
cd frontend
npm install
npm start
```

## Features Implemented

✅ **Backend API**
- RESTful API with Express.js
- CRUD operations for incidents
- Filtering by status, priority, and assignee
- Real-time statistics endpoint
- Sample incident data

✅ **Frontend Dashboard**
- Modern React UI with responsive design
- Incident list with sortable display
- Advanced filtering capabilities
- Status tracking with visual badges
- Create, view, edit, and delete incidents
- Real-time statistics panel
- Mobile-friendly responsive design

## Technology Stack

### Backend
- Express.js - Web framework
- CORS - Cross-origin resource sharing
- body-parser - Request parsing
- UUID - Unique ID generation

### Frontend
- React - UI library
- CSS3 - Styling
- Fetch API - HTTP client

## Next Steps

Consider implementing:
- Database integration (MongoDB, PostgreSQL)
- User authentication
- Real-time updates with WebSockets
- File attachments
- Comment threads
- Email notifications
- Advanced analytics
