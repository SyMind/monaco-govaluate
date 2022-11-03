import { TextDocument } from 'vscode-languageserver-textdocument'
import { Diagnostic } from 'vscode-languageserver-types';
import { LanguageSettings } from './govaluateLanguageTypes';

export {
    TextDocument,
    Diagnostic
}

export type Govaluate = {};

export interface LanguageService {
	configure(settings: LanguageSettings): void
	doValidation(document: TextDocument, govaluate: Govaluate): Diagnostic[]
	parseGovaluateDocument(document: TextDocument): Govaluate
}

export function getLanguageService(): LanguageService {
	return {
        configure(settings) {
        },
        doValidation() {
            return []
        },
        parseGovaluateDocument() {
            return {}
        }
	}
}
