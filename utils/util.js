//将时间戳转换成 yy/MM/dd 日期格式
const formatToDateTime = timeStamp => {
    var date = new Date(timeStamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':');
}
const formatToTime = timeStamp => {
    var date = new Date(timeStamp);
    const hour = date.getHours();
    const minute = date.getMinutes();
    return [hour, minute].map(formatNumber).join(':');
}
const formatToDate = timeStamp => {
    var date = new Date(timeStamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [year, month, day].map(formatNumber).join('-');
}
//添加前导零
const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : '0' + n;
}
// 将bool转换成中文的‘是否’
const formatBool = (bool) => {
    if (bool) return "是";
    else return "否";
}

const stringNotNull = (targetString) => {
    if (typeof (targetString) == 'string') {
        if (targetString != null && targetString != '') {
            return true;
        }
    }
    console.log('targetString is null');
    return false;
}

const foldString = (targetString, afterIndex, replaceChar) => {

    var _replaceChar = this.stringNotNull(replaceChar) ? replaceChar : '.';
    if (this.stringNotNull(targetString) && afterIndex != null) {
        if (typeof (afterIndex) == 'number' && afterIndex < targetString.length) {
            for (let index = afterIndex; index < targetString.length; index++) {
                array[index] = _replaceChar;
            }
        }

    }

}

const delay = (milSec) => {
    return new Promise(resolve => {
        setTimeout(resolve, milSec)
    })
}

module.exports = {
    formatToDateTime: formatToDateTime,
    formatToDate: formatToDate,
    formatToTime: formatToTime,
    formatNumber: formatNumber,
    formatBool: formatBool,
    stringNotNull: stringNotNull,
    delay: delay,
    foldString:foldString
}