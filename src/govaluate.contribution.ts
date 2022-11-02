import { languages } from 'monaco-editor';

languages.register({
	id: 'govaluate'
})

languages.onLanguage('govaluate', () => {
	return import('./govaluate');
})
