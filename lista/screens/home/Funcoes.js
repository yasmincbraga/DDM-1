const operatorSymbols = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
};

function parseNumber(value) {
  if (!value.trim()) return null;

  const parsed = Number(value.trim().replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function formatNumber(value) {
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 8 });
}

export function realizarCalculo(numero1, numero2, operacao) {
  const n1 = parseNumber(numero1);
  const n2 = parseNumber(numero2);

  if (n1 === null || n2 === null) {
    return { error: 'Preencha os dois campos com números válidos.' };
  }

  if (operacao === '/' && n2 === 0) {
    return { error: 'Não é possível dividir por zero.' };
  }

  let resultado;
  switch (operacao) {
    case '+':
      resultado = n1 + n2;
      break;
    case '-':
      resultado = n1 - n2;
      break;
    case '*':
      resultado = n1 * n2;
      break;
    case '/':
      resultado = n1 / n2;
      break;
    default:
      return { error: 'Operação inválida.' };
  }

  if (!Number.isFinite(resultado)) {
    return { error: 'O resultado não pode ser representado.' };
  }

  return {
    result: resultado,
    formattedResult: formatNumber(resultado),
    expression: `${formatNumber(n1)} ${operatorSymbols[operacao]} ${formatNumber(n2)}`,
  };
}
