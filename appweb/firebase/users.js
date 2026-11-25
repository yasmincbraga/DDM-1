import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { auth, db } from './firebase';

let registrationInProgress = false;
let deferredAuthChange = false;
let authStateListener;

function userDocument(uid) {
  return doc(db, 'users', uid);
}

export function observeAuthState(listener) {
  authStateListener = listener;

  return onAuthStateChanged(auth, (user) => {
    if (registrationInProgress) {
      deferredAuthChange = true;
      return;
    }

    listener(user);
  });
}

export async function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function registerUser(name, email, password) {
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  registrationInProgress = true;

  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      normalizedEmail,
      password,
    );

    await updateProfile(user, { displayName: normalizedName });
    await setDoc(userDocument(user.uid), {
      name: normalizedName,
      email: normalizedEmail,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return user;
  } catch (error) {
    if (auth.currentUser) {
      await signOut(auth);
    }

    throw error;
  } finally {
    registrationInProgress = false;

    if (deferredAuthChange) {
      deferredAuthChange = false;
      authStateListener?.(auth.currentUser);
    }
  }
}

export async function getUserProfile(user) {
  const snapshot = await getDoc(userDocument(user.uid));

  if (snapshot.exists()) {
    return { uid: user.uid, ...snapshot.data() };
  }

  return {
    uid: user.uid,
    name: user.displayName || '',
    email: user.email || '',
  };
}

export async function updateUserProfile({
  user,
  name,
  email,
  currentPassword,
  newPassword,
}) {
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const emailChanged = normalizedEmail !== user.email;
  const passwordChanged = Boolean(newPassword);

  if (emailChanged || passwordChanged) {
    if (!currentPassword) {
      throw new Error('Informe sua senha atual para alterar o e-mail ou a senha.');
    }

    if (!user.email) {
      throw new Error('Não foi possível confirmar a senha desta conta.');
    }

    await reauthenticateWithCredential(
      user,
      EmailAuthProvider.credential(user.email, currentPassword),
    );
  }

  if (emailChanged) {
    await updateEmail(user, normalizedEmail);
  }

  if (passwordChanged) {
    await updatePassword(user, newPassword);
  }

  await updateProfile(user, { displayName: normalizedName });
  await setDoc(
    userDocument(user.uid),
    {
      name: normalizedName,
      email: normalizedEmail,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return { uid: user.uid, name: normalizedName, email: normalizedEmail };
}

export async function signOutUser() {
  return signOut(auth);
}

export function getFirebaseErrorMessage(error) {
  if (error?.message && !error?.code) {
    return error.message;
  }

  switch (error?.code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'E-mail ou senha inválidos.';
    case 'auth/invalid-email':
      return 'Informe um endereço de e-mail válido.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado.';
    case 'auth/weak-password':
      return 'A senha precisa ter pelo menos 6 caracteres.';
    case 'auth/requires-recent-login':
      return 'Entre novamente antes de alterar dados de segurança.';
    case 'auth/network-request-failed':
      return 'Não foi possível conectar. Verifique sua internet e tente novamente.';
    case 'permission-denied':
    case 'firestore/permission-denied':
      return 'Acesso ao perfil negado. Verifique as regras do Firestore.';
    default:
      return 'Não foi possível concluir a operação. Tente novamente.';
  }
}
