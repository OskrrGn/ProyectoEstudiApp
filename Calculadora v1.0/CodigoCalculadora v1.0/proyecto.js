const pantallaTexto = document.querySelector("#pantalla-texto");
const botones = document.querySelectorAll(".btn");
const historialBtn = document.querySelector("#historial-btn");
const cerrarHistorial = document.querySelector("#cerrar-historial");
const historialDiv = document.querySelector(".historial");
const tecladoDiv = document.querySelector(".teclado");
const historialLista = document.querySelector("#historial-lista");

let resultadoMostrado = false;
let historial = [];

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        const botonApretado = boton.textContent;

        if (boton.id === "c") {
            pantallaTexto.textContent = "0";
            resultadoMostrado = false;
            return;
        }

        if (boton.id === "borrar") {
            if (resultadoMostrado) {
                pantallaTexto.textContent = "0";
                resultadoMostrado = false;
            } else if (pantallaTexto.textContent.length === 1 || pantallaTexto.textContent === "Syntax Error" || pantallaTexto.textContent === "Math Error") {
                pantallaTexto.textContent = "0";
            } else {
                pantallaTexto.textContent = pantallaTexto.textContent.slice(0, -1);
            }
            return;
        }

        if (boton.id === "ce") {
            let expresion = pantallaTexto.textContent.trim();
            if (expresion === "" || expresion === "Syntax Error" || expresion === "Math Error") {
                pantallaTexto.textContent = "0";
                return;
            }
            let partes = expresion.match(/(\d+(\.\d+)?|\D)/g);
            if (partes && partes.length > 1) {
                partes.pop();
                pantallaTexto.textContent = partes.join("");
            } else {
                pantallaTexto.textContent = "0";
            }
            return;
        }

        if (boton.id === "igual") {
            try {
                let resultado = eval(pantallaTexto.textContent);
                if (resultado === Infinity || resultado === -Infinity) {
                    pantallaTexto.textContent = "Math Error";
                } else {
                    let resultadoFinal = Number.isInteger(resultado) ? resultado : resultado.toFixed(2);
                    historial.push(${pantallaTexto.textContent} = ${resultadoFinal});
                    actualizarHistorial();
                    pantallaTexto.textContent = resultadoFinal;
                    resultadoMostrado = true;
                }
            } catch {
                pantallaTexto.textContent = "Syntax Error";
                resultadoMostrado = true;
            }
            return;
        }

        if (resultadoMostrado) {
            if (!isNaN(botonApretado) || botonApretado === ".") {
                pantallaTexto.textContent = botonApretado; // Reiniciar con número
            } else {
                pantallaTexto.textContent += botonApretado; // Continuar operación
            }
            resultadoMostrado = false;
            return;
        }

        if (pantallaTexto.textContent === "0" || pantallaTexto.textContent === "Syntax Error" || pantallaTexto.textContent === "Math Error") {
            pantallaTexto.textContent = botonApretado;
        } else {
            pantallaTexto.textContent += botonApretado;
        }
    });
});

historialBtn.addEventListener("click", () => {
    historialDiv.classList.remove("oculto");
    tecladoDiv.classList.add("oculto");
    historialBtn.classList.add("oculto");
});

cerrarHistorial.addEventListener("click", () => {
    historialDiv.classList.add("oculto");
    tecladoDiv.classList.remove("oculto");
    historialBtn.classList.remove("oculto");
});

function actualizarHistorial() {
    historialLista.innerHTML = "";
    historial.slice().reverse().forEach(op => {
        let item = document.createElement("li");
        item.textContent = op;
        historialLista.appendChild(item);
    });
}