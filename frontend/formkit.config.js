import { generateClasses } from '@formkit/themes'
const config = {
  //este segundo config se reefiere  a la configuracion del formkit el primer config es solo la variable

  config: {
    classes: generateClasses({
      // global es para aquellas clases que se le dan a mas de un tag, y para no estar añadiendo las misma clases a todos los tags iguales  entonces se usa global
      global: {
        label: "block mb-1 font-bold text-lg",
         message: "text-red-500 mb-5",
         wrapper: "space-y-2 mb-3",
         input: "w-full p-3 border border-gray-300 rounded text-gray-700 placeholder-gray-400"
      },
      // para eliminarle una configuracion global a un campo en especifico se utiliza "$reset" que resetea la configuacion global ejemplo = message: '$reset',
      file: {
        noFiles: 'block my-2',
        fileItem: 'hidden',
      },
      submit: {
        input: '$reset bg-green-400 hover:bg-green-500 w-full p-2 font-bold uppercase disabled:opacity-50'
      }
    })
  }
}
export default config
