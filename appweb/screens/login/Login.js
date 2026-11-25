import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import {
  ActionButton,
  colors,
  FeedbackMessage,
  LinkButton,
  PageHeader,
  Screen,
  Surface,
  TextField,
} from '../shared';
import { getFirebaseErrorMessage, signIn } from '../../firebase/users';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSignIn() {
    setErrorMessage('');
    setSubmitting(true);

    try {
      await signIn(email, password);
    } catch (error) {
      setErrorMessage(getFirebaseErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginBottom: 28 }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.purple,
            borderRadius: 18,
            height: 64,
            justifyContent: 'center',
            marginBottom: 18,
            width: 64,
          }}
        >
          <Text style={{ color: colors.white, fontSize: 28, fontWeight: '800' }}>
            U
          </Text>
        </View>
        <PageHeader
          eyebrow="Área do usuário"
          title="Bem-vindo"
          subtitle="Entre para acessar sua conta."
        />
      </View>

      <Surface>
        <TextField
          label="E-mail"
          placeholder="voce@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          label="Senha"
          placeholder="Digite sua senha"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
        <FeedbackMessage message={errorMessage} />
        <ActionButton
          label={submitting ? 'Entrando...' : 'Entrar'}
          onPress={handleSignIn}
          disabled={submitting}
        />
        {submitting ? (
          <ActivityIndicator
            color={colors.purple}
            style={{ marginTop: 14 }}
          />
        ) : null}
        <View style={{ marginTop: 20 }}>
          <LinkButton
            label="Ainda não tem conta? Cadastre-se"
            onPress={() => navigation.navigate('Cadastro')}
          />
        </View>
      </Surface>
    </Screen>
  );
}
