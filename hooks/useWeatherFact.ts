import { useState, useEffect } from 'react';
import { getWeatherNow, WeatherNow } from '@/apis/weather/weatherFact';
import { handleAxiosError } from '@/utils';
import { Location } from '@/apis/shared';
// 天气实况
export const useWeatherFact = (location: Location | null) => {
  const [now, setNow] = useState<WeatherNow | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await getWeatherNow({
          key: process.env.EXPO_PUBLIC_API_KEY || "",
          location: location?.id as string,
        });
        if (data.results && data.results.length > 0) {
          setNow(data.results[0].now);
        }
      } catch (error) {
        handleAxiosError(error);
      }
    }

    if (location?.id) {
      fetchData();
    }
  }, [location]);

  return { now };
}; 