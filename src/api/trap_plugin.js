import request from '@/utils/request'

export function TrapPluginList(query) { //检出列表
    return request({
        url: '/trap/plugin/list',
        method: 'get',
        params: query
    })
}

export function DetectInfo(query) { //检出详情
    return request({
        url: '/webvul/detect',
        method: 'get',
        params: query
    })
}

export function TaskList(query) { //任务列表
    return request({
        url: '/webvul/tasks',
        method: 'get',
        params: query
    })
}

export function TrapPluginAdd(data) { //创建插件
    return request({
        url: '/trap/plugin/add',
        method: 'post',
        data
    })
}

export function TrapPluginPut(data) { //修改插件
    return request({
        url: '/trap/plugin/update',
        method: 'put',
        data
    })
}

export function DelTask(query) { //删除任务
    return request({
        url: '/webvul/task',
        method: 'delete',
        params: query
    })
}

export function TrapPluginDel(query) { //创建插件
    return request({
        url: '/trap/plugin/delete',
        method: 'delete',
        params: query
    })
}