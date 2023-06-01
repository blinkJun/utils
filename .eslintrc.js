module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 11,
        parser: "babel-eslint",
        sourceType: "module",
    },
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    extends: ["plugin:prettier/recommended"],
    rules: {
        "prettier/prettier": "error",
        "arrow-body-style": "off", // 关闭规则
        "prefer-arrow-callback": "off", // 关闭规则
    },
};
