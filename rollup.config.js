import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import rimraf from 'rimraf';
import fg from 'fast-glob';
import path from 'path';

const srcDir = './src';
const outDir = './dist';
const typesDirName = 'types';
const formats = ['esm', 'cjs'];

rimraf.sync(outDir);

/**
 * @param {string[]} entries
 * @returns {import("rollup").RollupOptions[]}
 */
const createBundleFromEntries = (...entries) =>
    entries
        .map((entry) => entry.replace('src/', ''))
        .map((entry) => [
            {
                input: path.join(srcDir, entry),
                plugins: [esbuild({ minify: true })],
                output: formats.map((format) => ({
                    format,
                    dir: path.join(outDir, format, path.parse(entry).dir),
                })),
            },
            {
                input: path.join(srcDir, entry),
                plugins: [dts()],
                output: { dir: path.join(outDir, typesDirName, path.parse(entry).dir) },
            },
        ])
        .flat();

const entryFilesPattern = 'src/**/*.ts';

/**
 * @type {import("rollup").RollupOptions[]}
 */
const config = [
    {
        input: 'src/index.ts',
        plugins: [esbuild({ minify: true })],
        output: {
            format: 'umd',
            name: 'itUtils',
            file: path.join(outDir, 'umd/it-utils.js'),
            sourcemap: true,
            esModule: false,
        },
    },
].concat(createBundleFromEntries.apply(null, fg.sync(entryFilesPattern)));

export default config;
