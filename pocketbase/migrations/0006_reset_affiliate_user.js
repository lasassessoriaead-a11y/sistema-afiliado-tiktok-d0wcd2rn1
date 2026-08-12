migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    // 1. Delete the existing user (senha incorreta / inacessível)
    try {
      const existing = app.findAuthRecordByEmail('_pb_users_auth_', 'luka2510@hotmail.com')
      app.delete(existing)
    } catch (_) {
      // já não existe — segue para a criação
    }

    // 2. Cria um NOVO usuário com a senha correta
    const record = new Record(users)
    record.setEmail('luka2510@hotmail.com')
    record.setPassword('Luka@2510')
    record.setVerified(true)
    record.set('name', 'Afiliado TikTok')
    record.set('emailVisibility', true)
    app.save(record)
  },
  (app) => {
    // down: remove o usuário recriado
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'luka2510@hotmail.com')
      app.delete(record)
    } catch (_) {}
  },
)
