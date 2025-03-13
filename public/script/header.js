console.log("Header")

let menuH = false;

document.querySelector("#hambHeader").addEventListener("click", () => {
    if(menuH){
        document.querySelector("header").style.maxHeight = "134px";
    } else {
        document.querySelector("header").style.maxHeight = "1000px";
    }
    menuH = !menuH;
});

