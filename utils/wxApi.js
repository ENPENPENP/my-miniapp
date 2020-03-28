var wxApi = {
    wxSaveFileApi: function (_tempFilePath, _filePath) {
        return new Promise((resolve, reject) => {
            wx.saveFile({
                tempFilePath: _tempFilePath,
                filePath: _filePath,
                success: (result) => {
                    resolve(result)
                },
                fail: (err) => {
                    reject(err);
                },
            });
        })
    },

    wxDownLoadFileApi: function (_url) {
        return new Promise((resolve, reject) => {
            wx.downloadFile({
                url: _url,
                success: (result) => {
                    resolve(result);
                },
                fail: (err) => {
                    reject(err);
                },
            });
        })

    },

    wxOpenDocumentApi: function (_filePath, _fileType) {
        return new Promise((resolve, reject) => {
            wx.openDocument({
                filePath: _filePath,
                fileType: _fileType,
                success: (result) => {
                    resolve(result);
                },
                fail: (err) => {
                    reject(err);
                },
            });
        })

    }
}
module.exports = {
    wxDownLoadFileApi: wxApi.wxDownLoadFileApi,
    wxSaveFileApi: wxApi.wxSaveFileApi,
    wxOpenDocumentApi: wxApi.wxOpenDocumentApi
}