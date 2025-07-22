const map1 = [1,2,3,4,5,6]

const resultMap1 = map1.map((element) => element+2) //[ 3, 4, 5, 6, 7, 8 ]
                        .map((num) => num*2) //[ 6, 8, 10, 12, 14, 16 ]
                        .filter((e) => e > 10) 

console.log(resultMap1); //[ 12, 14, 16 ]


const shoppingSite = [
    {
        id: 1,
        name: "Shirt",
        price: 500,
        category: "Clothing"
    },
    {        
        id: 2,
        name: "Pants",
        price: 700,
        category: "Clothing"
    },
    {
        id: 3,
        name: "Shoes",
        price: 1500,
        category: "Footwear"
    },
    {
        id: 4,
        name: "Watch",
        price: 2000,
        category: "Accessories"
    }
]

// reduce and accomulator example
const shoppingCart = shoppingSite.filter((item) => item.price > 700)
    .reduce((accu, items) => {
    console.log(`Item: ${items.name}, Price: ${items.price}`);
    return accu+(items.price);
}, 0)
console.log(`Total Price: ${shoppingCart}`); // Total Price: 4700
