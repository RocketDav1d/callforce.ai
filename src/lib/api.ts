// src/lib/api.ts
import axios from 'axios';

export const fetchHubSpotTokens = async (userId: string) => {
    try {
        const response = await axios.get(`/api/user/${userId}/tokens`);
        return response.data;
    } catch (error) {
        console.error('Error fetching HubSpot tokens:', error);
        return null;
    }
}
