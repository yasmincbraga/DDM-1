import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth } from '../../firebase/firebase';
import {
  getFirebaseErrorMessage,
  getUserProfile,
  updateUserProfile,
} from '../../firebase/users';
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

export default function Editar({ navigation }) {
  const user = auth.currentUser;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    getUserProfile(user)
      .then((profile) => {
        if (!active) return;
        setName(profile.name);
        setEmail(profile.email);
      })
      .catch((error) => {
        if (active) setErrorMessage(getFirebaseErrorMessage(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  async function handleSave() {
    if (!name.trim() || !email.trim()) {
      setErrorMessage('Nome e e-mail são obrigatórios.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMessage('A nova senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setErrorMessage('');
    setSubmitting(true);

    try {
      await updateUserProfile({
        user,
        name,
        email,
        currentPassword,
        newPassword,
      });
      navigation.navigate('Perfil');
    } catch (error) {
      setErrorMessage(getFirebaseErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <PageHeader
        eyebrow="Minha conta"
        title="Editar perfil"
        subtitle="Atualize as informações do seu usuário."
      />

      <Surface>
        {loading ? (
          <ActivityIndicator
            color={colors.purple}
            style={{ marginVertical: 20 }}
          />
        ) : (
          <>
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
              label="Senha atual"
              placeholder="Obrigatória para alterar e-mail ou senha"
              secureTextEntry
              autoCapitalize="none"
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextField
              label="Nova senha (opcional)"
              placeholder="Deixe em branco para manter"
              secureTextEntry
              autoCapitalize="none"
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <FeedbackMessage message={errorMessage} />
            <ActionButton
              label={submitting ? 'Salvando...' : 'Salvar alterações'}
              onPress={handleSave}
              disabled={submitting}
            />
            {submitting ? (
              <ActivityIndicator
                color={colors.purple}
                style={{ marginTop: 14 }}
              />
            ) : null}
          </>
        )}
        {!loading ? (
          <View style={{ marginTop: 20 }}>
            <LinkButton
              label="Cancelar"
              onPress={() => navigation.navigate('Perfil')}
            />
          </View>
        ) : null}
      </Surface>
    </Screen>
  );
}
