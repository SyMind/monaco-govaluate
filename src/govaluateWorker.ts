import { worker } from 'monaco-editor'
import { getLanguageService, Diagnostic, LanguageService, TextDocument } from './govaluateLanguageService'

export interface ICreateData {
	languageId: string
}

export class GovaluateWorker {
    private _ctx: worker.IWorkerContext
    private _languageId: string
    private _languageService: LanguageService

    constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
        this._ctx = ctx
        this._languageId = createData.languageId
        this._languageService = getLanguageService()
    }

    async doValidation(uri: string): Promise<Diagnostic[]> {
		const document = this._getTextDocument(uri)
		if (document) {
			const govaluate = this._languageService.parseGovaluateDocument(document)
			const diagnostics = this._languageService.doValidation(document, govaluate)
			return Promise.resolve(diagnostics)
		}
		return Promise.resolve([])
	}

    private _getTextDocument(uri: string): TextDocument | null {
        const models = this._ctx.getMirrorModels();
		for (const model of models) {
			if (model.uri.toString() === uri) {
				return TextDocument.create(
					uri,
					this._languageId,
					model.version,
					model.getValue()
				)
			}
		}
        return null
    }
}
