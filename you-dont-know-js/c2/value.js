// Var stores a value in memory

// use var to declare a variable available outside the block scope
var adult = true;

if (adult) {
  var myName = "Kyle";
  // use let to declare a block-scoped variable
  let age = 27;
  console.log("Shhhm thi is a secret!"); // Kyle
}

console.log(myName); // Kyle

console.log(age); // ReferenceError: age is not defined

// Const stores a constant value in memory

const myBirthday = true;
let age = 27;

if (myBirthday) {
  age = age + 1;
  myBirthday = false; // TypeError: Assignment to constant variable.
}
