export function verificarLogin(usuario, senha) {
  return usuario.trim() === 'admin' && senha === 'admin';
}
