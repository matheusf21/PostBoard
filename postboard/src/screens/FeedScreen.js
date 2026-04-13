import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { getPosts } from '../services/api';
import { salvar, lerItemCompleto, lerMesmoExpirado, CHAVES } from '../storage/cache';
import PostCard from '../components/PostCard';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';

export default function FeedScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [postsFiltrados, setPostsFiltrados] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [fonteOffline, setFonteOffline] = useState(false);
  const [cacheTimestamp, setCacheTimestamp] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('FormularioTab')}
          style={{ marginRight: 4, padding: 4 }}
        >
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: '300' }}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    carregarPosts();
  }, []);

  useEffect(() => {
    if (!busca.trim()) {
      setPostsFiltrados(posts);
    } else {
      const termo = busca.toLowerCase();
      const filtrados = posts.filter(post =>
        post.title.toLowerCase().includes(termo)
      );
      setPostsFiltrados(filtrados);
    }
  }, [busca, posts]);

  async function carregarPosts() {
    try {
      setLoading(true);
      setErro(null);
      const cacheCompleto = await lerItemCompleto(CHAVES.POSTS);
      if (cacheCompleto && cacheCompleto.dados) {
        setPosts(cacheCompleto.dados);
        setPostsFiltrados(cacheCompleto.dados);
        setCacheTimestamp(cacheCompleto.timestamp);
        setFonteOffline(false);
        setLoading(false);
        return;
      }
      const dados = await getPosts();
      setPosts(dados);
      setPostsFiltrados(dados);
      await salvar(CHAVES.POSTS, dados);
      setCacheTimestamp(Date.now());
      setFonteOffline(false);
    } catch (e) {
      const cacheAntigo = await lerMesmoExpirado(CHAVES.POSTS);
      if (cacheAntigo && cacheAntigo.dados) {
        setPosts(cacheAntigo.dados);
        setPostsFiltrados(cacheAntigo.dados);
        setCacheTimestamp(cacheAntigo.timestamp);
        setFonteOffline(true);
      } else {
        setErro('Sem conexão e sem dados em cache.\nVerifique sua internet.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    try {
      setRefreshing(true);
      setErro(null);
      const dados = await getPosts();
      setPosts(dados);
      setPostsFiltrados(dados);
      await salvar(CHAVES.POSTS, dados);
      setCacheTimestamp(Date.now());
      setFonteOffline(false);
    } catch (e) {
      setErro('Não foi possível atualizar. Verifique sua conexão.');
    } finally {
      setRefreshing(false);
    }
  }

  function formatarIdade(timestamp) {
    if (!timestamp) return '';
    const segundos = Math.floor((Date.now() - timestamp) / 1000);
    if (segundos < 60) return 'agora mesmo';
    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) return `há ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    const horas = Math.floor(minutos / 60);
    return `há ${horas} hora${horas !== 1 ? 's' : ''}`;
  }

  if (loading) return <LoadingIndicator mensagem="Carregando posts..." />;

  if (erro && posts.length === 0) {
    return (
      <EmptyState
        icone="⚠️"
        titulo="Ops! Algo deu errado"
        mensagem={erro}
        textoBotao="Tentar novamente"
        onBotao={carregarPosts}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar por título..."
          placeholderTextColor="#9ca3af"
          value={busca}
          onChangeText={setBusca}
          clearButtonMode="while-editing"
        />
      </View>
      {(fonteOffline || cacheTimestamp) && (
        <View style={styles.infoContainer}>
          {fonteOffline && (
            <View style={styles.bannerOffline}>
              <Text style={styles.bannerTexto}>
                📡 Sem internet --- exibindo dados salvos anteriormente
              </Text>
            </View>
          )}
          {cacheTimestamp && (
            <Text style={styles.idadeTexto}>
              🕒 Última atualização: {formatarIdade(cacheTimestamp)}
            </Text>
          )}
        </View>
      )}
      <FlatList
        data={postsFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate('Detalhes', { post: item })}
          />
        )}
        ListEmptyComponent={
          busca.trim() ? (
            <EmptyState
              icone="🔍"
              titulo="Nenhum resultado encontrado"
              mensagem={`Nenhum post com "${busca}" foi encontrado.`}
            />
          ) : (
            <EmptyState icone="📭" titulo="Nenhum post encontrado" mensagem="A lista está vazia." />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1a56db']}
            tintColor="#1a56db"
          />
        }
        contentContainerStyle={postsFiltrados.length === 0 ? styles.listaVazia : styles.lista}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  lista: { padding: 16, paddingBottom: 32 },
  listaVazia: { flex: 1, justifyContent: 'center' },
  searchContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#1f2937',
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  bannerOffline: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bannerTexto: {
    fontSize: 13,
    color: '#92400e',
    textAlign: 'center',
    fontWeight: '500',
  },
  idadeTexto: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 6,
    backgroundColor: '#f9fafb',
  },
});