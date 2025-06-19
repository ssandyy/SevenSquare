let score = 55;
let alphaNum = "sandy44"; 

console.log(score); //55
console.log(typeof(score)); //number
console.log(typeof(String(score))); //string
console.log(typeof String(score)); //string

console.log("==================================");

console.log(alphaNum);
console.log(typeof alphaNum);
console.log(typeof Number(alphaNum)); // number
console.log(Number(alphaNum));NAN

let numAlpha = "4Sand"
console.log(typeof numAlpha);
console.log(typeof Number(numAlpha)); // number
// But value will not be coverted
console.log(Number(numAlpha)); //NAN

// But
let name = "Sandy"
let NameInNumber = Number(name);
console.log(typeof name); //string
console.log(typeof NameInNumber); // number
console.log(NameInNumber);  //NAN

console.log("==================================");

// using 'toString()'
