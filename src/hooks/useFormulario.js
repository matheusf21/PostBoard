import { useState, useCallback } from 'react';

const REGRAS = {
  obrigatorio: (valor) => {
    if (!valor || valor.trim().length === 0) {
      return 'Este campo é obrigatório.';
    }
    return null;
  },
  minimo: (min) => (valor) => {
    if (valor && valor.trim().length < min) {
      return `Mínimo de ${min} caracteres.`;
    }
    return null;
  },
  maximo: (max) => (valor) => {
    if (valor && valor.trim().length > max) {
      return `Máximo de ${max} caracteres.`;
    }
    return null;
  },
  semEspacoInicial: (valor) => {
    if (valor && valor !== valor.trimStart()) {
      return 'Não pode começar com espaço.';
    }
    return null;
  },
};

export default function useFormulario(camposIniciais, regrasValidacao = {}) {
  const [valores, setValores] = useState(camposIniciais);
  const [erros, setErros] = useState({});
  const [tocados, setTocados] = useState({});

  const definir = useCallback((campo, valor) => {
    setValores(prev => ({ ...prev, [campo]: valor }));
    if (tocados[campo]) {
      validarCampo(campo, valor);
    }
  }, [tocados]);

  const tocar = useCallback((campo) => {
    setTocados(prev => ({ ...prev, [campo]: true }));
    validarCampo(campo, valores[campo]);
  }, [valores]);

  const validarCampo = useCallback((campo, valor) => {
    const regras = regrasValidacao[campo] || [];
    for (const regra of regras) {
      const erro = regra(valor);
      if (erro) {
        setErros(prev => ({ ...prev, [campo]: erro }));
        return false;
      }
    }
    setErros(prev => { const novo = { ...prev }; delete novo[campo]; return novo; });
    return true;
  }, [regrasValidacao]);

  const validarTudo = useCallback(() => {
    const todosTocados = Object.keys(camposIniciais).reduce(
      (acc, campo) => ({ ...acc, [campo]: true }), {}
    );
    setTocados(todosTocados);
    let formularioValido = true;
    for (const campo of Object.keys(regrasValidacao)) {
      const valido = validarCampo(campo, valores[campo]);
      if (!valido) formularioValido = false;
    }
    return formularioValido;
  }, [valores, regrasValidacao, camposIniciais]);

  const resetar = useCallback(() => {
    setValores(camposIniciais);
    setErros({});
    setTocados({});
  }, [camposIniciais]);

  const preencher = useCallback((dados) => {
    setValores(prev => ({ ...prev, ...dados }));
    setErros({});
    setTocados({});
  }, []);

  const temErros = Object.keys(erros).length > 0;

  return {
    valores,
    erros,
    tocados,
    temErros,
    definir,
    tocar,
    validarTudo,
    resetar,
    preencher,
  };
}

export { REGRAS };