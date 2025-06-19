const score = 400;
console.log(score); //400
console.log(typeof score);// number



//explicit variable defining with datatype
const score2 = new Number(600); // 100% gurrante score2 is number type
console.log(score2); // [Number: 600]
console.log(typeof score2); //object

const score3 = score2.toString();
console.log(score3); //600
console.log(typeof score3); //string

//now score3 is string then we can use multiple prototype like  length, toLowerCase...
console.log(score3.length); // 3  --->  (6, 0, 0)



// toFixed  --> very use to maintain precision value (value after decimal)
const balance = 12345.32345
console.log(balance); //12345.32345

console.log(balance.toFixed(2)); // 12345.32
console.log(balance.toFixed(3)); // 12345.323


//toPrecision --> very use to maintain precision value (value before decimal) 
console.log(balance); //12345.32345
console.log(balance.toPrecision(2)); //1.2e+4
console.log(balance.toPrecision(4)); //1.235e+4
console.log(balance.toPrecision(5)); //12345
console.log(balance.toPrecision(6)); //12345.3

const balance2 = 123.789
//note : if the decimal value if greater then 5 then it will increse the actual value by one if its at least position
console.log(balance2);//123.789
console.log(balance2.toPrecision(2)); //1.2e+2
console.log(balance2.toPrecision(3)); //124
console.log(balance2.toPrecision(4)); //123.8
console.log(balance2.toPrecision(5)); //123.79
