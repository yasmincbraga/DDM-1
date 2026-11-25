import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles, { colors } from '../shared/Estilo';
import { verificarLogin } from './Funcoes';

export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function fazerLogin() {
    if (verificarLogin(usuario, senha)) {
      setErro('');
      navigation.navigate('Home');
    } else {
      setErro('Usuário ou senha incorretos. Tente novamente.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.forest} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.loginPage}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.crest}>
            <Text style={styles.crestLetter}>H</Text>
          </View>
          <Text style={styles.loginEyebrow}>ESCOLA DE MAGIA E BRUXARIA</Text>
          <Text style={styles.loginTitle}>Portal de Hogwarts</Text>
          <Text style={styles.loginSubtitle}>
            Entre para acessar sua calculadora mágica.
          </Text>

          <View style={styles.loginCard}>
            <Text style={styles.inputLabel}>USUÁRIO</Text>
            <TextInput
              accessibilityLabel="Usuário"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setUsuario}
              onSubmitEditing={fazerLogin}
              placeholder="Digite seu usuário"
              placeholderTextColor={colors.placeholder}
              returnKeyType="next"
              style={styles.input}
              value={usuario}
            />

            <Text style={[styles.inputLabel, styles.passwordLabel]}>SENHA</Text>
            <TextInput
              accessibilityLabel="Senha"
              autoCapitalize="none"
              onChangeText={setSenha}
              onSubmitEditing={fazerLogin}
              placeholder="Digite sua senha"
              placeholderTextColor={colors.placeholder}
              returnKeyType="go"
              secureTextEntry
              style={styles.input}
              value={senha}
            />

            {erro ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {erro}
              </Text>
            ) : null}

            <Pressable
              accessibilityRole="button"
              onPress={fazerLogin}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Entrar no castelo</Text>
            </Pressable>

            <Text style={styles.loginHint}>Acesso de demonstração: admin / admin</Text>
          </View>

          <Text style={styles.loginFooter}>✦  A magia começa com um bom cálculo  ✦</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
