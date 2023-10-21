import nodemailer from "nodemailer"

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos

  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  })

  //información del mail
  const info = await transport.sendMail({
      from: '"TaskPlanner - Administra tus Proyectos" <cuentas@taskplanner.com>',
      to: email,
      subject: "TaskPlanner - Confirma tu Cuenta",
      text: "Confirma tu Cuenta en TaskPlanner",
      html: ` <p>Hola: ${nombre},</p>
      <p>Comprueba tu cuenta en TaskPlanner</p>
      <p>Tu cuenta ya esta casi lista, solo debes de comprobarla en el siguiente enlace:</p>
      <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
      <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
      `,
  })
}

export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos
  
  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  })

  //información del mail
  const info = await transport.sendMail({
    from: '"TaskPlanner - Administra tus Proyectos" <cuentas@taskplanner.com>',
    to: email,
    subject: "TaskPlanner - Restablecimiento tu Password",
    text: "Restablecimiento tu Password en TaskPlanner",
    html: ` <p>Estimado: ${nombre},</p> 
    <p>Has solicitado restablecer tu password,</p>
    <p>por favor, sigue en el siguiente enlace:</p>
    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer tu Password</a>
    <p>Una vez que accedas al enlace, podrás establecer un nuevo password</p>
    <p>siguiendo las instrucciones proporcionadas en la página.</p>
    <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
    `,
})
}