import { useState } from "react";
import { getFishByDate } from "../api/fish";

export const useFishModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModalDate, setSelectedModalDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [seasonalFish, setSeasonalFish] = useState([]);
  const [error, setError] = useState(null);

  const handleDateClick = async (date) => {
    const formattedDate = `${date.getFullYear()}年${
      date.getMonth() + 1
    }月${date.getDate()}日`;
    setSelectedModalDate(formattedDate);
    setIsLoading(true);
    setError(null);
    try {
      const fishData = await getFishByDate(date);
      setSeasonalFish(fishData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch fish data:", error);
      setError("データの取得に失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isModalOpen,
    selectedModalDate,
    isLoading,
    seasonalFish,
    error,
    handleDateClick,
    closeModal: () => setIsModalOpen(false),
  };
};
