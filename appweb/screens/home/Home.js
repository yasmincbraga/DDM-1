import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { auth } from '../../firebase/firebase';
import {
  getFirebaseErrorMessage,
  signOutUser,
} from '../../firebase/users';
import {
  ActionButton,
  colors,
  FeedbackMessage,
  PageHeader,
  Screen,
  Surface,
} from '../shared';

export default function Home({ navigation }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [signingOut, setSigningOut] = useState(false);
  const userName = auth.currentUser?.displayName || 'Usuário';

  async function handleSignOut() {
    setErrorMessage('');
    setSigningOut(true);

    try {
      await signOutUser();
    } catch (error) {
      setErrorMessage(getFirebaseErrorMessage(error));
      setSigningOut(false);
    }
  }

  return (
    <Screen>
      <PageHeader
        eyebrow="Painel"
        title={`Olá, ${userName}`}
        subtitle="Gerencie seus dados e acesse as opções da sua conta."
      />

      <Surface style={{ marginBottom: 18 }}>
        <Text style={{ color: colors.muted, fontSize: 14 }}>
          {auth.currentUser?.email}
        </Text>
        <Text
          style={{
            color: colors.purpleDark,
            fontSize: 22,
            fontWeight: '800',
            marginTop: 5,
          }}
        >
          O que deseja fazer?
        </Text>
      </Surface>

      <View style={{ gap: 12 }}>
        <ActionButton
          label="Meu perfil"
          onPress={() => navigation.navigate('Perfil')}
        />
        <ActionButton
          label="Sobre o aplicativo"
          secondary
          onPress={() => navigation.navigate('Sobre')}
        />
        <FeedbackMessage message={errorMessage} />
        <ActionButton
          label={signingOut ? 'Saindo...' : 'Sair'}
          secondary
          disabled={signingOut}
          onPress={handleSignOut}
        />
        {signingOut ? (
          <ActivityIndicator color={colors.purple} />
        ) : null}
      </View>
    </Screen>
  );
}
