import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PostCard({ post, onPress }) {
  const resumo = post.body.length > 120
    ? post.body.substring(0, 120) + '...'
    : post.body;

  const hoje = new Date();
  const dataFormatada = `${hoje.getDate().toString().padStart(2, '0')}/${(hoje.getMonth() + 1).toString().padStart(2, '0')}/${hoje.getFullYear()}`;

  const badgeColor = post.userId % 2 === 0 ? '#10b981' : '#f59e0b';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.cabecalho}>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeTexto}>#{post.id}</Text>
        </View>
        <Text style={styles.titulo} numberOfLines={2}>
          {post.title}
        </Text>
      </View>
      <Text style={styles.resumo}>{resumo}</Text>
      <View style={styles.rodape}>
        <Text style={styles.autor}>👤 Usuário #{post.userId}</Text>
        <Text style={styles.data}>{dataFormatada}</Text>
        <Text style={styles.lerMais}>Ver mais →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 2,
  },
  badgeTexto: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  titulo: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1e3a5f',
    lineHeight: 21,
    textTransform: 'capitalize',
  },
  resumo: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 19,
    marginBottom: 12,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
  },
  autor: {
    fontSize: 12,
    color: '#9ca3af',
  },
  data: {
    fontSize: 12,
    color: '#9ca3af',
  },
  lerMais: {
    fontSize: 12,
    color: '#1a56db',
    fontWeight: '600',
  },
});