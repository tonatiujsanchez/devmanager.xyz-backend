import nodemailer from 'nodemailer'

export const sendEmailRegister = async( data: { email:string, name:string, token:string }) => {
    
    
    const transport = nodemailer.createTransport({
        service: process.env.MAILER_SERVICE,
        auth: {
            user: process.env.MAILER_EMAIL,
            pass: process.env.MAILER_SECRET_KEY
        }
    })

    // Info Email
    const info = await transport.sendMail({
        from: 'DevManager <hola@devmanager.xyz>',
        to: data.email,
        subject: 'Confirma tu cuenta de DevManager',
        text: 'Estas a un paso de administras tus proyectos en DevManager',
        html:`
        <body style="font-family: Arial, sans-serif; background-color: #f1f1f1; margin-top: 20px; padding: 10px;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <tr>
                    <td style="padding: 30px; text-align: center;">
                        <a href="${ process.env.FRONTEND_URL }">
                            <img 
                                src="https://res.cloudinary.com/ton/image/upload/v1707690020/devmanager.xyz/e1mewbesr2fmd5wfqzwt.png" 
                                alt="DevManager Logo" style="max-width: 190px;"
                            >
                        </a>
                        <h3 style="color: #0F172A; margin-top: 20px; text-transform: uppercase; font-weight: bold;">¡Bienvenido a DevManager!</h3>
                        <p style="color: #333; font-size: 16px; margin-top: 20px; line-height: 1.6;">
                            Hola, ${ data.name }! Gracias por registrarte en DevManager. Para comenzar a utilizar nuestra plataforma,
                            necesitamos confirmar tu cuenta. Haz clic en el botón de abajo para activarla:
                        </p>
                        <a href="${ process.env.FRONTEND_URL }/auth/confirmar-cuenta/${ data.token }" style="display: inline-block; background-color: #0F172A; color: #ffffff; text-decoration: none; font-size: 16px; padding: 12px 24px; border-radius: 5px; margin-top: 30px;">
                            Confirmar Cuenta
                        </a>
                        <p style="color: #666; font-size: 14px; margin-top: 30px;">Si tienes algún problema con el botón, copia y pega el siguiente enlace en tu navegador:</p>
                        <p style="color: #007BFF; font-size: 14px; word-wrap: break-word;">
                            ${ process.env.FRONTEND_URL }/auth/confirmar-cuenta/${ data.token }
                        </p>
                        <p style="color: #333; font-size: 16px; margin-top: 30px;">Si tu no creaste esta cuenta, puedes simplemente ignorar este mensaje.</p>
                        <p style="color: #333; font-size: 16px; margin-top: 30px;">¡Esperamos que disfrutes de la experiencia con DevManager!</p>
                        <p style="color: #333; font-size: 16px;">El equipo de DevManager</p>
                    </td>
                </tr>
            </table>
        </body>`
    })
}


export const sendEmailForgotPassword = async( data: { email:string, name:string, token:string }) => {
    
    
    const transport = nodemailer.createTransport({
        service: process.env.MAILER_SERVICE,
        auth: {
            user: process.env.MAILER_EMAIL,
            pass: process.env.MAILER_SECRET_KEY
        }
    })

    // Info Email
    const info = await transport.sendMail({
        from: 'DevManager <hola@devmanager.xyz>',
        to: data.email,
        subject: 'Restablece tu Contraseña de DevManager',
        text: 'Estas a un paso de restablece tu contraseña de DevManager',
        html:`<body style="font-family: Arial, sans-serif; background-color: #f1f1f1; margin-top: 20px; padding: 10px;">
            <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <tr>
                    <td style="padding: 30px; text-align: center;">
                        <a href="${ process.env.FRONTEND_URL }">
                            <img 
                                src="https://res.cloudinary.com/ton/image/upload/v1707690020/devmanager.xyz/e1mewbesr2fmd5wfqzwt.png" 
                                alt="DevManager Logo" style="max-width: 190px;"
                            >
                        </a>

                        <h3 style="color: #0F172A; margin-top: 20px; text-transform: uppercase; font-weight: bold;">Restablece tu Contraseña</h3>
                        <p style="color: #333; font-size: 16px; margin-top: 20px; line-height: 1.6;">
                            Hola, ${ data.name }! ¿Olvidaste tu contraseña de DevManager? ¡No te preocupes! Haz clic en el botón de abajo para restablecer tu contraseña:
                        </p>
                        <a href="${ process.env.FRONTEND_URL }/auth/olvide-password/${ data.token }" style="display: inline-block; background-color: #0F172A; color: #ffffff; text-decoration: none; font-size: 16px; padding: 12px 24px; border-radius: 5px; margin-top: 30px;">
                            Restablecer Contraseña
                        </a>
                        <p style="color: #666; font-size: 14px; margin-top: 30px;">Si tienes algún problema con el botón, copia y pega el siguiente enlace en tu navegador:</p>
                        <p style="color: #007BFF; font-size: 14px; word-wrap: break-word;">
                            ${ process.env.FRONTEND_URL }/auth/olvide-password/${ data.token }
                        </p>
                        <p style="color: #333; font-size: 16px; margin-top: 30px;">Si tú no solicitaste restablecer tu contraseña, puedes simplemente ignorar este mensaje.</p>
                        <p style="color: #333; font-size: 16px;">El equipo de DevManager</p>
                    </td>
                </tr>
            </table>
        </body>`
    })
}

