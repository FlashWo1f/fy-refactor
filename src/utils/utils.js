import { message, notification } from "ant-design-vue"
// 类型判断
const isType = type => obj =>
  obj != null && Object.prototype.toString.call(obj) === `[object ${type}]`;

export const isFn = isType('Function');
export const isArr = Array.isArray || isType('Array');
export const isObj = val => typeof val === 'object';
export const isStr = isType('String');
export const isNum = isType('Number');

export function trim(str = '') {
  if (!isStr(str)) return str;
  return str.replace(/^\s+|\s+$/g, '');
}

// 表单值去除首尾空格
export function trimFormValue(formDate, excludeArr = []) {
  const copyFormDate = { ...formDate };
  Object.keys(copyFormDate).forEach(ele => {
    if (excludeArr.indexOf(copyFormDate[ele]) > -1) return;
    if (typeof copyFormDate[ele] === 'string') {
      copyFormDate[ele] = trim(copyFormDate[ele]);
    }
  });
  return copyFormDate;
}

/**
 * JSON.parse 和stringify的威力之 改变对象的key
 * @arr 需要转换的对象数组
 * @keyMap 示例：将id转成key => {'id': 'key'}
 */
export function changeObjKey(arr = [], keyMap) {
  let tempString = JSON.stringify(arr);
  for (var key in keyMap) {
    var reg = `/"${key}":/g`;
    tempString = tempString.replace(eval(reg), '"' + keyMap[key] + '":');
  }
  return JSON.parse(tempString)
}

/* */
export function flatObj(gData, keys = []) {
  const dataList = [];
  const generateList = data => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const value = {}
      keys.forEach(item => (value[item] = node[item]))
      dataList.push({ ...value });
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  generateList(gData)
  return dataList
}

/**
 * 
 * @param {*} str '1002-1005-1003-1004'
 * @param {*} splitStr '-'
 *  result ====> [ '1002', '1002-1005', '1002-1005-1003', '1002-1005-1003-1004' ]
 */

export function splitCodeFn(str, splitStr = '') {
  const splitCode = str.split(splitStr)
  const my = []
  splitCode.reduce((pre, cur, index) => {
    if (index === 0) {
      my.push(cur)
      return cur
    } else {
      my.push(`${pre}${splitStr}${cur}`)
      return `${pre}${splitStr}${cur}`
    }
  }, splitCode[0])
  return my
}

// 判断字段是否为空
export const isEmpty = val => {
  if (!val && !isNum(val)) {
    return true;
  }
};

export function renderNull(target, str = "（空）") {
  if (isEmpty(target)) return str;
  return target;
}

export function showMessage(type, content) {
  message[type](content);
}

export function showNotification(config, type = 'error') {
  const defaultConfig = {
    duration: null,
    description: "default",
    message: 'default',
  }
  notification[type]({ ...defaultConfig, ...config })
}

export function assignObj(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// 判断是否以 https | tel | mailto 开头
export function isAbsolutePath(path) {
  return /^(https?|tel|mailto)/.test(path);
}

export function splitDate(str = "") {
  return str.split(" ")[0];
}

export function deleteEmptyField(obj) {
  Object.keys(obj).forEach(item => {
    if (isEmpty(obj[item])) delete obj[item];
  });
  return obj;
}

export function getFirstSplit(str = "", splitStr = " ") {
  return str.split(splitStr)[0]
}

export const debounce = (fn, delay) => {
  let timer = null
  return function (...args) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {fn.apply(this, args)}, delay) 
  }
}
