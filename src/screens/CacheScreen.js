import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { informacoes, limparTudo, remover } from '../storage/cache';

export default function CacheScreen() {
  const [itens, setItens] = useState([]);

  const carregarInfo = useCallback(async () => {
    const dados = await informacoes();
    setItens(dados);
  }, []);

  useEffect(() => {
    carregarInfo();
  }, [carregarInfo]);

  async function handleLimparTudo() {
    Alert.alert(
      'Limpar cache',
      'Isso removerá todos os dados salvos localmente. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar tudo',
          style: 'destructive',
          onPress: async () => {
            await limparTudo();
            await carregarInfo();
          },
        },
      ]
    );
  }

  async function handleRemoverItem(chave) {
    await remover(chave);
    await carregarInfo();
  }

  const formatarTempo = (segundos) => {
    if (segundos < 60) return `${segundos}s atrás`;
    if (segundos < 3600) return `${Math.floor(segundos / 60)}min atrás`;
    return `${Math.floor(segundos / 3600)}h atrás`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Itens em cache: {itens.length}</Text>
      <FlatList
        data={itens}
        keyExtractor={(item) => item.chave}
        ListEmptyComponent={<Text style={styles.vazio}>Cache vazio.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.chave} numberOfLines={1}>
                {item.chave}
              </Text>
              <Text style={styles.idade}>
                {formatarTempo(item.idadeSegundos)}
                {item.idadeSegundos > 300 ? ' ⚠️ expirado' : ' ✅ válido'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleRemoverItem(item.chave)}
              style={styles.btnRemover}
            >
              <Text style={styles.btnRemoverTexto}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={styles.lista}
      />
      <TouchableOpacity
        style={[styles.btnLimpar, itens.length === 0 && styles.btnDesabilitado]}
        onPress={handleLimparTudo}
        disabled={itens.length === 0}
      >
        <Text style={styles.btnLimparTexto}>🗑️ Limpar todo o cache</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  lista: { padding: 16, paddingBottom: 100 },
  titulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e3a5f',
    padding: 16,
    paddingBottom: 4,
  },
  vazio: { textAlign: 'center', color: '#9ca3af', marginTop: 40 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    elevation: 1,
  },
  itemInfo: { flex: 1 },
  chave: { fontSize: 13, fontFamily: 'monospace', color: '#1a56db', marginBottom: 3 },
  idade: { fontSize: 12, color: '#6b7280' },
  btnRemover: { padding: 4 },
  btnRemoverTexto: { fontSize: 18 },
  btnLimpar: {
    margin: 16,
    backgroundColor: '#dc2626',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  btnDesabilitado: { opacity: 0.4 },
  btnLimparTexto: { color: '#fff', fontSize: 15, fontWeight: '700' },
});