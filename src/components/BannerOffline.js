import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default function BannerOffline() {
  const [conectado, setConectado] = useState(true);
  const [visivel, setVisivel] = useState(false);
  const opacidade = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable !== false;
      setConectado(online);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!conectado) {
      setVisivel(true);
      Animated.timing(opacidade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacidade, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisivel(false));
    }
  }, [conectado]);

  if (!visivel) return null;

  return (
    <Animated.View style={[styles.banner, { opacity: opacidade }]}>
      <Text style={styles.texto}>📡 Sem conexão com a internet</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#1e3a5f',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  texto: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
  },
});