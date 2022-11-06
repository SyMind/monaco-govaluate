import { Uri, IDisposable } from 'monaco-editor'
import { WorkerManager } from './workerManager'
import * as languageFeatures from './lspLanguageFeatures'
import { LanguageServiceDefaults } from './monaco.contribution'
import { GovaluateWorker } from './govaluateWorker'

export function setupMode(defaults: LanguageServiceDefaults): IDisposable {
	const disposables: IDisposable[] = []
	const providers: IDisposable[] = []

	const client = new WorkerManager(defaults)
	disposables.push(client)

	const worker: languageFeatures.WorkerAccessor<GovaluateWorker> = (...uris: Uri[]): Promise<any> => {
		return client.getLanguageServiceWorker(...uris)
	}

	function registerProviders(): void {
        const { languageId } = defaults
    
		disposeAll(providers)

		providers.push(new languageFeatures.DiagnosticsAdapter(languageId, worker))
	}

	registerProviders()

	disposables.push(asDisposable(providers))

	return asDisposable(disposables)
}

function asDisposable(disposables: IDisposable[]): IDisposable {
	return { dispose: () => disposeAll(disposables) }
}

function disposeAll(disposables: IDisposable[]) {
	while (disposables.length) {
		disposables.pop()?.dispose()
	}
}
