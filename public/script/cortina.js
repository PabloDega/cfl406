// cortina
export function mostrarCortinaConMsg(txt, btncancelar){
    let cortina = document.querySelector(".cortina");
    cortina.style.display = "flex";

    if(btncancelar){
        document.querySelector("#btnPopUpCancelar").style.display = "block";
    }

    document.querySelector(".cortina #txt").innerHTML = txt;
    
   //detectar si el elemento .btn ya tiene un evento click
    if(document.querySelector(".cortina .btn")){
        document.querySelector(".cortina .btn").removeEventListener("click", () => {});
    }   

    // agregar evento a los botones de la cortina

    document.querySelectorAll(".cortina .btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            return e.target.dataset.resp;
        })
    })

    document.querySelector(".cortina .btn").addEventListener("click", (e) => {
        cortina.style.display = "none";
        document.querySelector(".cortina #txt").innerHTML = "";
        document.querySelector("#btnPopUpCancelar").style.display = "none";
    });

    document.querySelector(".popup").addEventListener("click", (e) => {
        if(e.target.classList.contains("popup")){
            cortina.style.display = "none";
            document.querySelector(".cortina #txt").innerHTML = "";
            document.querySelector("#btnPopUpCancelar").style.display = "none";
        }
    });
}