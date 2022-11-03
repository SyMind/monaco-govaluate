import { worker } from 'monaco-editor'
import { Diagnostic, LanguageService, TextDocument } from './govaluateLanguageService'

export interface ICreateData {
	languageId: string
}

export class GovaluateWorker {
    private _languageService: LanguageService

    constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
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
        return null
    }
}
