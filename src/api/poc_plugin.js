import request from '@/utils/request'

export function PocPluginList(query) { //插件列表
    return request({
        url: '/vul/plugin/list',
        method: 'get',
        params: query
    })
}

export function AddPlugin(data) { //添加插件
    return request({
        url: '/vul/plugin/add',
        method: 'post',
        data
    })
}

export function PocDelPlugin(query) { //删除插件
    return request({
        url: '/vul/plugin/delele',
        method: 'delete',
        params: query
    })
}