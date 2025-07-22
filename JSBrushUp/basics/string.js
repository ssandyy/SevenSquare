const myName = "Sandeep Kumar Yadav Z";

console.log(myName); //Sandeep Kumar Yadav Z
console.log(typeof myName); //string
console.log(myName.length); //21
console.log(myName.lastIndexOf("a"));  //17
console.log(myName.charAt(17));  //a
console.log(myName.charCodeAt(1));  //a->97    {ASCII of 'a' --> 97 and 'z' -->122}
console.log(myName.charCodeAt(20)); //Z->90    {ASCII of A --> 65 and Z -->90}
console.log(myName.toUpperCase());  //SANDEEP KUMAR YADAV Z
console.log(myName.toLowerCase());  // sandeep kumar yadav z

// at()
console.log(myName.at(-3));  // v    {at() is use to take -ve value used from last element}


// slice(start, end)
// substring(start, end)
// substr(start, length)
console.log(myName.slice(2, 12)); //ndeep Kuma
console.log(myName.substring(2, 12)); //ndeep Kuma
console.log(myName.substr(2, 17)); //ndeep Kumar Yadav
console.log(myName.__proto__); // {} can be seen in console of browser
console.log(myName.trim());
