import requestAgent from '@/agent/request';
import compose from '@/compose';
import { Request, RequestAgent, RequestContext, RequestMiddleware, RequestOptions, Response } from '@/interfaces';
import normalizeRequestBody from './normalize';

/**
 * 执行请求，使用 wx.request 的对象格式作为参数
 */
const dispatchRequest = async (options: RequestOptions, middlewareStack: RequestMiddleware[], agent?: RequestAgent) => {
  const { header, data, ...restOptions } = options;

  const request: Request = {
    header: header || {}, // 保证中间件内始终有 header
    data: normalizeRequestBody(data),
    ...restOptions,
  };

  const response: Response = {
    data: undefined,
    header: undefined,
    statusCode: 0,
    errMsg: '',
  };

  // 发送请求，以内部中间件的形式存在，会在执行请求时拼到中间件栈的最末尾
  const send = async (ctx: RequestContext) => {
    Object.assign(ctx.response, await (ctx.agent ?? requestAgent)(ctx.request));
  };

  await compose([...middlewareStack, send])({
    agent,
    request,
    response,
    state: {},
  });

  return response;
};

export default dispatchRequest;
