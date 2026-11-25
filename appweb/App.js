import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { observeAuthState } from './firebase/users';
import Login from './screens/login/Login';
import Home from './screens/home/Home';
import Cadastro from './screens/cadastro/Cadastro';
import Perfil from './screens/perfil/Perfil';
import Editar from './screens/editar/Editar';
import Sobre from './screens/sobre/Sobre';
const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(
    () =>
      observeAuthState((authenticatedUser) => {
        setUser(authenticatedUser);
        setInitializing(false);
      }),
    [],
  );

  if (initializing) {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#F7F4FC',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color="#6D35A5" size="large" />
        <Text style={{ color: '#4E237D', marginTop: 12 }}>
          Carregando sua conta...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        key={user ? 'authenticated' : 'unauthenticated'}
        initialRouteName={user ? 'Home' : 'Login'}
        screenOptions={{ headerShown: false }}
      >
        {user ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Perfil" component={Perfil} />
            <Stack.Screen name="Editar" component={Editar} />
            <Stack.Screen name="Sobre" component={Sobre} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Cadastro" component={Cadastro} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
