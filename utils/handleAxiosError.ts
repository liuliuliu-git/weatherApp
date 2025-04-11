import axios from 'axios';
import Toast from 'react-native-toast-message';

// 错误处理函数
export const handleAxiosError = (error) => {
    if (axios.isAxiosError(error)) {
        // 获取状态码和错误信息
        const status = error?.response?.status || null;
        const errorMessage = error?.response?.data?.message || error.message;
        switch (status) {
            case 400:
                Toast.show({
                    type: 'error',
                    text1: '请求错误',
                    text2: errorMessage,
                });
                break;
            case 401:
                Toast.show({
                    type: 'error',
                    text1: '未授权',
                    text2: '请检查您的登录状态',
                });
                break;
            case 403:
                Toast.show({
                    type: 'error',
                    text1: '禁止访问',
                    text2: '您没有权限访问此资源',
                    position: "top",
                });
                break;
            case 404:
                Toast.show({
                    type: 'error',
                    text1: '未找到',
                    text2: '请求的资源不存在',
                });
                break;
            case 500:
                Toast.show({
                    type: 'error',
                    text1: '服务器错误',
                    text2: '请稍后再试',
                });
                break;
            default:
                Toast.show({
                    type: 'error',
                    text1: '网络异常',
                    text2: '请稍后再试',
                });
                break;
        }
    } else {
        // 非 Axios 错误
        console.error('非 Axios 错误:', error);
        Toast.show({
            type: 'error',
            text1: '未知错误',
            text2: '请稍后再试',
        });
    }
};