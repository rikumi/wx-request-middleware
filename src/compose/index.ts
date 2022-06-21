import { RequestContext, RequestMiddleware } from '@/interfaces';

/**
 * 中间件组合器，类似 Koa Compose
 * @param middlewareStack 中间件栈
 */
const compose = ([first, ...rest]: RequestMiddleware[]) => (ctx: RequestContext): Promise<void> => {
  return first?.(ctx, compose(rest).bind(null, ctx));
};

export default compose;
