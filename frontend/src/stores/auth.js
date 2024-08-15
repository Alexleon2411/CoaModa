import { defineStore } from "pinia";
import { useFirebaseAuth } from 'vuefire';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore('auth', () => {
  // esto se usa en lugar  de usar getAuth como se recomiendo en la documentacion de firebase
  const auth = useFirebaseAuth()
  const authUser = ref(null)
  const router = useRouter()

  const errorMsg =  ref('')
  const errorCode = {
    'auth/invalid-credential': 'Usuario no encontrado o la contraseña es invalida',
  }

  // la siguiente funcion es para recuperar la informacion del usuario cuando ya se ha logueado en la pagina
  onMounted(() =>  {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        authUser.value = user
      }
    })
  })

  // la siguiente funcion es para loguear al usuario en la pagina
  const login = ({email, password}) => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user
      authUser.value = user
      router.push({name: 'products'})
    })
    .catch(error => {
      errorMsg.value = errorCode[error.code]
    })
  }

  //la siguiente funcion es para cerra la sesion del usuario
  const logout = () =>  {
    signOut(auth).then(() => {
      authUser.value = null
      router.push({name: 'login'})
    }).catch(error => {
        console.log(error)
    })
  }

  // el siguiente computed es para mostrar de forma dinamica los mensajes de error de la pagina
  const hasError = computed(() => {
    return errorMsg.value
  })

  //para identificar el usuario que ya ha estado autenticado
  const isAuth = computed(() => {
    return authUser.value
  })


  return {
    login,
    logout,
    hasError,
    isAuth
  }
})
