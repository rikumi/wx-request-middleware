import { RequestAgent } from '@/interfaces';

type UploadFileResult = WechatMiniprogram.UploadFileSuccessCallbackResult;

/**
 * 用于表示表单中需要上传的文件，只需要传入文件路径，uploadFileAgent 会识别出该对象并传给 wx.uploadFile 实现流式上传该文件
 */
export class FileUploadStream {
  public constructor(public readonly filePath: string) {}
}

/**
 * 用 wx.uploadFile 实现的上传文件 agent，可以实现不经过内存上传文件
 * - 只支持 POST 请求，只支持表单（multipart/form-data）格式
 * - data 必须为对象，data 内部有且仅有一个 FileUploadStream 对象，用于表示要上传的文件
 */
const uploadFileAgent: RequestAgent = async (options) => {
  const { url, data, header: reqHeader, dataType, timeout, onFileProgress } = options;

  // 取出表单内的 FileUploadStream 对象，将对应的文件路径和 key（作为 name 参数）传给 wx.uploadFile
  const name = Object.keys(data).find(k => data[k] instanceof FileUploadStream);
  if (!name) {
    throw Error('uploadFileAgent file not found in data');
  }
  const {
    [name]: { filePath },
    ...formData
  } = data;

  // 发起请求，这里为了收到响应头，额外加上一些逻辑
  const response = await new Promise<UploadFileResult & { header: any }>((resolve, reject) => {
    const header = {};
    const onSuccess: WechatMiniprogram.UploadFileSuccessCallback = (response) => {
      console.log('uploadFileAgent onSuccess', response);
      // iOS 下这里个别机器可能会有 header 出现，这个 header 里面每一个值是数组格式，理论上是更合理的，但是违背了官方给的接口定义，所以这里先丢弃不看，以 onHeadersReceived 收到的为准
      const { data, statusCode, errMsg } = response;
      resolve({ header, data, statusCode, errMsg });
    };
    const uploadTask = wx.uploadFile({
      url,
      header: reqHeader,
      name,
      filePath,
      formData,
      timeout,
      success: onSuccess,
      fail: reject,
    });
    uploadTask.onHeadersReceived((res) => {
      console.log('uploadFileAgent onHeadersReceived', res.header);
      if (typeof res.header === 'object') Object.assign(header, res.header);
      // 安卓 QQ 小程序会把头返回成一个字符串，样例如下
      // {connection=[keep-alive], date=[Wed, 22 Dec 2021 15:23:47 GMT], etag=["5b9b014576a56cd9a65ef09e8a145f7f"], location=[http://cos.ap-guangzhou.myqcloud.com/temp/u144115216682031405/import_5b9b014576a56cd9a65ef09e8a145f7f.xlsx], server=[tencent-cos], x-cos-hash-crc64ecma=[6409953996168020123], x-cos-request-id=[NjFjMzQzMDJfODkxNDZiMGJfMWRjZWVfZGFiN2Y0NA==]}
      if (typeof res.header === 'string') {
        const kvRegExp = /([^\s{},=]+)=\[(.*?)]/g;
        while (kvRegExp.exec(res.header)) (header as any)[RegExp.$1] = RegExp.$2;
      }
    });
    uploadTask.onProgressUpdate((res) => {
      console.log('uploadFileAgent onProgressUpdate', `${res.totalBytesSent}/${res.totalBytesExpectedToSend} = ${res.progress}%`);
      onFileProgress?.(res.progress / 100);
    });
  });

  // 基础库不会处理 uploadFile 的 dataType 参数，这里代替基础库做处理，对齐 request 的行为，默认解析 JSON
  if (!dataType || dataType === 'json') {
    try {
      response.data = JSON.parse(response.data);
    } catch (e) {}
  }

  // 组装响应对象，模拟 Wx.request 的结构
  const { header, data: resData, statusCode, errMsg } = response;
  return { header, data: resData, statusCode, errMsg } as any; // 不支持微信新增的属性
};

export default uploadFileAgent;
