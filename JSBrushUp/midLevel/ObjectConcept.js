const user = new Object();
// OR 
const user2 = {}


const obj = {
    myName : "Sandeep",
    age: 30
}

const obj1 = {1:'a', 2:'b', 3:'c'}
const obj2 = {11:'a1', 21:'b1', 31:'c1'}

const obj3 = {obj1, obj2}

console.log(obj3);
// {
//   obj1: { '1': 'a', '2': 'b', '3': 'c' },     
//   obj2: { '11': 'a1', '21': 'b1', '31': 'c1' }
// }

const obj4 = Object.assign(obj1, obj2)
console.log(obj4);
// { '1': 'a', '2': 'b', '3': 'c', '11': 'a1', '21': 'b1', '31': 'c1' }

// OR

//Using spread operator "..." 
const Obj5 = {...obj1, ...obj2};
console.log(Obj5); // { '1': 'a', '2': 'b', '3': 'c', '11': 'a1', '21': 'b1', '31': 'c1' }

