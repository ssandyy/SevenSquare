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
console.log(arr); // [ 1, 2,   3,  4, 5, 'a', 'b', 'c', 6, 7, 8]

//includes(value) -> use to check available value in array or not 
console.log( arr.includes(2)); //true
console.log( arr.includes(99)); //false



//  ============= Slice and Splice

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



