import request from '@/utils/request'

export function TrojanList(query) { //检出列表
    return request({
        url: '/trojan/service/list',
        method: 'get',
        params: query
    })
}
