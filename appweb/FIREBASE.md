# Configuração do Firebase

O aplicativo usa Firebase Authentication (e-mail e senha) para login e cadastro,
e Firestore para salvar o perfil em `users/{uid}`.

1. No Firebase Console do projeto configurado em `firebase/config.js`, ative o
   provedor **E-mail/senha** em Authentication.
2. Crie um banco de dados Firestore.
3. Na pasta `appweb`, aplique as regras de `firestore.rules` com:

   ```sh
   npx firebase-tools deploy --only firestore:rules --project auladdm-c05fb
   ```

4. Execute o aplicativo com `npm run web`, `npm run android` ou `npm run ios`.

As regras permitem que cada usuário leia e altere somente o próprio perfil. Não
publique o Firestore com regras abertas.
