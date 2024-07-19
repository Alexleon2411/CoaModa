import { uid } from 'uid'
import { ref, computed } from 'vue'
import { useFirebaseStorage } from "vuefire"
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

export default function useImage() {
  const url = ref(null)
  const storage = useFirebaseStorage()

  const onFileChange = e => {
    // en este caso se esta utilizando un solo archvio y por esta razon se le coloca el [0] al final de la funcion..
    // si estariamos usando mas de un archivo se tendria que utilizar un forEch para poder irterar el array de files para poder obtener todos los archivos
    const file = e.target.files[0]
    // aqui se le da un nombre dinamico a cada imagen con uid y se le agrega la extension '.jpg'
    const filename = uid() + '.jpg'
    //storage ref toma dos parametros, 1ero identificador del storage y el 2do se debe colocar la url donde se van almacenar las imagenes
    const sRef = storageRef(storage, '/products/' + filename) // este sRef identifica quien esta tratando de subir una imagen y guarda la direccion de ese archivo para poder utilizarlo

    //subir el archivo
    const uploadTask = uploadBytesResumable(sRef, file)
    //el siguiente es un evento que es el estado de cuando la imagen ya se empieza a subir
    uploadTask.on('state_changed',
      // dentro de este metodo tenemos tres callback
      () => {},
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then( (downloadURL) => {
            url.value = downloadURL
          })
      }
    )
  }
  // el siguiente es el state que nos va a retornar la imagen si tiene algun valor la url sino nos regeresa null
  const isImageUploaded = computed(() => {
    return url.value ? url.value : null
  })
 // -este return devuelve la url de la imagen en caso de que se suba a firebase correctamente y tambien tendra un computed property para mostrar la imagen
  return {
    url,
    onFileChange,
    isImageUploaded
  }
}
