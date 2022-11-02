import type { languages } from 'monaco-editor';

export const conf: languages.LanguageConfiguration = {
	brackets: [
		['(', ')']
	],
	autoClosingPairs: [
		{ open: '(', close: ')' }
	],
	surroundingPairs: [
		{ open: '(', close: ')' }
	]
};

export const language = <languages.IMonarchLanguage>{
    operators: [
        // Modifiers
        '+',
        '-',
        '*',
        '/',
        '**',
        '%',
        '>>',
        '<<',
        '|',
        '&',
        '^',
        '!',
        '~',

        // Logical Operators
        '&&',
        '||',
        '?',
        ':',
        '??',

        // Comparators
        '>',
        '<',
        '>=',
        '<=',
        '=~',
        '!~',

        // Arrays
        ',',
        'IN'
    ],
    tokenizer: {
        root: [[/[{}]/, 'delimiter.bracket'], { include: 'common' }],
        common: [
            [
				/@symbols/,
				{
					cases: {
						'@operators': 'delimiter',
						'@default': ''
					}
				}
			],
        ]
    }
}
