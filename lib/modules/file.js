/**
 * @module File
 */

/**
 * @method downloadBlobData
 * @description post下载二进制文件
 * @param {Blob} data 二进制数据
 * @param {String} fileName 文件名
 * @param {String} contentType 文件类型如：'text/csv'
 *
 */
export function downloadBlobData(data, fileName, contentType) {
    var blob = new Blob([data], { type: contentType });
    var downloadElement = document.createElement("a");
    var href = window.URL.createObjectURL(blob); // 创建下载的链接
    downloadElement.href = href;
    downloadElement.download = fileName; // 下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); // 点击下载
    document.body.removeChild(downloadElement); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 释放掉blob对象
}

/**
 * @method getResourceNameByUrl
 * @description 尝试从url中获取资源名称
 * @param {String} url
 * @return {String} 资源名称
 */
export const getResourceNameByUrl = function (url, ext = false) {
    let name = url.split("/").reverse()[0];
    name = ext ? name : name.split(".")[0];
    return name;
};

/**
 * @method splitFile
 * @description 对文件进行切片
 * @param {Blob} file 文件数据
 * @param {Number} chunkSize 切片大小
 * @return {Array} 切片数组
 */
export function splitFile(file, chunkSize) {
    const chunks = [];

    let chunkIndex = 0;
    for (let cur = 0; cur < file.size; cur += chunkSize) {
        const itemChunkSize =
            cur + chunkSize > file.size ? file.size - cur : chunkSize;
        chunks.push({
            chunkIndex: chunkIndex++,
            chunk: file.slice(cur, cur + chunkSize),
            realChunkSize: itemChunkSize,
        });
    }
    return chunks;
}
