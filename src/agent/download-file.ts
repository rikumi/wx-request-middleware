import { RequestAgent } from '@/interfaces';

type DownloadFileResult = WechatMiniprogram.DownloadFileSuccessCallbackResult;

/**
 * 用 wx.downloadFile 实现的下载文件 agent，可以实现不经过内存下载临时文件，并支持读取响应头
 * - 只支持 GET 请求，不支持 data 参数
 * - 下载后得到的 res.data 为临时文件路径
 */
const downloadFileAgent: RequestAgent = async (options) => {
  const { url, header: reqHeader, timeout, onFileProgress } = options;

  const response = await new Promise<DownloadFileResult & { header: any }>((resolve, reject) => {
    const header = {};
    const onSuccess: WechatMiniprogram.DownloadFileSuccessCallback = (response) => {
      console.log('downloadFileAgent onSuccess', response);
      resolve({ ...response, header }); // 顺序不能错，response 里面可能会有错误的 header
    };
    const downloadTask = wx.downloadFile({
      url,
      header: reqHeader,
      timeout,
      success: onSuccess,
      fail: reject,
    });
    downloadTask.onHeadersReceived((res) => {
      console.log('downloadFileAgent onHeadersReceived', res.header);
      if (typeof res.header === 'object') Object.assign(header, res.header);
    });
    downloadTask.onProgressUpdate((res) => {
      console.log('downloadFileAgent onProgressUpdate', `${res.totalBytesWritten}/${res.totalBytesExpectedToWrite} = ${res.progress}%`);
      onFileProgress?.(res.progress / 100);
    });
  });
  const { header, tempFilePath, statusCode, errMsg } = response;
  return { header, data: tempFilePath, statusCode, errMsg } as any; // 不支持微信新增的属性
};

export default downloadFileAgent;
