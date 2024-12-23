import client from "./client";

export const favoritesAPI = {
  getFavorites: async () => {
    try {
      const response = await client.get("/api/v1/favorites");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      throw error;
    }
  },

  addFavorite: async (fishId) => {
    try {
      const response = await client.post("/api/v1/favorites", {
        fish_id: fishId,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to add favorite:", error);
      throw error;
    }
  },

  removeFavorite: async (fishId) => {
    try {
      await client.delete(`/api/v1/favorites/${fishId}`);
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      throw error;
    }
  },
};
