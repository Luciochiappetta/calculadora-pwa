document.addEventListener('DOMContentLoaded', () => {
  const display = document.querySelector('.display');
  const buttons = document.querySelectorAll('button[data-key]');
  const historicoLista = document.querySelector('.lista-historico');
  const toggleBtn = document.querySelector('.toggle-theme');
  const exportarBtn = document.querySelector('.exportar-historico');
  let displayValue = '';

  function atualizarDisplay(valor) {
    display.value = valor;
  }

  function adicionarHistorico(entrada, resultado) {
    const item = document.createElement('li');
    item.textContent = `${entrada} = ${resultado}`;
    historicoLista.prepend(item);
  }

  function calcularExpressao(expr) {
    try {
      const resultado = eval(expr);
      adicionarHistorico(expr, resultado);
      return resultado;
    } catch {
      return 'Erro';
    }
  }

  function processarEntrada(valor) {
    if (valor === 'C') {
      displayValue = '';
    } else if (valor === '=') {
      displayValue = calcularExpressao(displayValue).toString();
    } else if (valor === 'backspace') {
      displayValue = displayValue.slice(0, -1);
    } else {
      displayValue += valor;
    }
    atualizarDisplay(displayValue);
  }

  buttons.forEach(button => {
    button.addEventListener('click', e => {
      const valor = e.target.getAttribute('data-key');
      processarEntrada(valor);
    });
  });

  document.addEventListener('keydown', e => {
    const teclasValidas = '0123456789+-*/.=cC';
    if (teclasValidas.includes(e.key)) {
      if (e.key === 'Enter') {
        processarEntrada('=');
      } else if (e.key.toLowerCase() === 'c') {
        processarEntrada('C');
      } else {
        processarEntrada(e.key);
      }
    } else if (e.key === 'Backspace') {
      processarEntrada('backspace');
    }
  });

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    toggleBtn.textContent = document.body.classList.contains('dark')
      ? '☀️ Modo Claro'
      : '🌙 Modo Escuro';
  });

  exportarBtn.addEventListener('click', () => {
    const historico = Array.from(historicoLista.children)
      .map(li => li.textContent)
      .join('\n');
    const blob = new Blob([historico], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historico_calculadora.txt';
    a.click();
    URL.revokeObjectURL(url);
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('service-worker.js')
        .then(reg => console.log('Service Worker registrado:', reg))
        .catch(err => console.error('Erro ao registrar Service Worker:', err));
    });
  }
});
