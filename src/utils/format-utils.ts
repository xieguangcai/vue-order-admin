interface Dictionary<T> { [key: string]: T; }


export function formatDate(date: Date, fmt: string): string {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  const o: Dictionary<number> = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };

  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
    }
  }
  return fmt;
}

export type  DateUnit = 'y' | 'M' | 'd' | 'h' | 'm' | 's' | 'w' ;

export function addDate(num: number, type: DateUnit, start?: Date): Date {
  if (start == null) {
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
    case 'w':
      start.setDate(start.getDate() + num * 7);
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

export function addDateFormatString(num?: number, type?: DateUnit, start?: Date, fmt?: string): string {
  if (fmt == null) {
    fmt = 'yyyy-MM-dd hh:mm:ss';
  }
  let curStart: Date;
  if (start == null) {
    curStart = new Date();
  } else {
    curStart = new Date(+ start);
  }
  if (null == num) {
    num = 0;
  }
  if (type == null) {
    type = 's';
  }
  if (0 !== num) {
    start = addDate(num, type, curStart);
  }
  return formatDate(curStart, fmt);
}

function padLeftZero(str: string): string {
  return ('00' + str).substr(str.length);
}
