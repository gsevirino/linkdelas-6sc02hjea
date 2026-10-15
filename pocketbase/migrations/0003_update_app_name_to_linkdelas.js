migrate(
  (app) => {
    const settings = app.settings()
    settings.meta.appName = 'LinkDelas'
    settings.meta.senderName = 'LinkDelas'

    // Update system email templates if present
    if (settings.meta.verificationTemplate) {
      settings.meta.verificationTemplate.subject = 'Verifique seu e-mail no LinkDelas'
      settings.meta.verificationTemplate.body =
        '<p>Olá,</p><p>Obrigada por se juntar ao LinkDelas!</p><p>Clique no link abaixo para verificar seu endereço de e-mail:</p><p><a href="{APP_URL}/verificar-email?token={TOKEN}">Verificar e-mail</a></p><p>Com carinho,<br>Equipe LinkDelas</p>'
    }

    if (settings.meta.resetPasswordTemplate) {
      settings.meta.resetPasswordTemplate.subject = 'Redefinição de senha - LinkDelas'
      settings.meta.resetPasswordTemplate.body =
        '<p>Olá,</p><p>Recebemos uma solicitação para redefinir a senha da sua conta no LinkDelas.</p><p>Clique no link abaixo para cadastrar uma nova senha:</p><p><a href="{APP_URL}/redefinir-senha?token={TOKEN}">Redefinir senha</a></p><p>Se você não fez essa solicitação, pode ignorar este e-mail.</p><p>Com carinho,<br>Equipe LinkDelas</p>'
    }

    if (settings.meta.confirmEmailChangeTemplate) {
      settings.meta.confirmEmailChangeTemplate.subject =
        'Confirmação de alteração de e-mail - LinkDelas'
      settings.meta.confirmEmailChangeTemplate.body =
        '<p>Olá,</p><p>Recebemos um pedido para alterar seu e-mail de acesso no LinkDelas.</p><p>Clique no link abaixo para confirmar a alteração:</p><p><a href="{APP_URL}/confirmar-alteracao-email?token={TOKEN}">Confirmar novo e-mail</a></p><p>Com carinho,<br>Equipe LinkDelas</p>'
    }

    app.save(settings)
  },
  (app) => {
    // No revert necessary
  },
)
