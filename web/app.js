import * as monaco from 'monaco-editor'
import '../src/monaco.contribution'
import './style.css'

self.MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
        if (label === 'govaluate') {
            return './govaluate.worker.bundle.js'
        }
		return './editor.worker.bundle.js';
	}
}

monaco.editor.create(document.getElementById('container'), {
	value: '(mem_used / total_mem) * 100',
	language: 'govaluate',
    wordWrap: 'off',
    lineNumbers: 'off',
    lineNumbersMinChars: 0,
    overviewRulerLanes: 0,
    overviewRulerBorder: false,
    lineDecorationsWidth: 0,
    hideCursorInOverviewRuler: true,
    glyphMargin: false,
    folding: false,
    scrollBeyondLastColumn: 0,
    scrollbar: {horizontal: 'hidden', vertical: 'hidden'},
    find: {addExtraSpaceOnTop: false, autoFindInSelection: 'never', seedSearchStringFromSelection: false},
    minimap: {enabled: false},
})
