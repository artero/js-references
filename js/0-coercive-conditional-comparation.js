// Cohercive Conditional Comparation 
// use var to declare a variable available outside the block scope

// In JS  == and === are both strict equality operators but
// == performs type coercion before comparison while === does not.

var a = 5;          // number
var b = '5';       // string

// Using == (loose equality)
console.log(`Using == : a and b are equal: ${a == b}`);
console.log(`Using === : a and b are not equal: ${a != b}`);

// Comon examples of coercive conditional comparation

console.log(`5 == '5': ${5 == '5'}`);          // true
console.log(`5 === '5': ${5 === '5'}`);        // false

console.log(`0 == false: ${0 == false}`);      // true
console.log(`0 === false: ${0 === false}`);    // false

console.log(`null == undefined: ${null == undefined}`); // true
console.log(`null === undefined: ${null === undefined}`); // false

console.log(`' ' == 0: ${' ' == 0}`);          // true
console.log(`' ' === 0: ${' ' === 0}`);        // false

// Summary: Use === to avoid unexpected results due to type coercion.

// We shuld be careful wiht this because another comparation operators wors in a similar way
// like != and !== while others like <, >, <=, >= also perform type coercion in certain cases.
//
// For example:
console.log(`'5' < 10: ${'5' < 10}`);
console.log(`'5' > 10: ${'5' > 10}`);
console.log(`'5' <= 5: ${'5' <= 5}`);
console.log(`'5' >= 5: ${'5' >= 5}`);

// In these cases, JS coerces the string '5' to the number 5 before performing the comparison.

// The coarcive behavior of JS also aplies to another operators like +, -, *, /
// where type coercion can lead to unexpected results if not properly understood.

console.log(`'5' + 10: ${'5' + 10}`);         // '510' (string concatenation)
console.log(`'5' + '10': ${'5' + '10'}`);     // '510' (string concatenation)
console.log(`'5' - 2: ${'5' - 2}`);           // 3 (numeric subtraction)
console.log(`'5' * 2: ${'5' * 2}`);           // 10 (numeric multiplication)
console.log(`'10' / 2: ${'10' / 2}`);         // 5 (numeric division)

