let x = 2;
const y = 6;
var z = 5;

if(true){
    let x1 = 22;
    const y1 = 66;
    var z1 = 55;
}

function XYZ() {
    console.log("let decleration call: ", x); //let decleration call:  2
    console.log("const decleration call: ", y); //const decleration call:  6
    console.log("var decleartion call: ", z); // var decleartion call:  5 

    //BUT 
    //console.log("let decleration call: ", x1); //x1 is not defined
    //console.log("const decleration call: ", y1); //y1 is not defined
    console.log("var decleartion call: ", z1); // var decleartion call:  55
}
XYZ()


if(true) {
    const username= "sandeep"
    if(username === "sandeep"){
        let age=28
        const website = "sevensquare"
        console.log(`My name is ${username}, age is ${age} and website is ${website}`);
        //My name is sandeep, age is 28 and website is sevensquare
    }
    //console.log(`trying to access 'const' outside its scope value of website: ${website}`);  //website is not defined
}



// ========================:    This keywords     :==========================

const user = {
    username: "sandeep",
    age: 28,
    linkedIn: "https:ssandyy",
    WelcomeMsg: function() {
        //console.log(`Good morning ${username}, age is ${age} and linkedin profile is ${this.linkedIn}`); //username is not defined
        
        console.log(`Good morning ${this.username}, age is ${this.age} and linkedin profile is ${this.linkedIn}`);
        //Good morning sandeep, age is 28 and linkedin profile is https:ssandyy
    }
}
user.WelcomeMsg();
// Good morning sandeep, age is 28 and linkedin profile is https:ssandyy

user.username = "Dilip"
user.age = 27
user.WelcomeMsg();
// Good morning dilip, age is 27 and linkedin profile is https:ssandyy


function Abc() {
    let name = "Tom"
    console.log(this.name);
}
Abc(); //undefined

const Abcd = function() {
    let name = "Tom"
    console.log(this.name);
}
Abc();

const Abcde = () => {
    let name = "Tom"
    console.log(this.name);
}
Abcde();//undefined

