import Usuario from "../models/Usuario.js"
import generarId from "../helpers/generarId.js"
import generarJWT from "../helpers/generarJWT.js"
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js"

const registrar = async (req, res) => {
    // evitar registros duplicados
    const {email} = req.body
    const existeUsuario = await Usuario.findOne({email: email})

    if(existeUsuario) {
        const error = new Error('Usuario ya registrado')
        return res.status(400).json({ msg: error.message})
    }
    // creando usuario
    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId()
        await usuario.save()

        // enviar el email de confirmación
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({msg: "Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta"})
    } catch (error) {
        console.log(error)
    }
}

const autenticar = async (req, res) => {
    const {email, password} = req.body

    // comprobar si el usuario existe
    const usuario = await Usuario.findOne({email: email})
    if (!usuario) {
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }
    // comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error("El usuario no ha sido confirmado")
        return res.status(403).json({msg: error.message})
    }
    // comprobar su password
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id),
        })
    }else{
        const error = new Error("El password es incorrecto")
        return res.status(403).json({msg: error.message})
    }
    // res.json(usuario)
}

const confirmar = async (req, res) => {
    const { token } = req.params
    const usuarioConfirmar = await Usuario.findOne({token: token})
    if(!usuarioConfirmar){
        const error = new Error("Token no válido")
        return res.status(403).json({msg: error.message})
    }
    try {
        usuarioConfirmar.confirmado = true
        usuarioConfirmar.token = ""
        await usuarioConfirmar.save()
        res.json({msg: "Usuario Confirmado Correctamente"})
    } catch (error) {
        console.log(error)
    }
}

const olvidePassword = async (req, res) => {
    const { email } = req.body
    // comprobar si el usuario existe
    const usuario = await Usuario.findOne({email: email})
    if (!usuario) {
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }
    try {
        //creación de token para cambio de contraseña 
        usuario.token = generarId()
        await usuario.save()

        // enviar email de nuevo password
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({msg: 'Hemos enviado un email con las instrucciones'})
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params
    const tokenValido = await Usuario.findOne({token: token})
    
    if(tokenValido){
        res.json({msg: "Token Válido y el Usuario Existe"})
    }else{
        const error = new Error("Token no válido")
        return res.status(403).json({msg: error.message})
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    const usuario = await Usuario.findOne({token: token})
    
    if(usuario){
        usuario.token = ""
        usuario.password = password
        try {
            await usuario.save()
            res.json({msg: 'Password Modificado Correctamente'})
        } catch (error) {
            console.log(error)
        }
    }else{
        const error = new Error("Token no válido")
        return res.status(403).json({msg: error.message})
    }
}

const perfil = async (req, res) => {
    const { usuario } = req

    res.json(usuario)
}

export { registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil }
