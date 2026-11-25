import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
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
import {
  getFirebaseErrorMessage,
  registerUser,
} from '../../firebase/users';

export default function Cadastro({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setErrorMessage('');
    setSubmitting(true);

    try {
      await registerUser(name, email, password);
    } catch (error) {
      setErrorMessage(getFirebaseErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <PageHeader
        eyebrow="Nova conta"
        title="Criar cadastro"
        subtitle="Preencha seus dados para criar um perfil."
      />

      <Surface>
        <TextField
          label="Nome completo"
          placeholder="Seu nome"
          value={name}
          onChangeText={setName}
        />
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
          placeholder="Crie uma senha (mínimo 6 caracteres)"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
        <FeedbackMessage message={errorMessage} />
        <ActionButton
          label={submitting ? 'Cadastrando...' : 'Cadastrar'}
          onPress={handleRegister}
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
            label="Já tem uma conta? Entrar"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </Surface>
    </Screen>
  );
}
