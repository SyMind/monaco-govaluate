import * as monaco from 'monaco-editor'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'
import './style.css'

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		// if (label === 'json') {
		// 	return './json.worker.bundle.js';
		// }
		// if (label === 'css' || label === 'scss' || label === 'less') {
		// 	return './css.worker.bundle.js';
		// }
		// if (label === 'html' || label === 'handlebars' || label === 'razor') {
		// 	return './html.worker.bundle.js';
		// }
		// if (label === 'typescript' || label === 'javascript') {
		// 	return './ts.worker.bundle.js';
		// }
		return './editor.worker.bundle.js';
	}
}

monaco.editor.create(document.getElementById('container'), {
	value: 'console.log("Hello, world")',
	language: 'javascript'
})
