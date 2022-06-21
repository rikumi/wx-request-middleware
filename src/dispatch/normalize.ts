/**
 * 对请求体进行预处理，去除 undefined 和 null 的值
 * 如果确实和后台约定了传 null，请用字符串形式
 */
const normalizeRequestBody = (object: any) => {
  if (typeof object === 'object' && object !== null && !(object instanceof ArrayBuffer)) {
    for (const key of Object.getOwnPropertyNames(object)) {
      if (object[key] == null) {
        delete object[key];
      } else {
        object[key] = normalizeRequestBody(object[key]);
      }
    }
  }
  return object;
};

export default normalizeRequestBody;
