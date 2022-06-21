# wx-request-middleware

中间件模式的微信/QQ 小程序统一网络请求库

## 开始使用

### 使用 requestRaw 发起不带中间件的普通请求

```ts
import { requestRaw } from 'wx-request-middleware';

requestRaw.get('https://qq.com/', {
  header: { cookie: 'foo=bar' }, 
}).then((res) => {
  console.log(res.data);
});

requestRaw.post('https://qq.com/', { foo: 'bar' }, {
  header: { 'Content-Type': 'application/x-www-form-urlencoded' },
}).then((res) => {
  console.log(res.data);
});
```

### 流式上传和下载文件

```ts
import { requestRaw, FileUploadStream } from 'wx-request-middleware';

// 借助 wx.downloadFile 流式下载文件
requestRaw.getFile('https://qq.com/my-file').then((res) => {
  const tempFilePath = res.data;
  console.log(tempFilePath);
});

// 借助 wx.uploadFile 流式上传文件，只支持以表单形式上传单个文件
requestRaw.postFile('https://qq.com/my-file', {
  myFile: new FileUploadStream(tempFilePath),
  foo: 'bar',
}).then((res) => {
  console.log(res.data);
});
```

### 定制中间件实现多种拦截功能

```ts
import * as url from 'url';
import RequestBus, { RequestMiddleware } from 'wx-request-middleware';

const baseUrlMiddleware = async (ctx, next) => {
  ctx.request.url = url.resolve('https://qq.com/', ctx.request.url);
  await next();
};

export const request = new RequestBus();
request.use(baseUrlMiddleware);

request.get('/').then((res) => console.log(res.data));
```

## API

```ts
RequestBus
- new RequestBus()
- use(middleware: RequestMiddleware): void
- get(url: string, options?: RequestOptions): Promise<Response>
- getFile(url: string, options?: RequestOptions): Promise<Response<string>>
- post(url: string, data?: any, options?: RequestOptions): Promise<Response>
- postFile(url: string, data?: any, options?: RequestOptions): Promise<Response>
- put(url: string, data?: any, options?: RequestOptions): Promise<Response>
- ['delete'](url: string, options?: RequestOptions): Promise<Response>
- head(url: string, options?: RequestOptions): Promise<Response>
- options(url: string, options?: RequestOptions): Promise<Response>
- trace(url: string, options?: RequestOptions): Promise<Response>
- connect(url: string, data?: any, options?: RequestOptions): Promise<Response>

FileUploadStream
- new FileUploadStream(filePath: string)

RequestOptions: WechatMiniprogram.RequestOption
- onFileProgress?: (progressFloat: number) => void

RequestContext
- agent?: RequestAgent
- request: Request
- response: Response
- state: any

RequestMiddleware
- (ctx: RequestContext, next: () => Promise<void>): Promise<void>
```