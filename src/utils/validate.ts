import {ElDatePicker} from "element-ui/types/date-picker";

export function isValidUsername(str: string) {
  const validMap = ['admin', 'editor'];
  return validMap.indexOf(str.trim()) >= 0;
}

export function validateURL(textval: string) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

export function validateLowerCase(str: string) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

export function validateUpperCase(str: string) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

export function validatAlphabets(str: string) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}


export function pickerOptions() : any{
  const CALMONTH = 25;
  let getNowDate = function(){
    let nowDate = new Date();
    nowDate.setHours(0);
    nowDate.setMinutes(0);
    nowDate.setSeconds(0);
    nowDate.setMilliseconds(0);
    nowDate.setTime(nowDate.getTime()+ 3600*24*1000);
    return nowDate;
  };
  return {
    shortcuts: [{
      text: '最近一周',
      onClick(picker: ElDatePicker) {
        const end = getNowDate();
        const start = new Date(end.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '上一个周期',
      onClick(picker: ElDatePicker) {
        const end = getNowDate();
        if(end.getDate() <= CALMONTH){
          end.setMonth(end.getMonth() - 1);
        }
        end.setDate(CALMONTH);

        const start = new Date(end.getTime());
        start.setMonth(end.getMonth() - 1);
        end.setDate(end.getDate() + 1);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '上三个周期',
      onClick(picker: ElDatePicker) {
        const end = getNowDate();
        if(end.getDate() <= CALMONTH){
          end.setMonth(end.getMonth() - 1);
        }
        end.setDate(CALMONTH);
        const start = new Date(end.getTime());
        start.setMonth(end.getMonth() - 3);
        end.setDate(end.getDate() + 1);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '近一个周期',
      onClick(picker: ElDatePicker) {
        const end = getNowDate();
        end.setDate(CALMONTH);

        const start = new Date(end.getTime());
        start.setMonth(end.getMonth() - 1);
        end.setDate(end.getDate() + 1);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '近三个周期',
      onClick(picker: ElDatePicker) {
        const end = getNowDate();
        end.setDate(CALMONTH);
        const start = new Date(end.getTime());
        start.setMonth(end.getMonth() - 3);
        end.setDate(end.getDate() + 1);
        picker.$emit('pick', [start, end]);
      }
    }]
  }
}
