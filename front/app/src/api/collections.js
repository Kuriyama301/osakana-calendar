import client from "./client";

export const collectionsAPI = {
  getCollections: async () => {
    try {
      const response = await client.get("/api/v1/fish_collections");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      throw error;
    }
  },

  addCollection: async (fishId) => {
    try {
      const response = await client.post("/api/v1/fish_collections", {
        fish_id: fishId,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to add collection:", error);
      throw error;
    }
  },

  removeCollection: async (fishId) => {
    try {
      await client.delete(`/api/v1/fish_collections/${fishId}`);
    } catch (error) {
      console.error("Failed to remove collection:", error);
      throw error;
    }
  },
};
