import WeatherDetailTabs from "./WeatherDetailTabs";
import LiveTab from "@/components/tabCpns/LiveTab";

/**
 * 天气详情默认页面，直接显示 live 页面内容
 */
export default function WeatherDetailIndex() {
    return (
        <>
            <WeatherDetailTabs />
            <LiveTab />
        </>
    );
}
