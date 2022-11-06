import { editor, IDisposable, Uri } from 'monaco-editor'
import { LanguageServiceDefaults } from './monaco.contribution'
import { GovaluateWorker } from './govaluateWorker'

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000 // 2min

export class WorkerManager {
    private _defaults: LanguageServiceDefaults
	private _idleCheckInterval: number
	private _lastUsedTime: number
	private _configChangeListener: IDisposable

	private _worker: editor.MonacoWebWorker<GovaluateWorker> | null
	private _client: Promise<GovaluateWorker> | null | undefined

	constructor(defaults: LanguageServiceDefaults) {
        this._defaults = defaults
		this._worker = null
		this._idleCheckInterval = window.setInterval(() => this._checkIfIdle(), 30 * 1000)
		this._lastUsedTime = 0
		this._configChangeListener = this._defaults.onDidChange(() => this._stopWorker())
	}

	private _stopWorker(): void {
		if (this._worker) {
			this._worker.dispose()
			this._worker = null
		}
		this._client = null
	}

	dispose(): void {
		clearInterval(this._idleCheckInterval)
		this._configChangeListener.dispose()
		this._stopWorker()
	}

	private _checkIfIdle(): void {
		if (!this._worker) {
			return
		}
		let timePassedSinceLastUsed = Date.now() - this._lastUsedTime
		if (timePassedSinceLastUsed > STOP_WHEN_IDLE_FOR) {
			this._stopWorker()
		}
	}

	private _getClient(): Promise<GovaluateWorker> {
		this._lastUsedTime = Date.now()

		if (!this._client) {
			this._worker = editor.createWebWorker<GovaluateWorker>({
				// module that exports the create() method and returns a `CSSWorker` instance
				moduleId: this._defaults.languageId,
				label: this._defaults.languageId,

				// passed in to the create() method
				createData: {
					languageId: this._defaults.languageId
				}
			})

			this._client = <Promise<GovaluateWorker>>(<any>this._worker.getProxy())
		}

		return this._client
	}

	getLanguageServiceWorker(...resources: Uri[]): Promise<GovaluateWorker> {
		let _client: GovaluateWorker
		return this._getClient()
			.then((client) => {
				_client = client
			})
			.then((_) => {
				return this._worker?.withSyncedResources(resources)
			})
			.then((_) => _client)
	}
}
