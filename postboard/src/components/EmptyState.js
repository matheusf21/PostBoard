import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function EmptyState({
  icone = '📭',
  titulo,
  mensagem,
  textoBotao,
  onBotao,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.icone}>{icone}</Text>
      <Text style={styles.titulo}>{titulo}</Text>
      {mensagem && <Text style={styles.mensagem}>{mensagem}</Text>}
      {textoBotao && onBotao && (
        <TouchableOpacity style={styles.botao} onPress={onBotao}>
          <Text style={styles.textoBotao}>{textoBotao}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  icone: {
    fontSize: 56,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e3a5f',
    textAlign: 'center',
    marginBottom: 8,
  },
  mensagem: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  botao: {
    backgroundColor: '#1a56db',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 8,
  },
  textoBotao: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});