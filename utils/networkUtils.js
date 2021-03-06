var networkUtils = {

    default_method: 'GET',

    default_dataType: 'json',

    get_contentType: 'application/json',

    post_contentType: 'application/x-www-form-urlencoded',

    default_timeout: 10000,

    api_path: 'http://localhost:24560/api/miniapp',

    httpRequest: function (url, data, method, dataType, timeout) {
        return new Promise((resolve, reject) => {
            var _data = data != null ? data : {};
            var _method = method != null ? method : networkUtils.default_method;
            var _dataType = dataType != null ? dataType : networkUtils.default_dataType;
            var _timeout = timeout != null ? timeout : networkUtils.default_timeout;
            var _contentType = (_method == 'GET' || _method == null) ? networkUtils.get_contentType : networkUtils.post_contentType;
            if (url == null || url == "") {
                reject({
                    err: "url is null"
                })
            }
            wx.request({
                timeout: _timeout,
                url: url,
                data: _data,
                header: {
                    'content-type': _contentType
                },
                method: _method,
                dataType: _dataType,
                responseType: 'text',
                success: (res) => {
                    resolve(res)
                },
                fail: (err) => {
                    reject(err)
                }
            })
        })
    },
    get: function (url, dataType, timeout) {
        return new Promise((resolve, reject) => {
            var _timeout = timeout != null ? timeout : networkUtils.default_timeout;
            var _dataType = dataType != null ? dataType : networkUtils.default_dataType;
            if (url == null || url == "") {
                reject({
                    err: "url is null"
                })
            }
            wx.request({
                timeout: _timeout,
                url: url,
                header: {
                    'content-type': networkUtils.get_contentType
                },
                method: 'GET',
                dataType: _dataType,
                responseType: 'text',
                success: (res) => {
                    resolve(res)
                },
                fail: (err) => {
                    reject(err)
                }
            })
        })
    },
    post: function (url, data, dataType, timeout) {
        return new Promise((resolve, reject) => {
            var _data = data != null ? data : {};
            var _dataType = dataType != null ? dataType : networkUtils.default_dataType;
            var _timeout = timeout != null ? timeout : networkUtils.default_timeout;
            if (url == null || url == "") {
                reject({
                    err: "url is null"
                })
            }
            wx.request({
                timeout: _timeout,
                url: url,
                data: _data,
                header: {
                    'content-type': networkUtils.post_contentType
                },
                method: 'POST',
                dataType: _dataType,
                responseType: 'text',
                success: (res) => {
                    resolve(res)
                },
                fail: (err) => {
                    reject(err)
                }
            })
        })
    },

    wxLogin: function () {
        return new Promise((resovle, reject) => {
            wx.login({
                success: (res) => {
                    if (res.code) {
                        resovle(res)
                    } else {
                        reject(res.errMsg)
                    }
                },
                fail: (err) => {
                    reject(err)
                }
            })
        })
    }

}
module.exports = {
    api_path: networkUtils.api_path,
    httpRequest: networkUtils.httpRequest,
    get: networkUtils.get,
    post: networkUtils.post,
    wxLogin: networkUtils.wxLogin
}