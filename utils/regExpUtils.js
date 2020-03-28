/**
 * 正则表达式工具类
 */
var regExpUtils = {

    checkEmail: function (emailStr) {
        var emailRegExp = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
        if (emailStr != null && emailStr != '') {
            var reg = new RegExp(emailRegExp, 'g')
            return reg.test(emailStr);
        } else {
            return false;
        }
    },

    checkEmailSingleChar: function (char) {
        var emailSingleCharRegExp = /^[.@\d\w\-\_]$/;
        if (char != null && char != '') {
            var reg = new RegExp(emailSingleCharRegExp, 'g')
            return reg.test(char);
        } else {
            return false;
        }
    }
}
module.exports = {
    checkEmail: regExpUtils.checkEmail,
    checkEmailSingleChar: regExpUtils.checkEmailSingleChar
}