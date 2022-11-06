import { languages, Emitter, IEvent } from 'monaco-editor'
import { registerLanguage } from 'monaco-editor/esm/vs/basic-languages/_.contribution'

const languageId = 'govaluate'

interface Options { }

export interface LanguageServiceDefaults {
    readonly languageId: string;
    readonly onDidChange: IEvent<LanguageServiceDefaults>;

    readonly options: Options;
    setOptions: (options: Options) => void;
}

class LanguageServiceDefaultsImpl implements LanguageServiceDefaults {
	private _onDidChange = new Emitter<LanguageServiceDefaults>();
	private _options!: Options;
	private _languageId: string;

	constructor(languageId: string, options: Options) {
		this._languageId = languageId;
		this.setOptions(options);
	}

	get onDidChange(): IEvent<LanguageServiceDefaults> {
		return this._onDidChange.event;
	}

	get languageId(): string {
		return this._languageId;
	}

	get options(): Options {
		return this._options;
	}

	setOptions(options: Options): void {
		this._options = options || Object.create(null);
		this._onDidChange.fire(this);
	}
}

const optionsDefault: Options = { }

const govaluateDefaults = new LanguageServiceDefaultsImpl(
    languageId,
    optionsDefault
)

registerLanguage({
    id: languageId,
    loader: () => {
		return import('./govaluate')
	}
})

languages.onLanguage(languageId, () => {
	import('./govaluateMode').then((mode) => mode.setupMode(govaluateDefaults))
})
