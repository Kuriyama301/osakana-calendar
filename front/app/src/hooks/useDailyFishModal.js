import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useFishModal } from './useFishModal';

export const useDailyFishModal = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  
  const {
    isModalOpen,
    selectedModalDate,
    isLoading,
    seasonalFish,
    error,
    handleDateClick,
    closeModal
  } = useFishModal();

  useEffect(() => {
    const checkDailyFish = async () => {
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const lastVisit = localStorage.getItem('lastVisitDate');

        if (lastVisit !== today) {
          await handleDateClick(new Date());
          localStorage.setItem('lastVisitDate', today);
        }
      } catch (e) {
        console.error('Daily fish check failed:', e);
      } finally {
        setInitialLoading(false);
      }
    };

    checkDailyFish();
  }, [handleDateClick]);

  const isPageLoading = initialLoading || isLoading;

  return {
    isModalOpen,
    selectedModalDate,
    isLoading: isPageLoading,
    seasonalFish,
    error,
    closeModal
  };
};