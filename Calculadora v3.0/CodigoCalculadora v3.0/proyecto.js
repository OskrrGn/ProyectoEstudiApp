document.addEventListener('DOMContentLoaded', () => {
    const pantallaTexto = document.getElementById('pantalla-texto');
    const operacionTexto = document.getElementById('operacion-texto');
    const historialLista = document.getElementById('historial-lista');
    const historialBtn = document.getElementById('historial-btn');
    const cerrarHistorial = document.getElementById('cerrar-historial');
    const limpiarHistorial = document.getElementById('limpiar-historial');
    const historialDiv = document.querySelector('.historial');
    const mcBtn = document.getElementById('mc');
    const mrBtn = document.getElementById('mr');
    const mmasBtn = document.getElementById('mmas');
    const mmenosBtn = document.getElementById('mmenos');

    let memoria = 0;
    let operacionActual = '0';
    let operacionAnterior = '';
    let operador = null;
    let resultadoMostrado = false;
    let porcentajeUsado = false;
    let enModoMR = false;

    const actualizarPantalla = () => (pantallaTexto.textContent = operacionActual);
    const actualizarOperacion = () => (operacionTexto.textContent = operacionAnterior ? `${operacionAnterior} ${operador || ''}` : '');

    mcBtn.addEventListener('click', () => (memoria = 0));
    mrBtn.addEventListener('click', () => {
        operacionActual = memoria.toString();
        resultadoMostrado = false;
        enModoMR = true;
        actualizarPantalla();
    });

    mmasBtn.addEventListener('click', () => actualizarMemoria(1));
    mmenosBtn.addEventListener('click', () => actualizarMemoria(-1));

    function actualizarMemoria(signo) {
        const valorActual = parseFloat(pantallaTexto.textContent);
        if (!isNaN(valorActual) && pantallaTexto.textContent !== 'Math Error') {
            memoria += signo * valorActual;
        }
    }

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => manejarInput(btn.textContent));
    });

    function manejarInput(valor) {
        if (resultadoMostrado && /\d/.test(valor)) {
            operacionActual = valor;
            resultadoMostrado = false;
        } else if (resultadoMostrado && ['+', '-', '*', '/', '%'].includes(valor)) {
            operacionAnterior = operacionActual;
            operador = valor;
            resultadoMostrado = false;
            operacionActual = '0';
        } else if (/\d/.test(valor)) {
            if (operacionActual.includes('e')) return;
            operacionActual = operacionActual === '0' ? valor : operacionActual + valor;
        } else if (valor === '.') {
            if (!operacionActual.includes('.') && !porcentajeUsado) operacionActual += valor;
        } else if (valor === 'C') {
            resetearCalculadora();
        } else if (valor === 'CE') {
            operacionActual = '0';
            porcentajeUsado = false;
        } else if (valor === '←') {
            if (!porcentajeUsado && !enModoMR && !resultadoMostrado) {
                operacionActual = operacionActual.slice(0, -1) || '0';
            }
        } else if (valor === '%') {
            if (!operacionActual.includes('%')) {
                operacionActual += '';
                operador = '%';  
                operacionAnterior = operacionActual;
            }
        } else if (valor === '-') {
            if (operacionActual === '0' || resultadoMostrado) {
                operacionActual = '-' + operacionActual.slice(1); 
                resultadoMostrado = false;
            } else {
                if (operador) calcular(); 
                operador = valor;
                operacionAnterior = operacionActual;
                operacionActual = '0';
                porcentajeUsado = false;
                enModoMR = false;
            }
        } else if (['+', '*', '/'].includes(valor)) {
            if (operacionActual !== '0') {
                if (operador) calcular();
                operador = valor;
                operacionAnterior = operacionActual;
                operacionActual = '0';
                porcentajeUsado = false;
                enModoMR = false;
            }
        } else if (valor === '=') {
            if (operador || porcentajeUsado) {
                calcular();
                operador = null;
            }
        }
    
        actualizarPantalla();
        actualizarOperacion();
    }
    
    function calcular() {
        let anterior = parseFloat(operacionAnterior.replace('%', ''));
        let actual = parseFloat(operacionActual.replace('%', ''));
        if (porcentajeUsado) {
            actual = anterior * (actual / 100);  
            porcentajeUsado = false;  
        }
    
        if (isNaN(anterior) || isNaN(actual)) return mostrarError();
    
        let resultado;
        switch (operador) {
            case '+': resultado = anterior + actual; break;
            case '-': resultado = anterior - actual; break;
            case '*': resultado = anterior * actual; break;
            case '/': resultado = actual === 0 ? mostrarError() : anterior / actual; break;
            case '%': resultado = anterior / 100; break;
            default: resultado = actual;
        }
    
        if (resultado !== 'Math Error') {
            operacionActual = formatearNumero(resultado, true);
            agregarAlHistorial(`${operacionAnterior} ${operador || ''} ${operador === '%' ? '' : operacionActual} = ${operacionActual}`);
        }
    
        operacionAnterior = '';
        resultadoMostrado = true;
        porcentajeUsado = false;
        enModoMR = false;
        actualizarPantalla();
        operacionTexto.textContent = '';
    }

    function mostrarError() {
        operacionActual = 'Math Error';
        actualizarPantalla();
        return 'Math Error';
    }

    function formatearNumero(numero, esResultado = false) {
        const maxDigitos = 10;
        const numeroFloat = Number(numero);

        if (esResultado) {
            let resultadoFormateado = numeroFloat.toFixed(2).replace(/\.00$/, '');
            return resultadoFormateado.length > maxDigitos ? numeroFloat.toExponential(5) : resultadoFormateado;
        }
        return numero.toString().replace('.', '').length > maxDigitos ? numeroFloat.toExponential(5) : numero.toString();
    }

    function resetearCalculadora() {
        operacionActual = '0';
        operacionAnterior = '';
        operador = null;
        resultadoMostrado = false;
        porcentajeUsado = false;
        enModoMR = false;
        actualizarPantalla();
        operacionTexto.textContent = '';
    }

    function agregarAlHistorial(operacion) {
        const li = document.createElement('li');
        li.textContent = operacion;
        historialLista.appendChild(li);
    }

    historialBtn.addEventListener('click', () => historialDiv.classList.remove('oculto'));
    cerrarHistorial.addEventListener('click', () => historialDiv.classList.add('oculto'));
    limpiarHistorial.addEventListener('click', () => (historialLista.innerHTML = ''));
});