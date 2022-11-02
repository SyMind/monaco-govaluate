import { registerLanguage } from 'monaco-editor/esm/vs/basic-languages/_.contribution';

registerLanguage({
    id: 'govaluate',
    loader: () => {
		return import('./govaluate')
	}
})

