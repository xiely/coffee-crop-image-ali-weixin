<template>
  <view class="container">
    <view class="input-area">
      <textarea v-model="prompt" placeholder="请输入描述文字..." />
    </view>
    <view class="button-area">
      <button type="primary" @click="createPic">生成图片</button>
    </view>
    <view class="image-area" v-if="imageUrl">
      <image :src="imageUrl" mode="widthFix" />
    </view>
  </view>
</template>
<script setup>
import { onBeforeMount, reactive, toRefs, ref } from "vue";
const prompt = ref("一间有着精致窗户的花店，漂亮的木质门，摆放着花朵");
const apiKey = "sk-3b792e4d2f4545e3afa88abc0a0bcdb2"
const imageUrl = ref()

const generateImage = async () => {
    const apiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
    return new Promise((resolve, reject) => {
        uni.request({
            method: 'post',
            //   timeout: config.timeout || timeout,
            url: apiUrl,
            data: {
                model: "wanx2.1-t2i-turbo", // 模型名称
                input: {
                    prompt: prompt.value // 用户输入的描述文字
                },
                parameters: {
                    size: "600*600", // 图片大小
                    n: 1 // 生成图片的数量
                }
            },
            header: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'X-DashScope-Async': 'enable' // 异步处理
            },
            dataType: 'json'
        }).then(response => {
            resolve(response)
            console.log(response, "aaaaaaaaaaaaaaaaaaaaaaa")
            // const taskId = response.data.task_id; // 获取任务ID
            // const result = await checkTaskStatus(taskId, apiKey); // 查询任务状态并获取结果
            // imageUrl.value = result.output.results[0].url; // 显示图片
        })
        // const response = await axios.post(apiUrl, {
        //     model: "wanx2.1-t2i-turbo", // 模型名称
        //     input: {
        //         prompt: prompt.value // 用户输入的描述文字
        //     },
        //     parameters: {
        //         size: "1024*1024", // 图片大小
        //         n: 1 // 生成图片的数量
        //     }
        // }, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${apiKey}`,
        //         'X-DashScope-Async': 'enable' // 异步处理
        //     }
        // });
        // const data = {
        //     prompt: prompt.value
        // }
        // setTask(data)


        // catch (error) {
        //     console.error('生成图片失败:', error);
        //     uni.showToast({
        //         title: '生成图片失败，请检查输入或网络连接',
        //         icon: 'none'
        //     });
        // }

    })

}

const createPic = async () => {
    let response = await generateImage();
    const taskId = response.data.output.task_id; // 获取任务ID
    console.log(response, "RRRRRRRR")
    const result = await checkTaskStatus(taskId, apiKey); // 查询任务状态并获取结果
    imageUrl.value = result.output.results[0].url; // 显示图片
    console.log(imageUrl.value, "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
}

const checkTaskStatus = async (taskId, apiKey) => {
    const checkUrl = `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`;
    let result;
    while (true) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 每隔3秒查询一次
        try {
            const response = await uni.request({
                method: 'get',
                url: checkUrl,
                header: {
                    'Authorization': `Bearer ${apiKey}`,
                },
            });
            // uni.request 返回 [res] 或 [err, res]，大部分平台只返回 response
            const res = Array.isArray(response) ? response[1] || response[0] : response;
            result = res.data;
            const status = result?.output?.task_status || result?.task_status;
            if (status && status !== 'RUNNING') {
                break;
            }
        } catch (err) {
            console.error('查询任务状态失败:', err);
        }
    }
    return result;
}
</script>


<style>
.container {
    padding: 20px;
}

.header {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
}

.input-area {
    margin-bottom: 20px;
}

.button-area {
    margin-bottom: 20px;
}

.image-area {
    margin-top: 20px;
}
</style>