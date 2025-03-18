document.addEventListener('DOMContentLoaded', () => {
    const pantallaTexto = document.getElementById('pantalla-texto');
    const operacionTexto = document.getElementById('operacion-texto');
    const historialLista = document.getElementById('historial-lista');
    const historialBtn = document.getElementById('historial-btn');
    const cerrarHistorial = document.getElementById('cerrar-historial');
    const limpiarHistorial = document.getElementById('limpiar-historial');
    const historialDiv = document.querySelector('.historial');

    let operacionActual = '0';
    let operacionAnterior = '';
    let operador = null;
    let resultadoMostrado = false;
    let porcentajeUsado = false;

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const valor = btn.textContent;

            if (valor >= '0' && valor <= '9') {
                if (resultadoMostrado || porcentajeUsado) {
                    operacionActual = valor; // Permitir ingreso después de CE o %
                    resultadoMostrado = false;
                    porcentajeUsado = false;
                } else {
                    if (operacionActual.includes('e')) return;
                    operacionActual = operacionActual === '0' ? valor : operacionActual + valor;
                }
                actualizarPantalla();
            } else if (valor === '.') {
                if (!operacionActual.includes('.') && !porcentajeUsado) {
                    operacionActual += valor;
                    actualizarPantalla();
                }
            } else if (valor === 'C') {
                resetearCalculadora();
            } else if (valor === 'CE') {
                operacionActual = '0';
                resultadoMostrado = false; // Permitir nueva entrada después de CE
                porcentajeUsado = false;
                actualizarPantalla();
            } else if (valor === '←') {
                if (!porcentajeUsado) {
                    operacionActual = operacionActual.slice(0, -1) || '0';
                    actualizarPantalla();
                }
            } else if (valor === '%') {
                operacionActual = (parseFloat(operacionActual) / 100).toString();
                porcentajeUsado = true;
                actualizarPantalla();
            } else if (['+', '-', '*', '/'].includes(valor)) {
                if (operador !== null) calcular();
                operador = valor;
                operacionAnterior = operacionActual;
                operacionActual = '0';
                porcentajeUsado = false;
                resultadoMostrado = false;
                actualizarOperacion();
            } else if (valor === '=') {
                if (operador !== null) {
                    calcular();
                    operador = null;
                }
            }
        });
    });

    function actualizarPantalla() {
        pantallaTexto.textContent = operacionActual;
    }

    function actualizarOperacion() {
        operacionTexto.textContent = `${operacionAnterior} ${operador || ''}`;
    }

    function calcular() {
        let resultado;
        const anterior = parseFloat(operacionAnterior);
        const actual = parseFloat(operacionActual);

        if (isNaN(anterior) || isNaN(actual)) {
            operacionActual = 'Math Error';
            actualizarPantalla();
            return;
        }

        switch (operador) {
            case '+': resultado = anterior + actual; break;
            case '-': resultado = anterior - actual; break;
            case '*': resultado = anterior * actual; break;
            case '/':
                if (actual === 0) {
                    operacionActual = 'Math Error';
                    actualizarPantalla();
                    return;
                }
                resultado = anterior / actual;
                break;
            default: return;
        }

        operacionActual = formatearNumero(resultado, true);
        operacionAnterior = '';
        resultadoMostrado = true;
        porcentajeUsado = false;
        actualizarPantalla();
        operacionTexto.textContent = '';
        agregarAlHistorial(`${anterior} ${operador} ${actual} = ${operacionActual}`);
    }

    function formatearNumero(numero, esResultado = false) {
        const maxDigitos = 10;
        const numeroFloat = parseFloat(numero);

        if (esResultado) {
            let resultadoFormateado = parseFloat(numeroFloat.toFixed(2)).toString();
            return resultadoFormateado.length > maxDigitos ? numeroFloat.toExponential(5) : resultadoFormateado;
        } else {
            return numero.toString().replace('.', '').length > maxDigitos ? numeroFloat.toExponential(5) : numero.toString();
        }
    }

    function resetearCalculadora() {
        operacionActual = '0';
        operacionAnterior = '';
        operador = null;
        resultadoMostrado = false;
        porcentajeUsado = false;
        actualizarPantalla();
        operacionTexto.textContent = '';
    }

    function agregarAlHistorial(operacion) {
        const li = document.createElement('li');
        li.textContent = operacion;
        historialLista.appendChild(li);
    }

    historialBtn.addEventListener('click', () => {
        historialDiv.classList.remove('oculto');
    });

    cerrarHistorial.addEventListener('click', () => {
        historialDiv.classList.add('oculto');
    });

    limpiarHistorial.addEventListener('click', () => {
        historialLista.innerHTML = '';
    });
});