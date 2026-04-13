import React, { useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function CampoTexto({
  label,
  valor,
  onMudar,
  onSairFoco,
  erro,
  obrigatorio = false,
  proximoCampo,
  ultimoCampo = false,
  ...restProps
}) {
  const temErro = !!erro;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {obrigatorio && <Text style={styles.asterisco}> *</Text>}
      </View>
      <TextInput
        style={[
          styles.input,
          temErro && styles.inputErro,
          !temErro && valor && styles.inputValido,
        ]}
        value={valor}
        onChangeText={onMudar}
        onBlur={onSairFoco}
        returnKeyType={ultimoCampo ? 'done' : 'next'}
        onSubmitEditing={() => {
          if (proximoCampo && proximoCampo.current) {
            proximoCampo.current.focus();
          }
        }}
        blurOnSubmit={ultimoCampo}
        placeholderTextColor="#9ca3af"
        {...restProps}
      />
      {temErro && (
        <Text style={styles.mensagemErro}>⚠ {erro}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  asterisco: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  inputErro: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  inputValido: {
    borderColor: '#059669',
  },
  mensagemErro: {
    marginTop: 5,
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
  },
});