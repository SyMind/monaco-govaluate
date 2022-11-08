# Monaco Govaluate

[Govaluate](https://github.com/Knetic/govaluate) expressions plugin for the Monaco Editor.

# BNF

```
separator_expression :
    ternary_expression
    separator_expression COMMA ternary_expression

ternary_expression :
	logical_or_expression
	ternary_expression TERNARY logical_or_expression

logical_or_expression :
	logical_and_expression
	logical_or_expression || logical_and_expression

logical_and_expression :
	comparator_expression
	logical_and_expression && comparator_expression

comparator_expression :
	bitwise_expression
	comparator_expression COMPARATOR bitwise_expression

bitwise_expression :
	shift_expression
	bitwise_expression BITWISE shift_expression

shift_expression :
	additive_expression
	shift_expression SHIFT additive_expression

additive_expression :
	multiplicative_expression
	additive_expression ADDITIVE multiplicative_expression

multiplicative_expression :
	exponential_expression
	multiplicative_expression MULTIPLICATIVE exponential_expression

exponential_expression :
	prefix_expression
	exponential_expression EXPONENTIAL prefix_expression

prefix_expression :
	function_expression
    PREFIX function_expression

function_expression :
    ACCESSOR
    ACCESSOR RIGHT_PAREN separator_expression LEFT_PAREN
```
