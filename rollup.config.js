// 混淆代码
import { terser } from "rollup-plugin-terser";
import tsPlugin from "rollup-plugin-typescript2";
export default {
    input: "lib/index.js",
    output: [
        {
            file: "dist/bundle.js",
            format: "umd",
            name: "$utils",
        },
        {
            file: "dist/bundle.esm.js",
            format: "es",
            name: "$utils",
        },
    ],
    plugins: [
        tsPlugin({
            // 覆盖 tsconfig.json 配置
            tsconfigOverride: {
                compilerOptions: {
                    allowJs: true,
                    module: "es2020",
                    declaration: true /* 生成相关的 '.d.ts' 文件。 */,
                    declarationDir: "./dist/types" /* '.d.ts' 文件输出目录 */,
                    emitDeclarationOnly: true /* 只生成声明文件，不生成 js 文件*/,
                    rootDir:
                        "./lib" /* 指定输出文件目录（用于输出），用于控制输出目录结构 */,
                },
            },
            useTsconfigDeclarationDir: true,
            include: "**/*.js+(|x)",
        }),
        terser(),
    ],
};
