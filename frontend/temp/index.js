let content = document.getElementById("root")
let counter = 0
content.innerHTML=counter
const increase = () => {
    counter++;
    console.log(counter);
    document.getElementById("root").innerHTML = counter;
}
const increaseasync = () => {
    setTimeout(() => {
        counter++;
        content.innerHTML=counter
    },2000)
}