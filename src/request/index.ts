import downloadFileAgent from '../agent/download-file';
import uploadFileAgent from '../agent/upload-file';
import dispatchRequest from '../dispatch';
import { RequestMiddleware, RequestOptions, Response } from '../interfaces';

/**
 * 请求中心，类似 Koa Application
 */
export default class RequestBus {
  private middlewareStack: RequestMiddleware[] = [];

  /**
   * 创建一个请求中心实例
   */
  public constructor() {}

  /**
   * 为当前实例使用某个中间件，后续所有请求都经过该中间件
   */
  public use(middleware: RequestMiddleware) {
    this.middlewareStack.push(middleware);
  }

  /**
   * 执行 GET 请求
   */
  public async get(url: string, options?: Omit<RequestOptions, 'url'>) {
    return dispatchRequest({ url, method: 'GET', ...options }, this.middlewareStack);
  }

  /**
   * 利用小程序接口执行不经过内存的下载文件请求，只支持 get 请求，回调的 data 为下载后的临时文件路径
   * 例：const { header, data: tempFilePath } = await requestGuest.getFile('https://qq.com/example-download', ...);
   */
  public async getFile(url: string, options?: Omit<RequestOptions, 'url'>): Promise<Response<string>> {
    return dispatchRequest({ url, method: 'GET', ...options }, this.middlewareStack, /* agent: */ downloadFileAgent);
  }

  /**
   * 执行 POST 请求
   */
  public async post(url: string, data?: any, options?: Omit<RequestOptions, 'url'>) {
    return dispatchRequest({ url, method: 'POST', data, ...options }, this.middlewareStack);
  }

  /**
   * 利用小程序接口上传文件，该方式不需要占用内存，流式上传，但由于小程序限制，仅支持 POST form-data 格式的请求
   * 本接口对表单内传入文件的方式进行了调整，需要在表单中有且只有一个 FileUploadStream 对象，用于表示要上传的文件
   */
  public async postFile(url: string, data: any, options?: Omit<RequestOptions, 'url'>) {
    return dispatchRequest({ url, method: 'POST', data, ...options }, this.middlewareStack, /* agent: */ uploadFileAgent);
  }

  /**
   * 执行 PUT 请求
   */
  public async put(url: string, data?: any, options?: Omit<RequestOptions, 'url'>) {
    return dispatchRequest({ url, method: 'PUT', data, ...options }, this.middlewareStack);
  }

  /**
   * 执行 DELETE 请求
   */
  public async delete(url: string, options?: Omit<RequestOptions, 'url'>) {
    return dispatchRequest({ url, method: 'DELETE', ...options }, this.middlewareStack);
  }

  /**
   * 执行 HEAD 请求
   */
  public async head(url: string, options?: Omit<RequestOptions, 'url'>) {
    return dispatchRequest({ url, method: 'HEAD', ...options }, this.middlewareStack);
  }

  /**
   * 执行 OPTIONS 请求
   */
  public async options(url: string, options?: Omit<RequestOptions, 'url'>) {
    return dispatchRequest({ url, method: 'OPTIONS', ...options }, this.middlewareStack);
  }

  /**
   * 执行 TRACE 请求
   */
  public async trace(url: string, options?: Omit<RequestOptions, 'url'>) {
    return dispatchRequest({ url, method: 'TRACE', ...options }, this.middlewareStack);
  }

  /**
   * 执行 CONNECT 请求
   */
  public async connect(url: string, data?: any, options?: Omit<RequestOptions, 'url'>) {
    return dispatchRequest({ url, method: 'CONNECT', data, ...options }, this.middlewareStack);
  }
}

/**
 * 默认请求中心单例，不带任何中间件
 */
export const requestRaw = new RequestBus();
