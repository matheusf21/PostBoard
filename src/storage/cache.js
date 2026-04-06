import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIXO = '@postboard:';
const TTL_PADRAO_MS = 5 * 60 * 1000;

export const CHAVES = {
  POSTS: `${PREFIXO}posts`,
  POST: (id) => `${PREFIXO}post_${id}`,
  USUARIO: (id) => `${PREFIXO}usuario_${id}`,
};

export async function salvar(chave, dados, ttlMs = null) {
  try {
    const item = {
      dados,
      timestamp: Date.now(),
      ttl: ttlMs !== null ? ttlMs : TTL_PADRAO_MS,
    };
    await AsyncStorage.setItem(chave, JSON.stringify(item));
  } catch (e) {
    console.warn(`[cache] Erro ao salvar '${chave}':`, e.message);
  }
}

export async function lerItemCompleto(chave, respeitarTTL = true) {
  try {
    const json = await AsyncStorage.getItem(chave);
    if (json === null) return null;
    const item = JSON.parse(json);
    if (respeitarTTL) {
      const idade = Date.now() - item.timestamp;
      const ttl = item.ttl !== undefined ? item.ttl : TTL_PADRAO_MS;
      if (idade > ttl) {
        return null;
      }
    }
    return item;
  } catch (e) {
    console.warn(`[cache] Erro ao ler '${chave}':`, e.message);
    return null;
  }
}

export async function ler(chave, respeitarTTL = true) {
  const item = await lerItemCompleto(chave, respeitarTTL);
  return item ? item.dados : null;
}

export async function lerMesmoExpirado(chave) {
  return ler(chave, false);
}

export async function remover(chave) {
  try {
    await AsyncStorage.removeItem(chave);
  } catch (e) {
    console.warn(`[cache] Erro ao remover '${chave}':`, e.message);
  }
}

export async function limparTudo() {
  try {
    const todasChaves = await AsyncStorage.getAllKeys();
    const chavesDoApp = todasChaves.filter(k => k.startsWith(PREFIXO));
    if (chavesDoApp.length > 0) {
      await AsyncStorage.multiRemove(chavesDoApp);
    }
  } catch (e) {
    console.warn('[cache] Erro ao limpar cache:', e.message);
  }
}

export async function informacoes() {
  try {
    const todasChaves = await AsyncStorage.getAllKeys();
    const chavesDoApp = todasChaves.filter(k => k.startsWith(PREFIXO));
    const detalhes = await Promise.all(
      chavesDoApp.map(async (chave) => {
        const json = await AsyncStorage.getItem(chave);
        const item = JSON.parse(json);
        const idadeSegundos = Math.round((Date.now() - item.timestamp) / 1000);
        return { chave, idadeSegundos };
      })
    );
    return detalhes;
  } catch (e) {
    return [];
  }
}