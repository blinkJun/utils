const { version } = require("./package.json");
const path = require("path");
const fs = require("fs");

const docsPath = path.resolve(__dirname, `./docs/@blinkjun/utils/${version}`);
const targetDocsPath = path.resolve(__dirname, `./docs/@blinkjun-utils`);

const copy = (sd, td) => {
    // 读取目录下的文件，返回文件名及文件类型{name: 'xxx.txt, [Symbol(type)]: 1 }
    const sourceFile = fs.readdirSync(sd, { withFileTypes: true });
    for (const file of sourceFile) {
        // 源文件 地址+文件名
        const srcFile = path.resolve(sd, file.name);
        // 目标文件
        const tagFile = path.resolve(td, file.name);
        // 文件是目录且未创建
        if (file.isDirectory() && !fs.existsSync(tagFile)) {
            fs.mkdirSync(tagFile, (err) => console.log(err));
            copy(srcFile, tagFile);
        } else if (file.isDirectory() && fs.existsSync(tagFile)) {
            // 文件时目录且已存在
            copy(srcFile, tagFile);
        }
        !file.isDirectory() &&
            fs.copyFileSync(srcFile, tagFile, fs.constants.COPYFILE_FICLONE);
    }
};

if (!fs.existsSync(targetDocsPath)) {
    fs.mkdirSync(targetDocsPath);
}

copy(docsPath, targetDocsPath);
