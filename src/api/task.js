import request from '@/utils/request'


export function InfoList(query) { //资产任务列表
    return request({
        url: '/task/list',
        method: 'get',
        params: query
    })
}

export function TaskInfo(query) { //资产信息
    return request({
        url: '/task/info',
        method: 'get',
        params: query
    })
}

export function TaskDetail(query) { //资产详情, 任务视图的数据格式 
    return request({
        url: '/task/detail',
        method: 'get',
        params: query
    })
}

export function TaskAdd(data) { //添加任务
    return request({
        url: '/task/add',
        method: 'post',
        data
    })
}

export function TaskExec(query) { //资产详情, 任务视图的数据格式 
    return request({
        url: '/task/exec',
        method: 'patch',
        params: query
    })
}