import axios from 'axios'

const request = axios.create({
    baseURL: 'https://api.seniverse.com/v3',
    timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use(async (config) => {
    // const {store} = await import('@/store')
    // const token = store.getState().user.token
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}` // 注入 token
    // }
    return config
}, (error) => {
    return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use((response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data
}, async (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.dir(error)
    // if (error.response.status === 401) {
    //     // 防止store重复调用
    //     const {store} = await import('@/store')
    //     // 1. 清空 Redux 里的用户信息
    //     store.dispatch(clearUserInfo());
    //     // 2. 跳转到登录页
    //     await router.navigate('/login');
    //     // 3. 刷新页面（可选，确保状态同步）
    //     window.location.reload();
    // }
    return Promise.reject(error)
})

export {request}