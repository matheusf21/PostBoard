import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
 
export default function FormularioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Novo Post</Text>
      <Text style={styles.subtitulo}>
        bla bla
      </Text>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6',
    alignItems: 'center', justifyContent: 'center', padding: 24 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1e3a5f', marginBottom: 8 },
  subtitulo: { fontSize: 15, color: '#6b7280', textAlign: 'center' },
});
