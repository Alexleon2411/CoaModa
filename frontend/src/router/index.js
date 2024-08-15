import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'
import ShopView from '../view/ShopView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'shop',
      component: ShopView
    },
    {
      path: '/carrito',
      name: 'cart',
      component: () => import('../components/ShoppingCart.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../view/admin/loginView.vue')
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('../components/UserInfo.vue')
    },
    {
      path: '/admin',
       name: 'admin',
       component: () => import('../view/admin/AdminLayout.vue'),
       meta: { requiresAuth: true },
       children: [
        {
        path: 'productos',
        name: 'products',
        component: () => import('../view/admin/ProducsView.vue'),
        meta: { requiresAuth: true },
        },
        {
          path: 'productos/nuevo',
          name: 'new-product',
          component: () => import('../view/admin/NewProduct.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'productos/editar/:id',
          name: 'edit-product',
          component: () => import('../view/admin/EditProductView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'productos/seeder',
          name: 'seed-product',
          component: () => import('../view/admin/SeederView.vue')
        },
        {
          path: 'ventas/:tlf?',
          name: 'sales',
          component: () => import('../view/admin/SalesView.vue'),
          meta: { requiresAuth: true },
        }

       ]
    },
  ]
})

//guard de navegacion, simpre toma los tres parametros que son to, from, next

router.beforeEach(async(to, from, next) => {
  // para saber si es necesario la autenticacion
  const requiresAuth = to.matched.some(url => url.meta.requiresAuth)
  if (requiresAuth){
    //comprobar si el usuario esta autenticado
    try {
       await authenticateUser()
       next()
    } catch (error) {
        console.log(error)
        next({name: 'login'})
    }
  }else {
    // no esta protegido el endpoint por lo tanto mostramos la vista
    next()
  }
})

function authenticateUser() {
  // como estamos usando await y la funcion no es async  entonces debemos  usar promises para tomar los parametros que nos da el promise como ejemplo de una funcion async de esta manera se ejecutara uno de los dos paraetros que tenemos en el promise
  const auth = useFirebaseAuth()

  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      if (user){
        resolve()
      }else{
        reject()
      }
    })
  })
}
export default router
