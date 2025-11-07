// Script temporário para gerar hash de senha
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

// Gerar hash para "Admin@123"
const senha = 'Admin@123';
hashPassword(senha).then(hash => {
  console.log('Senha:', senha);
  console.log('Hash:', hash);
  console.log('\nSQL para atualizar:');
  console.log(`UPDATE users SET senha = '${hash}' WHERE email = 'admin@planacdivisorias.com.br';`);
});
