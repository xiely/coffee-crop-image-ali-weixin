import request from '@/utils/request'
const apiKey = 'sk-3b792e4d2f4545e3afa88abc0a0bcdb2';

export function setTask(data) {
    return request({
        url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
        method:'post',
        headers: {
            isToken: false,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'X-DashScope-Async': 'enable' // 异步处理
        },
        data:{
            model: "wanx2.1-t2i-turbo", // 模型名称
            input: {
                prompt: data.prompt // 用户输入的描述文字
            },
            parameters: {
                size: "1024*1024", // 图片大小
                n: 1 // 生成图片的数量
            }
        }
    })
}