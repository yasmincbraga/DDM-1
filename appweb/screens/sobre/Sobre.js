import { Text } from 'react-native';
import {
  ActionButton,
  colors,
  PageHeader,
  Screen,
  Surface,
} from '../shared';

export default function Sobre({ navigation }) {
  return (
    <Screen>
      <PageHeader
        eyebrow="Informações"
        title="Sobre"
        subtitle="Conheça o aplicativo."
      />

      <Surface style={{ marginBottom: 20 }}>
        <Text
          style={{
            color: colors.purpleDark,
            fontSize: 18,
            fontWeight: '800',
            marginBottom: 10,
          }}
        >
          Área do usuário
        </Text>
        <Text style={{ color: colors.muted, fontSize: 15, lineHeight: 23 }}>
          Um espaço para acessar seu perfil e gerenciar suas informações de
          cadastro com simplicidade.
        </Text>
      </Surface>

      <ActionButton
        label="Voltar ao início"
        onPress={() => navigation.navigate('Home')}
      />
    </Screen>
  );
}
