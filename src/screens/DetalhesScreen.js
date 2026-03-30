import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getUsuarioPorId, deletarPost } from '../services/api';
import { salvar, ler, lerMesmoExpirado, CHAVES } from '../storage/cache';
import LoadingIndicator from '../components/LoadingIndicator';

export default function DetalhesScreen({ navigation, route }) {
  const { post: postParams } = route.params;
  const [post, setPost] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletando, setDeletando] = useState(false);
  const [erroAutor, setErroAutor] = useState(null);

  useLayoutEffect(() => {
    if (post) {
      navigation.setOptions({ title: `Post #${post.id}` });
    }
  }, [navigation, post]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const chavePost = CHAVES.POST(postParams.id);
        let postExibido = null;
        const cachePost = await ler(chavePost);
        if (cachePost) {
          postExibido = cachePost;
        } else {
          postExibido = postParams;
          await salvar(chavePost, postExibido);
        }
        setPost(postExibido);

        const chaveUsuario = CHAVES.USUARIO(postExibido.userId);
        const cacheUsuario = await ler(chaveUsuario);
        if (cacheUsuario) {
          setUsuario(cacheUsuario);
          setLoading(false);
          return;
        }
        const dados = await getUsuarioPorId(postExibido.userId);
        setUsuario(dados);
        await salvar(chaveUsuario, dados);
      } catch (e) {
        const chavePost = CHAVES.POST(postParams.id);
        const cacheAntigoPost = await lerMesmoExpirado(chavePost);
        if (cacheAntigoPost) {
          setPost(cacheAntigoPost);
        } else {
          setPost(postParams);
        }
        const chaveUsuario = CHAVES.USUARIO(postParams.userId);
        const cacheAntigoUsuario = await lerMesmoExpirado(chaveUsuario);
        if (cacheAntigoUsuario) {
          setUsuario(cacheAntigoUsuario);
          setErroAutor(null);
        } else {
          setErroAutor('Não foi possível carregar as informações do autor.');
        }
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [postParams]);

  function confirmarDelecao() {
    if (!post) return;
    Alert.alert(
      'Excluir post',
      `Deseja excluir o post "${post.title.substring(0, 40)}..."?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: executarDelecao },
      ]
    );
  }

  async function executarDelecao() {
    try {
      setDeletando(true);
      await deletarPost(post.id);
      await remover(CHAVES.POST(post.id));
      Alert.alert('Sucesso', 'Post excluído com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível excluir o post.');
    } finally {
      setDeletando(false);
    }
  }

  if (loading || !post) {
    return <LoadingIndicator mensagem="Carregando post..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>{post.title}</Text>
        <Text style={styles.corpo}>{post.body}</Text>
      </View>

      {erroAutor ? (
        <View style={styles.aviso}>
          <Text style={styles.avisoTexto}>⚠️ {erroAutor}</Text>
        </View>
      ) : (
        usuario && (
          <View style={styles.autorCard}>
            <Text style={styles.autorLabel}>Autor</Text>
            <Text style={styles.autorNome}>{usuario.name}</Text>
            <Text style={styles.autorInfo}>✉️ {usuario.email}</Text>
            <Text style={styles.autorInfo}>🌐 {usuario.website}</Text>
            <Text style={styles.autorInfo}>🏢 {usuario.company.name}</Text>
          </View>
        )
      )}

      <View style={styles.acoes}>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => navigation.navigate('FormularioTab', { post })}
        >
          <Text style={styles.textoBotao}>✏️ Editar post</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botaoExcluir, deletando && styles.botaoDesabilitado]}
          onPress={confirmarDelecao}
          disabled={deletando}
        >
          <Text style={styles.textoBotao}>
            {deletando ? 'Excluindo...' : '🗑️ Excluir post'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 16 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e3a5f',
    textTransform: 'capitalize',
    marginBottom: 16,
    lineHeight: 28,
  },
  corpo: { fontSize: 15, color: '#374151', lineHeight: 24 },
  autorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1a56db',
  },
  autorLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  autorNome: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e3a5f',
    marginBottom: 8,
  },
  autorInfo: { fontSize: 13, color: '#6b7280', marginBottom: 4 },
  aviso: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  avisoTexto: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
  },
  acoes: { gap: 12 },
  botaoEditar: {
    backgroundColor: '#1a56db',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  botaoExcluir: {
    backgroundColor: '#dc2626',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  botaoDesabilitado: { opacity: 0.6 },
  textoBotao: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});