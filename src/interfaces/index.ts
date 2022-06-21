export interface RequestOptions extends WechatMiniprogram.RequestOption {
  onFileProgress?: (progressFloat: number) => void;
}
export type RequestResult<T = any> = WechatMiniprogram.RequestSuccessCallbackResult<T>;
export type RequestAgent = (options: RequestOptions) => Promise<RequestResult>;
export type Request = Omit<RequestOptions, 'success' | 'fail' | 'complete'>;
export type Response<T = any> = Omit<RequestResult<T>, 'cookies' | 'profile'>;

/**
 * 请求上下文，类似 Koa Context
 */
export interface RequestContext {
  agent: RequestAgent | undefined;
  request: Request;
  response: Response;
  state: any;
}

/**
 * 请求中间件，类似 Koa Middleware
 */
export type RequestMiddleware = (ctx: RequestContext, next: () => Promise<void>) => Promise<void>;
