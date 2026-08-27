const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM =
  process.env.EMAIL_FROM || 'TopoPro FC <onboarding@resend.dev>';


// ==================================
// CORREO DE VERIFICACIÓN
// ==================================

async function enviarCorreoVerificacion(
  destinatario,
  token,
  nombre = ''
) {

  const enlace =
    `${process.env.API_URL}/api/auth/verificar-email?token=${token}`;

  const { data, error } = await resend.emails.send({

    from: EMAIL_FROM,

    to: [destinatario],

    subject: 'Verifica tu cuenta en TopoPro FC',

    html: `

      <div style="
        font-family: Arial, sans-serif;
        line-height: 1.6;
      ">

        <h2>
          Bienvenido a TopoPro FC ${nombre}
        </h2>

        <p>
          Gracias por registrarte en nuestra plataforma.
        </p>

        <p>
          Para activar tu cuenta verifica tu correo electrónico:
        </p>

        <a
          href="${enlace}"
          style="
            background:#2563eb;
            color:white;
            padding:12px 20px;
            text-decoration:none;
            border-radius:6px;
            display:inline-block;
          "
        >
          Verificar correo
        </a>

        <p style="
          color:#666;
          font-size:13px;
          margin-top:16px;
        ">
          Este enlace expira en 24 horas.
        </p>

        <p>
          Si el botón no funciona copia este enlace:
        </p>

        <p>
          ${enlace}
        </p>

        <hr>

        <small>
          Equipo TopoPro FC
        </small>

      </div>

    `
  });

  if (error) {
    console.error(
      'ERROR RESEND VERIFICACIÓN:',
      error
    );

    throw new Error(
      'No se pudo enviar el correo de verificación'
    );
  }

  console.log(
    '📧 Correo de verificación enviado:',
    data.id
  );
}


// ==================================
// RECUPERACIÓN DE CONTRASEÑA
// ==================================

async function enviarCorreoRecuperacion(
  destinatario,
  token
) {

  const enlace =
    `${process.env.APP_URL}/restablecer-password?token=${token}`;

  const { data, error } = await resend.emails.send({

    from: EMAIL_FROM,

    to: [destinatario],

    subject: 'Recuperación de contraseña - TopoPro FC',

    html: `

      <div style="
        font-family: Arial, sans-serif;
        line-height:1.6;
      ">

        <h2>
          Recuperación de contraseña
        </h2>

        <p>
          Recibimos una solicitud para cambiar tu contraseña.
        </p>

        <p style="
          color:#666;
          font-size:13px;
          margin-top:8px;
        ">
          Este enlace expira en 30 minutos.
        </p>

        <p>
          Si realizaste esta solicitud puedes continuar:
        </p>

        <a
          href="${enlace}"
          style="
            background:#dc2626;
            color:white;
            padding:12px 20px;
            text-decoration:none;
            border-radius:6px;
            display:inline-block;
          "
        >
          Restablecer contraseña
        </a>

        <p>
          Si no solicitaste este cambio puedes ignorar este correo.
        </p>

        <p>
          ${enlace}
        </p>

        <hr>

        <small>
          Equipo TopoPro FC
        </small>

      </div>

    `
  });

  if (error) {
    console.error(
      'ERROR RESEND RECUPERACIÓN:',
      error
    );

    throw new Error(
      'No se pudo enviar el correo de recuperación'
    );
  }

  console.log(
    '📧 Correo de recuperación enviado:',
    data.id
  );
}


module.exports = {

  enviarCorreoVerificacion,

  enviarCorreoRecuperacion

};