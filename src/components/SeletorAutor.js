import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { getUsuarios } from '../services/api';

export default function SeletorAutor({ autorId, onSelecionar, erro }) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [autorSelecionado, setAutorSelecionado] = useState(null);

  useEffect(() => {
    if (modalVisivel && usuarios.length === 0) {
      carregarUsuarios();
    }
  }, [modalVisivel]);

  useEffect(() => {
    if (autorId && usuarios.length > 0) {
      const autor = usuarios.find(u => u.id === autorId);
      setAutorSelecionado(autor || null);
    }
  }, [autorId, usuarios]);

  async function carregarUsuarios() {
    try {
      setCarregando(true);
      const dados = await getUsuarios();
      setUsuarios(dados);
      if (autorId) {
        setAutorSelecionado(dados.find(u => u.id === autorId) || null);
      }
    } catch (e) {
      console.warn('Erro ao carregar usuários:', e.message);
    } finally {
      setCarregando(false);
    }
  }

  function selecionarAutor(usuario) {
    setAutorSelecionado(usuario);
    onSelecionar(usuario);
    setModalVisivel(false);
  }

  const temErro = !!erro;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Autor</Text>
        <Text style={styles.asterisco}> *</Text>
      </View>
      <TouchableOpacity
        style={[styles.seletor, temErro && styles.seletorErro]}
        onPress={() => setModalVisivel(true)}
      >
        <Text style={autorSelecionado ? styles.nomeAutor : styles.placeholder}>
          {autorSelecionado ? autorSelecionado.name : 'Selecione o autor...'}
        </Text>
        <Text style={styles.seta}>▼</Text>
      </TouchableOpacity>
      {temErro && (
        <Text style={styles.mensagemErro}>⚠ {erro}</Text>
      )}
      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Selecionar Autor</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Text style={styles.fechar}>✕</Text>
              </TouchableOpacity>
            </View>
            {carregando ? (
              <ActivityIndicator size="large" color="#1a56db" style={{ marginVertical: 40 }} />
            ) : (
              <FlatList
                data={usuarios}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.opcao,
                      autorId === item.id && styles.opcaoSelecionada,
                    ]}
                    onPress={() => selecionarAutor(item)}
                  >
                    <Text style={styles.opcaoNome}>{item.name}</Text>
                    <Text style={styles.opcaoEmail}>{item.email}</Text>
                    {autorId === item.id && (
                      <Text style={styles.check}>✓</Text>
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#f3f4f6' }} />}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  asterisco: { fontSize: 16, color: '#dc2626', fontWeight: '700' },
  seletor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
  },
  seletorErro: { borderColor: '#dc2626', backgroundColor: '#fef2f2' },
  nomeAutor: { fontSize: 15, color: '#1f2937', flex: 1 },
  placeholder: { fontSize: 15, color: '#9ca3af', flex: 1 },
  seta: { fontSize: 12, color: '#6b7280' },
  mensagemErro: { marginTop: 5, fontSize: 12, color: '#dc2626', fontWeight: '500' },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitulo: { fontSize: 17, fontWeight: '700', color: '#1e3a5f' },
  fechar: { fontSize: 20, color: '#6b7280', fontWeight: '300' },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  opcaoSelecionada: { backgroundColor: '#e8f0fe' },
  opcaoNome: { fontSize: 15, color: '#1f2937', flex: 1, fontWeight: '500' },
  opcaoEmail: { fontSize: 12, color: '#9ca3af', marginRight: 8 },
  check: { fontSize: 16, color: '#1a56db', fontWeight: '700' },
});