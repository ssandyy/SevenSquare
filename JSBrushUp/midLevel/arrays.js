// In JS Array is resizable and Hetrogenious
// always perform shallow copy


const arr = [1,2,3,4,5,"a", "b", "c"] // 
console.log(arr); // [ 1, 2,   3,   4, 5, 'a', 'b', 'c']
console.log(arr[2]); //3

const arr2 = new Array(11, 22, 33, 44, 55,"A", "B", "C")
console.log(arr2[2]); //33


//-----------    Array methods    ----------------

//push() --> add element at last position
arr.push(6); 
console.log(arr); // [ 1, 2,   3,  4, 5, 'a', 'b', 'c', 6]

// or 
arr.push(7, 8, 9);
console.log(arr);  // [ 1, 2,   3,  4, 5, 'a', 'b', 'c', 6, 7, 8, 9]


// pop() --> remove last element
arr.pop();
console.log(arr); // [ 1, 2,   3,  4, 5, 'a', 'b', 'c', 6, 7, 8]


// unshift(value) -> add value at first index
arr.unshift(111);
console.log(arr);// [ 111, 1, 2,   3,  4, 5, 'a', 'b', 'c', 6, 7, 8]

//shift()  --> remove index[0] value
arr.shift();
console.log(arr); // [ 1, 2, 3,  4, 5, 'a', 'b', 'c', 6, 7, 8]

//includes(value) -> use to check available value in array or not 
console.log( arr.includes(2)); //true
console.log( arr.includes(99)); //false



//  ============= Slice and Splice
console.log("============= Slice and Splice ==============");


// slice
const arry = [1,2,3,4,5,6,7]
const arraySlice = arry.slice(1,3);
console.log(arraySlice);
console.log(arry);

//splice
const arry2 = [1,2,3,4,5,6,7]
const arry2Splice = arry2.splice(1,3);
console.log(arry2Splice);
console.log(arry2);

// ---------------------------------------------
console.log("================reverse()===============");

// reverse()
console.log(arr.reverse());

// -----------------------------------------------
// '...' spread operator

// with the use of spread operator we can add multiple array at one 
const allInOnearr = [...arr, ...arr2, ...arry, ...arraySlice]
console.log(allInOnearr); // [8,7,6,'c','b','a',5,4,3,2,1,11,22,33,44,55,'A','B','C',1,2,3,4,5,6,7,2,3]

// ----------------------------------------------------------
console.log("===============Multi-layer array================");

// Multi-layer array
const multiArray = [1,2,3,['a', 'b', 'c','d', [1.1, 2.2, 3.3, 4.4], 'e'], 4, 5, 6]
console.log(multiArray[3][4][2]);  //3.3


console.log("=========== Flat()====================");
//flat --> break the brackets as per given depth else use infinity 
const flatArr = multiArray
console.log(flatArr); // [1,2,3,['a', 'b', 'c','d', [1.1, 2.2, 3.3, 4.4], 'e'], 4, 5, 6]

flatArr[3][2]='x';
console.log(flatArr); // [1,2,3,['a', 'b', 'x','d', [1.1, 2.2, 3.3, 4.4], 'e'], 4, 5, 6]

const flatedArray1depth = flatArr.flat(1);// [ 1, 2, 3, 'a', 'b', 'x', 'd', [ 1.1, 2.2, 3.3, 4.4 ], 'e', 4, 5, 6 ] 
console.log(flatedArray1depth);

const flatedArray2depth = flatArr.flat(2);// [ 1, 2, 3, 'a', 'b', 'x', 'd', 1.1, 2.2, 3.3, 4.4, 'e', 4, 5, 6 ] 
console.log(flatedArray2depth);

const flatedArrayInfinitedepth = flatArr.flat(Infinity);//   [ 1, 2, 3, 'a', 'b', 'x', 'd', 1.1, 2.2, 3.3, 4.4, 'e', 4, 5, 6 ]
console.log(flatedArrayInfinitedepth);



console.log("============== Array.isArray(), Array.from(), Array.of() =================");

//isArray
console.log(Array.isArray("Sandeep")); //false

//from
console.log(Array.from("Sandeep")); // ['S', 'a', 'n','d', 'e', 'e','p']
console.log(Array.from({myName:"Sandeep"})); //[]
console.log(Array.from({myName:"Sandeep"})); //[] have to define by keys and values to make array

//of
let score = 100;
let score2 = 200;
let score3 = 300;
let score4 = 400;

console.log(Array.of(score, score2, score3, score4)); //[ 100, 200, 300, 400 ]

//==============    By Using Object with -->  Key and Value  =====================
console.log("-------   By Using Object with -->  Key and Value   ------");

const obj1 = {myName:"Sandeep"};
console.log(Object.values(obj1)); //[ 'Sandeep' ]
console.log(Object.keys(obj1)); //[ 'myName' ]

const obj2 = {myName:"Sandeep",myName2:"Sandeep2",myName3:"Sandeep3" };
const allObjectValues = Object.values(obj2);
const allObjectKeys = Object.keys(obj2);
console.log(allObjectKeys); //[ 'myName', 'myName2', 'myName3' ]
console.log(allObjectValues); //[ 'Sandeep', 'Sandeep2', 'Sandeep3' ]

console.log(allObjectValues[1]); //Sandeep2
console.log(allObjectKeys[0]); // myName
 




