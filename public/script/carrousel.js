console.log("Carrousel")
let carrousel = document.querySelector(".carrouselImg");
let botonesCarrousel = document.querySelectorAll(".carrouselBtn > span");
let ubicacion = 0;

const iniciarCarrousel = setInterval(moverCarrousel, 4000);

function moverCarrousel(){
    ubicacion += 33.333;
    if(ubicacion > 67){ubicacion = 0};
    carrousel.style.transform = `translate(-${ubicacion}%,0)`;
    botonesCarrousel.forEach((btn) => {btn.style.backgroundColor = "rgba(255, 255, 255, 0.5)"});
    let btnActivo = Math.round(ubicacion /33.333);
    botonesCarrousel[btnActivo].style.backgroundColor = "white";
}

botonesCarrousel.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        clearInterval(iniciarCarrousel)
        moverCarrouselManual(e.target.dataset.id)
    })
})

function moverCarrouselManual(posicion){
    ubicacion = posicion * 33.333;
    carrousel.style.transform = `translate(-${ubicacion}%,0)`;
    botonesCarrousel.forEach((btn) => {btn.style.backgroundColor = "rgba(255, 255, 255, 0.5)"});
    botonesCarrousel[posicion].style.backgroundColor = "white";
}