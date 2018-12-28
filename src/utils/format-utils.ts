import {strict} from "assert";

type Dictionary<T> = { [key: string]: T };


export function formatDate (date: Date, fmt: string): string {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o : Dictionary<number> = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }

  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

export type  DateUnit = 'y' | 'M' | 'd' | 'h' | 'm' | 's'  ;

export function addDate(num : number, type: DateUnit, start?: Date) : Date{
  if(start == null){
    start = new Date();
  }
  switch (type) {
    case 'y':
      start.setFullYear(start.getFullYear() + num);
      break;
    case 'M':
      start.setMonth(start.getMonth() + num);
      break;
    case 'd':
      start.setDate(start.getDate() + num);
      break;
    case 'h':
      start.setHours(start.getHours() + num);
      break;
    case 'm':
      start.setMinutes(start.getMinutes() + num);
      break;
    case 's':
      start.setSeconds(start.getSeconds() + num);
      break;
  }
  return start;
}

export function addDateFormatString(num?: number, type?: DateUnit, start?: Date, fmt?: string) : string{
  if(fmt == null){
    fmt = 'yyyy-MM-dd hh:mm:ss';
  }
  if(start == null){
    start = new Date();
  }
  if(null == num){
    num = 0;
  }
  if(type == null){
    type = 's';
  }
  if(0 !== num){
    start = addDate(num, type, start);
  }
  return formatDate(start, fmt);
}

function padLeftZero (str: string) : string {
  return ('00' + str).substr(str.length)
}
