import {Location} from "@/apis/shared";
import {useEffect, useState} from "react";
import {getLifeSuggestion, SuggestionItem} from "@/apis/life";
import {handleAxiosError} from "@/utils";
//当日生活指数
export const useLifeIndex = (location: Location | null, days: number) => {
    const [lifeIndex, setLifeIndex] = useState<SuggestionItem[] | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await getLifeSuggestion({
                    key: process.env.EXPO_PUBLIC_API_KEY || "",
                    location: location?.id as string,
                    days
                });
                setLifeIndex(data.results[0].suggestion);
            } catch (error) {
                handleAxiosError(error);
            }
        }

        if (location?.id) {
            fetchData();
        }
    }, [location]);
    return {lifeIndex};
}