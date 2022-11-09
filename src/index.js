'use strict'

// Aquí importaremos la clase del controlador e instanciaremos uno
const Controller = require('./controller/controller.class')

const myController = new Controller()
window.addEventListener('load', () => {
  myController.init()
})

// A continuación crearemos una función manejadora para cada formulario

// función manejadora del formulario 'del-prodcut'

  /*document.getElementById('del-prod').addEventListener('submit', (event) => {
    event.preventDefault()

    const id = document.getElementById('delprod-id').value;

    myController.delProductFromStore(id)
  })

  // función manejadora del fromulario 'del-category'
  document.getElementById("del-category").addEventListener('submit', (event) => {
    event.preventDefault()

    const id = document.getElementById('delcategory-id').value;

    myController.delCategoryFromStore(id);

  })
  */

