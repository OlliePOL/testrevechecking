import { API_URL } from '../config';

// ...

const fetchEntries = async () => {
  try {
    const response = await axios.get(`${API_URL}/revenue-entries`);
    setEntries(response.data);
  } catch (error) {
    console.error('Failed to fetch entries', error);
  }
};

// Podobnie zaktualizuj inne wywołania API