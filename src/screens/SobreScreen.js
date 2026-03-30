import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SobreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>PostBoard</Text>
      <Text style={styles.versao}>Versão 1.0.0</Text>
      <Text style={styles.desenvolvedor}>Thaylla - 3ºMTEC</Text>
      <Text style={styles.descricao}>
        Aplicativo de exemplo para gerenciamento de posts.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#064e3b',
    marginBottom: 8,
  },
  versao: {
    fontSize: 18,
    color: '#059669',
    marginBottom: 8,
  },
  desenvolvedor: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
  },
  descricao: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});