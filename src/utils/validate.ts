import {ElDatePicker} from 'element-ui/types/date-picker';

export function isValidUsername(str: string) {
  // const validMap = ['admin', 'editor'];
  // return validMap.indexOf(str.trim()) >= 0;
  return str.length > 3;
}

export function isNotEmpty(str: string): boolean {
  if (str === undefined) {
    return false;
  }
  if (!str) {
    return false;
  }
  if (str.replace(/(^\s*)|(\s*$)/g, '').length === 0) {
    return false;
  }
  return true;
}

/**
 * 都不为空
 * @param str
 */
export function thereAreNotEmpty(...str: string[]): boolean {
  return str.every((val) => isNotEmpty(val));
}

/**
 * 任何一个不为空
 * @param str
 */
export function anyNotEmpty(...str: string[]): boolean {
  return str.some((val) => isNotEmpty(val));
}

export function validateURL(textval: string): boolean {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

export function validateLowerCase(str: string): boolean {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

export function validateUpperCase(str: string): boolean {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

export function validatAlphabets(str: string): boolean {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}
export function validPhoneNo(str: string): boolean {
  const reg = /^1\d{10}$/;
  return reg.test(str);
}

export function validPhoneNoRule(rule: any, value: string, callback: ((cc?: Error) => void)) {
  if (!validPhoneNo(value)) {
    callback(new Error('请输入正确的手机号'));
  } else {
    callback();
  }
}

export function pickerOptions(): any {
  const CALMONTH = 25;
  const getNowDate = () => {
    const nowDate = new Date();
    nowDate.setHours(0);
    nowDate.setMinutes(0);
    nowDate.setSeconds(0);
    nowDate.setMilliseconds(0);
    nowDate.setTime(nowDate.getTime() + 3600 * 24 * 1000);
    return nowDate;
  };
  return {
    shortcuts: [{
      text: '最近一周',
      onClick(picker: ElDatePicker) {
        const end = getNowDate();
        const start = new Date(end.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
      },
    }, {
      text: '上一个周期',
      onClick(picker: ElDatePicker) {
        const end = getNowDate();
        if (end.getDate() <= CALMONTH) {
          end.setMonth(end.getMonth() - 1);
        }
        end.setDate(CALMONTH);

        const start = new Date(end.getTime());
        start.setMonth(end.getMonth() - 1);
        end.setDate(end.getDate() + 1);
        picker.$emit('pick', [start, end]);
      },
    }, {
      text: '上三个周期',
      onClick(picker: ElDatePicker) {
        const end = getNowDate();
        if (end.getDate() <= CALMONTH) {
          end.setMonth(end.getMonth() - 1);
        }
        end.setDate(CALMONTH);
        const start = new Date(end.getTime());
        start.setMonth(end.getMonth() - 3);
        end.setDate(end.getDate() + 1);
        picker.$emit('pick', [start, end]);
      },
    }, {
      text: '近一个周期',
      onClick(picker: ElDatePicker) {
        const end = getNowDate();
        end.setDate(CALMONTH);

        const start = new Date(end.getTime());
        start.setMonth(end.getMonth() - 1);
        end.setDate(end.getDate() + 1);
        picker.$emit('pick', [start, end]);
      },
    }, {
      text: '近三个周期',
      onClick(picker: ElDatePicker) {
        const end = getNowDate();
        end.setDate(CALMONTH);
        const start = new Date(end.getTime());
        start.setMonth(end.getMonth() - 3);
        end.setDate(end.getDate() + 1);
        picker.$emit('pick', [start, end]);
      },
    }],
  };
}
