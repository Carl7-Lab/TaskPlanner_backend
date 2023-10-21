import express from "express"
const router = express.Router()

import { 
    registrar, 
    autenticar, 
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil,
} from "../controllers/usuarioControllers.js"
import checkAuth from "../middleware/checkAuth.js"

// Autenticación, Registro y Confirmación de Usuarios
router.post('/', registrar) //Crea un nuevo usuario 
router.post('/login',autenticar) 
// '/confirmar/:token' ":" routing dinámico
router.get('/confirmar/:token', confirmar)
router.post('/olvide-password', olvidePassword)

router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)

router.get("/perfil", checkAuth, perfil)

export default router