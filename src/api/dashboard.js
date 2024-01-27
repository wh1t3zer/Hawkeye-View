import request from '@/utils/request'


export function DefaultDashboard(query) { //获取默认全局视图
    return request({
        url: '/dashboard/all',
        method: 'get',
        params: query
    })
}
