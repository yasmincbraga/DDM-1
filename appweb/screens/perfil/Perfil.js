import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { auth } from '../../firebase/firebase';
import {
  getFirebaseErrorMessage,
  getUserProfile,
} from '../../firebase/users';
import {
  ActionButton,
  colors,
  FeedbackMessage,
  PageHeader,
  Screen,
  Surface,
} from '../shared';

export default function Perfil({ navigation }) {
  const user = auth.currentUser;
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    getUserProfile(user)
      .then((result) => {
        if (active) setProfile(result);
      })
      .catch((error) => {
        if (active) setErrorMessage(getFirebaseErrorMessage(error));
      });

    return () => {
      active = false;
    };
  }, [user]);

  return (
    <Screen>
      <PageHeader
        eyebrow="Minha conta"
        title="Meu perfil"
        subtitle="Confira as informações do seu cadastro."
      />

      <Surface style={{ alignItems: 'center', marginBottom: 20 }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.purpleLight,
            borderRadius: 40,
            height: 80,
            justifyContent: 'center',
            marginBottom: 14,
            width: 80,
          }}
        >
          <Text style={{ color: colors.purple, fontSize: 30, fontWeight: '800' }}>
            {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        {profile ? (
          <>
            <Text style={{ color: colors.purpleDark, fontSize: 20, fontWeight: '800' }}>
              {profile.name || 'Usuário'}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 14, marginTop: 5 }}>
              {profile.email}
            </Text>
          </>
        ) : (
          <ActivityIndicator color={colors.purple} />
        )}
        <FeedbackMessage message={errorMessage} />
      </Surface>

      <View style={{ gap: 12 }}>
        <ActionButton
          label="Editar informações"
          onPress={() => navigation.navigate('Editar')}
        />
        <ActionButton
          label="Voltar ao início"
          secondary
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </Screen>
  );
}
