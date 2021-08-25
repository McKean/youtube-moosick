import glob from 'glob';
import * as pathTool from 'path';
import { fileURLToPath } from 'url';

process.chdir(pathTool.dirname(fileURLToPath(import.meta.url)));

const tests = await new Promise<string[]>((resolve) => {
	glob('./tests/**/*.js', (_, matches) => {
		resolve(matches);
	});
});

tests.forEach((test) => {
	console.log(test);
	import(test);
});
