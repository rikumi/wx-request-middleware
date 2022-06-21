import { RequestAgent } from '@/interfaces';

/**
 * RequestAgent 的默认实现，只对 wx.request 进行 promisify，因为 QQ 小程序基础库暂不支持自动 promisify
 */
const requestAgent: RequestAgent = async options => new Promise((resolve, reject) => {
  wx.request({
    ...options,
    success: resolve,
    fail: reject,
  });
});

export default requestAgent;
