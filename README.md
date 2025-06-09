# Smart Traffic Management System

A comprehensive system for modeling, optimizing, and visualizing traffic flow in urban environments.

## Project Overview

The Smart Traffic Management System models real-world city street networks, computes and adapts optimal routes and traffic-light timings in real time, and visualizes both 2D graphs and 3D animations in a clean, minimalistic modern UI.

## Features

- **Data Acquisition & Graph Modeling**: Download real city data via OSMnx and model road networks as weighted graphs
- **Core Algorithms**: Implement shortest/fastest path algorithms, traffic-light timing optimization, and rerouting logic
- **2D & 3D Visualization**: View the network in both 2D map view and 3D simulation
- **Dynamic Traffic Management**: Adapt to traffic incidents and congestion in real-time

## Tech Stack

### Backend
- Python 3.11+
- FastAPI for HTTP API
- Uvicorn as ASGI server
- OSMnx for OpenStreetMap street networks
- NetworkX for graph algorithms

### Frontend
- React (v18+)
- Tailwind CSS
- Three.js for 3D simulation
- Vite as build tool
- Axios for API calls

## Project Structure

```
smart-traffic-management-system/
├── backend/               # Python FastAPI backend
│   ├── app/               # Application code
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Core functionality
│   │   ├── models/        # Data models
│   │   └── services/      # Business logic services
│   ├── tests/             # Backend tests
│   └── Dockerfile         # Backend containerization
├── frontend/              # React frontend
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── pages/         # Page components
│   │   └── assets/        # Static assets
│   └── Dockerfile         # Frontend containerization
└── docs/                  # Documentation
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the development server:
   ```
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

## API Documentation

Once the backend server is running, you can access the API documentation at:
```
http://localhost:8000/docs
```

## Testing

### Backend Tests
```
cd backend
pytest
```

### Frontend Tests
```
cd frontend
npm test
```

## License

[MIT License](LICENSE)
