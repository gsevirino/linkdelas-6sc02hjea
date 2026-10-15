// Provider approval & verification badge management
onRecordCreate((e) => {
  const role = e.record.getString('role')
  if (role === 'prestadora') {
    if (!e.record.getString('status')) {
      e.record.set('status', 'pending')
    }
    const status = e.record.getString('status')
    const plan = e.record.getString('plan')
    const isPaid = plan === 'profissional' || plan === 'destaque'
    e.record.set('verified', status === 'approved' && isPaid)
  }
  e.next()
}, 'users')

onRecordUpdate((e) => {
  const role = e.record.getString('role')
  if (role === 'prestadora') {
    const status = e.record.getString('status')
    const plan = e.record.getString('plan')
    const isPaid = plan === 'profissional' || plan === 'destaque'
    e.record.set('verified', status === 'approved' && isPaid)

    const originalStatus = e.record.original().getString('status')
    if (originalStatus !== 'rejected' && status === 'rejected') {
      try {
        const email = e.record.getEmail()
        const name = e.record.getString('name') || 'Prestadora'
        const message = new MailerMessage({
          from: {
            address: $app.settings().meta.senderAddress || 'contato@linkdelas.com.br',
            name: $app.settings().meta.senderName || 'LinkDelas',
          },
          to: [{ address: email, name: name }],
          subject: 'Atualização sobre seu cadastro na LinkDelas',
          html:
            '<p>Olá ' +
            name +
            ',</p><p>Agradecemos seu interesse em fazer parte da LinkDelas. No momento, após a análise documental, seu perfil não pôde ser aprovado para divulgação no catálogo aberto. Se tiver dúvidas ou desejar reenviar seus dados para nova avaliação, responda a este e-mail.</p><p>Com carinho,<br>Equipe LinkDelas</p>',
        })
        $app.newMailClient().send(message)
      } catch (err) {
        console.log('Falha ao enviar email de rejeicao:', err)
      }
    }
  }
  e.next()
}, 'users')
