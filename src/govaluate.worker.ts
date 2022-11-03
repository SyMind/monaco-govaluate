import * as worker from 'monaco-editor/esm/vs/editor/editor.worker'
import { GovaluateWorker } from './govaluateWorker'

self.onmessage = () => {
	worker.initialize((ctx, createData) => {
		return new GovaluateWorker(ctx, createData)
	})
}
