import request from '@/utils/request'


export function InfoList(query) { //资产信息列表
    return request({
        url: '/asset/list',
        method: 'get',
        params: query
    })
}

export function AssetInfo(query) { //资产信息详情
    return request({
        url: '/asset/info',
        method: 'get',
        params: query
    })
}

export function DelInfo(query) { //删除资产信息
    return request({
        url: '/asset/delete',
        method: 'delete',
        params: query
    })
}

export function AssetDetail(query) { //获取详情
    return request({
        url: '/asset/detail',
        method: 'get',
        params: query
    })
}

export function AddRule(data){
    return request({
        url: '/asset/rule/add',
        method: 'post',
        data
    })
}