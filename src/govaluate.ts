import type { languages } from 'monaco-editor';

export const conf: languages.LanguageConfiguration = {
	brackets: [
		['(', ')'],
        ['[', ']']
	],
	autoClosingPairs: [
		{ open: '(', close: ')' },
        { open: '[', close: ']' }
	],
	surroundingPairs: [
		{ open: '(', close: ')' },
        { open: '[', close: ']' }
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
    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
    digits: /\d+(_+\d+)*/,

    tokenizer: {
        root: [
            // whitespace
            [/\s+/, 'white'],

            // numbers
            [/0[x](@hexdigits)/, 'number.hex'],
            [/(@digits)/, 'number'],

            [/[()\[\]]/, '@brackets'],
            [
				/@symbols/,
				{
					cases: {
						'@operators': 'delimiter',
						'@default': ''
					}
				}
			],

            // identifiers
			[/[a-zA-Z_$][\w$]*/, 'type.identifier']
        ]
    }
}
