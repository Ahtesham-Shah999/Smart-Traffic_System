import axios from 'axios'

// Use direct URL to backend instead of relying on proxy
const API_URL = 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add withCredentials for CORS
  withCredentials: false
})

// Network endpoints
export const fetchNetwork = async (bbox) => {
  try {
    const response = await api.get('/network', {
      params: {
        min_x: bbox.min_x,
        min_y: bbox.min_y,
        max_x: bbox.max_x,
        max_y: bbox.max_y
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching network:', error)
    throw new Error(error.response?.data?.detail || 'Failed to fetch network data')
  }
}

export const fetchSampleNetwork = async () => {
  try {
    console.log('Fetching sample network from:', `${API_URL}/network/sample`)
    const response = await api.get('/network/sample')
    console.log('Sample network response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching sample network:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      request: error.request
    })
    throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch sample network data')
  }
}

export const fetchIntersections = async () => {
  try {
    const response = await api.get('/network/intersections')
    return response.data
  } catch (error) {
    console.error('Error fetching intersections:', error)
    throw new Error(error.response?.data?.detail || 'Failed to fetch intersections')
  }
}

export const fetchRoads = async () => {
  try {
    const response = await api.get('/network/roads')
    return response.data
  } catch (error) {
    console.error('Error fetching roads:', error)
    throw new Error(error.response?.data?.detail || 'Failed to fetch roads')
  }
}

// Helper function to ensure a network is loaded before running simulations
const ensureNetworkLoaded = async () => {
  try {
    // Check if network is loaded
    const debugResponse = await api.get('/network/debug');

    // If no network is loaded, load the sample network
    if (debugResponse.data.status === 'no_network') {
      console.log('No network loaded, loading sample network...');
      await api.get('/network/sample');
      console.log('Sample network loaded successfully');
    } else {
      console.log('Network already loaded:', debugResponse.data);
    }
    return true;
  } catch (error) {
    console.error('Error ensuring network is loaded:', error);
    return false;
  }
};

// Simulation endpoints
export const runBasicSimulation = async () => {
  try {
    // First ensure a network is loaded
    await ensureNetworkLoaded();

    console.log('Running basic simulation at:', `${API_URL}/simulate/basic`);
    const response = await api.post('/simulate/basic');
    console.log('Basic simulation response:', response.data);

    // Validate the response data
    if (!response.data || !response.data.routes || !response.data.traffic_lights) {
      console.error('Invalid simulation response data:', response.data);
      throw new Error('Invalid simulation data received from server');
    }

    // Ensure routes have waypoints
    if (response.data.routes.length > 0 && (!response.data.routes[0].waypoints || response.data.routes[0].waypoints.length === 0)) {
      console.error('Routes missing waypoints:', response.data.routes);
      throw new Error('Routes missing waypoints data');
    }

    return response.data;
  } catch (error) {
    console.error('Error running basic simulation:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      request: error.request
    });
    throw new Error(error.response?.data?.detail || error.message || 'Failed to run basic simulation');
  }
}

export const runDynamicSimulation = async (incident) => {
  try {
    // First ensure a network is loaded
    await ensureNetworkLoaded();

    // Validate incident data
    if (!incident.road_id || incident.road_id.trim() === '') {
      throw new Error('Road ID is required for dynamic simulation');
    }

    console.log('Running dynamic simulation with incident:', incident);
    const response = await api.post('/simulate/dynamic', incident);
    console.log('Dynamic simulation response:', response.data);

    // Validate the response data
    if (!response.data || !response.data.routes || !response.data.traffic_lights) {
      console.error('Invalid simulation response data:', response.data);
      throw new Error('Invalid simulation data received from server');
    }

    return response.data;
  } catch (error) {
    console.error('Error running dynamic simulation:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      request: error.request
    });
    throw new Error(error.response?.data?.detail || error.message || 'Failed to run dynamic simulation');
  }
}

export const runComplexSimulation = async (request) => {
  try {
    // First ensure a network is loaded
    await ensureNetworkLoaded();

    // Validate request data
    if (request.incidents && request.incidents.length > 0) {
      for (const incident of request.incidents) {
        if (!incident.road_id || incident.road_id.trim() === '') {
          throw new Error('Road ID is required for all incidents in complex simulation');
        }
      }
    }

    console.log('Running complex simulation with request:', request);
    const response = await api.post('/simulate/complex', request);
    console.log('Complex simulation response:', response.data);

    // Validate the response data
    if (!response.data || !response.data.routes || !response.data.traffic_lights) {
      console.error('Invalid simulation response data:', response.data);
      throw new Error('Invalid simulation data received from server');
    }

    return response.data;
  } catch (error) {
    console.error('Error running complex simulation:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      request: error.request
    });
    throw new Error(error.response?.data?.detail || error.message || 'Failed to run complex simulation');
  }
}

export const fetchStatus = async () => {
  try {
    const response = await api.get('/status')
    return response.data
  } catch (error) {
    console.error('Error fetching status:', error)
    throw new Error(error.response?.data?.detail || 'Failed to fetch status')
  }
}
