//import { plugins } from './rollup-config/plugins.js';
//import { getModules } from './rollup-config/getModules.js';
//https://github.com/vuetifyjs/vuetify/blob/d1251f50f2d85b34c06c65895bd2d2b82bdd412e/packages/vuetify/build/rollup.config.mjs#L8
const packageJson = require('./package.json')
import alias from 'rollup-plugin-alias';
import { mkdirp } from 'mkdirp'
import path from 'path';
import cssnano from 'cssnano'
import sass from 'rollup-plugin-sass';
import babel from 'rollup-plugin-babel';
const postcss = require('postcss');
import autoprefixer from 'autoprefixer';
let dev = process.env.NODE_ENV == 'local';
const modules = !dev ? getModules() : [];
const extensions = ['.ts', '.tsx', '.js', '.jsx', '.es6', '.es', '.mjs']
const fse = require('fs-extra');
const fs = require('fs');
const banner = `/*!
* Vuetify v${packageJson.version}
* Forged by John Leider
* Released under the MIT License.
*/\n`


function fixWindowsPath(path) {
  return path.replace(/^[^:]+:\\/, '\\').replaceAll('\\', '/')
}

function createDirectories(pathname) {
   const __dirname = path.resolve();
   pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension
   fs.mkdir(path.resolve(__dirname, pathname), { recursive: true }, e => {
       if (e) {
           console.error(e);
       } else {
           console.log('Success');
       }
    });
}
function deleteFolderRecursive (directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file, index) => {
          const curPath = path.join(directoryPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
           // recurse
            deleteFolderRecursive(curPath);
          } else {
            // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(directoryPath);
      }
    }
export default [{
    input: 'src/index.js',
    output: [
        {
            file: packageJson.main,
            format: 'umd',
            sourcemap: false,
			name: 'testZoo',
			
        banner,
        },
       
    ],
	plugins: [
		sass({
			options: {
			  charset: false,
			},
			output (styles, styleNodes) {
			  // Complete CSS bundle
				let util = require('util');

				const fs2 = fs.promises; 
				Promise.all([
					util.promisify(fs.mkdir)('dist'),
					//util.promisify(fs.readFile)('./text.txt')
				])
				.then((a) => {
				   
					postcss([autoprefixer]).process(styles, { from: 'src' })
				}).then(() => {
					return Promise.all([
						postcss([autoprefixer]).process(styles, { from: 'src' }),
						postcss([autoprefixer, cssnano({
							preset: 'default',
							postcssZindex: false,
							reduceIdents: false,
						})])
						.process(styles, { from: 'src' }),
					])
					}).then(result => {
						console.log("writing");
				
				fs.writeFile("dist/vuetify.css", banner + result[0].css,{encoding: "utf8",  flag: "w",  mode: 0o666} ,(err) => {
				if (err){
				  console.log(err);
				}
				else {
					console.log("File written successfully\n");
					console.log("The written has the following contents:");   
				}});
	
	
				})
				.catch ((e) => {
					console.log(e.message);
				})
				for (const { id, content } of styleNodes) {
				//id : abs pathname to file (including file name)
				//out is an object
				//out.dir abs path name to directory without file name
				//out.name file name
				const out = path.parse(id.replace('src','lib'));            
				if (fs.existsSync(out.dir)){
					deleteFolderRecursive(out.dir);
				}

				const asynMkDir= util.promisify(fs.mkdir)
				asynMkDir(out.dir).then(res => {
					//asynMkDir start
					//write file start

					fs.writeFile(path.join(out.dir, out.name + '.css'), content,{encoding: "utf8",  flag: "w",  mode: 0o666} ,(err) => {
					if (err){
						console.log(err);
					}
					else {
						console.log("File written successfully\n");				
					}});	
					//write file finish
					//asynMkDir finish
				})
				.catch(err => console.error(err))
					
			  }
			}//finish of output css,
      }),
	  alias({
        entries: [
        //  { find: /^@\/(.*)/, replacement: fileURLToPath(new URL('../src/$1', import.meta.url)) },
		{ find: /^@\/(.*)/, replacement: path.join(__dirname, "src/$1") },
		
        ],
      }),
	   {
         buildEnd () {
			//start async buildEnd ()
          const components = Object.create(null)
          const variables = []
		  console.log("before components");
		  
		   
			 console.log("after components");
		  //finish async buildEnd ()
		}
		
	   }
 
  ]
	}]

//https://github.com/andrewwhitehead/oceanfront/blob/c5d29e745eb29586494ed48bff409d620cba135c/packages/oceanfront/rollup.config.js#L7/
// inject: (css, { insertAt } = {}) => {
//https://github.com/nl-design-system/denhaag/blob/72fe7974fd668b40eda93a5c0d69a45762818ef1/rollup.config.mjs
//https://github.com/search?q=repo%3Acohubinc%2Fcohub-ui%20%40import&type=code
//tsconfig _generateInputs
//https://github.com/carbon-design-system/carbon-for-ai/blob/e1467c0f98c0d687965b2bc7da1de3f07cfbd15e/tools/rollup.config.dist.js#L125
//https://github.com/theatersoft/components/blob/ed021b425c8dc599197b47d26dcb6d063d5e9112/spec/rollup/build.js#L22
//https://github.com/wix/stylable/blob/master/scripts/build.js
//autobuild
//https://github.com/touho/openeditplay/blob/0b63a28165715c06a900cc09e7a3cef013e7a38d/autobuild.js#L60
//banner on warn sassRender
//https://github.com/nagix/mini-tokyo-3d/blob/e1cffbb7c6250231e3a5d9ab201c543312438fa5/rollup.config.mjs#L21
//https://github.com/staylor/mustache-css-modules/blob/8bf68b235f6b7805d3577a85a75b7a7f935b8e82/js/postcss.config.js#L18
//const cssDictionary = {};
//import babel from 'rollup-plugin-babel';
//import commonjs from 'rollup-plugin-commonjs';
//import typescript from 'rollup-plugin-typescript';
//import eslint from 'rollup-plugin-eslint';
//import angular from 'rollup-plugin-angular';
// PostCSS plugins
//import simplevars from 'postcss-simple-vars';
//import nested from 'postcss-nested';
//import cssnext from 'postcss-cssnext';
//import cssnano from 'cssnano';
//import scss from "rollup-plugin-scss";
//import postcssPresetEnv from 'postcss-preset-env';
//import autoprefixer from 'autoprefixer';
//import sass from 'rollup-plugin-sass';
//import pkg from './package.json'
//import string from 'rollup-plugin-string';

//import resolve from 'rollup-plugin-node-resolve';
//import postcss from 'rollup-plugin-postcss';
//import typescript from 'rollup-plugin-typescript';
//import autoprefixer from 'autoprefixer';
//import babel from 'rollup-plugin-babel';
//import scss from 'rollup-plugin-scss';
//import commonjs from 'rollup-plugin-commonjs';
//import sass from 'rollup-plugin-sass';
//import { getModules } from './rollup-config/getModules.js';
//https://github.com/zooplus/zoo-web-components/blob/b00c5286829d324eee2f99f855964e4cdac783d4/rollup-config/getModules.js#L33
//https://github.com/sakshamgupta912/CollabSphereFrontEnd/tree/d936ea0b2b3461d3ad077da552c9b871d895e92a/Index
/*console.log(`
-------------------------------------
Rollup building bundle for ${process.env.BABEL_ENV}
-------------------------------------
`)*/
//https://github.com/Francois-Esquire/dock/blob/1cfe9fbe5badd43706483e6fc5ee7ee69543efdd/postcss.config.js
//https://github.com/GoogleChromeLabs/ProjectVisBug/tree/667971b4370acf125ba982c9ac6e5e63155e5a85
//https://github.com/rollup/rollup-plugin-typescript/issues/45
///https://github.com/zooplus/zoo-web-components/blob/b00c5286829d324eee2f99f855964e4cdac783d4/rollup.config.js
//https://stackoverflow.com/questions/58337333/how-to-pass-env-variable-to-rollup-config-js-via-npm-cli
//https://www.freecodecamp.org/news/how-to-use-sass-with-css/
//https://github.com/sin-group/base-ui/blob/6ee55b10309c4eb653454eefcd91315302f0fcc9/rollup.config.js
//https://www.learnwithjason.dev/blog/learn-rollup-js/
//npm i -S myslot3@file:../../nodeJSDev/mySlot3
/*
//const { createFilter } = require('rollup-pluginutils');
//import postcssScss from 'postcss-scss'
//import base64 from 'postcss-base64'
import simplevars from 'postcss-simple-vars'
import buble from 'rollup-plugin-buble';
import replace from 'rollup-plugin-re';
import css from 'postcss-import';
import resolve from 'rollup-plugin-node-resolve';
//import postCSS from 'rollup-plugin-postcss';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cleanup from 'rollup-plugin-cleanup';
import pkg from './package.json';
import cssnano from 'cssnano';
//import sass from "sass";
//import postcssImport from "postcss-import";
//import scss from 'rollup-plugin-scss';
//import css from 'postcss-import';
//import commonjs from 'rollup-plugin-commonjs';
//import nodeResolve from 'rollup-plugin-node-resolve'
//import { defineConfig } from 'rollup';
//import postcssUrl from 'postcss-url';
const extensions = ['.js', '.jsx', '.css', '.scss'];
//import presetEnv from "postcss-preset-env";
//import postcssModules from 'postcss-modules'
//import peerDepsExternal from 'rollup-plugin-peer-deps-external'
//const sass = require('sass');
//import { writeFile } from 'fs/promises'
//import { fileURLToPath } from 'url'
//import terser from 'rollup-plugin-terser';
*/

