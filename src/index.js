'use strict'

// Aquí importaremos la clase del controlador e instanciaremos uno
const Controller = require('./controller/controller.class')

const myController = new Controller()
myController.init()

// A continuación crearemos una función manejadora para cada formulario
window.addEventListener('load', () => {

  // función manejadora del formulario 'new-prod'
  document.getElementById('new-prod').addEventListener('submit', (event) => {
    event.preventDefault()

    // Aquí el código para obtener los datos del formulario
    const id = document.getElementById('newprod-id').value
    const name = document.getElementById('newprod-name').value
    const category = document.getElementById('newprod-category').value
    const units = document.getElementById('newprod-units').value
    const price = document.getElementById('newprod-price').value
    // ...
    
    // Aquí llamamos a la función del controlador que añade productos (addProductToStore)
    // pasándole como parámetro esos datos
    if (!id) {
      myController.addProductToStore({id, name, category, units, price});   
    } else {
      myController.editProduct({id, name, category, units, price})
    }
    // Sintaxis de ES2015 que equivale a 
    //
    // myController.addProductToStore(
    //   { 
    //     name: name,
    //     price: price 
    //   }
    // ) 
  })

    // función manejadora del formulario 'add-category'
  document.getElementById('add-category').addEventListener('submit', (event) => {
    event.preventDefault()

    // Aquí el código para obtener los datos del formulario
    const id = document.getElementById('newcategory-id').value
    const name = document.getElementById('newcategory-name').value
    const description = document.getElementById('newcategory-description').value 
    // ...
    
    // Aquí llamamos a la función del controlador que añade productos (addProductToStore)
    // pasándole como parámetro esos datos
    myController.addCategoryToStore({ id, name, description })   
    // Sintaxis de ES2015 que equivale a 
    //
    // myController.addProductToStore(
    //   { 
    //     name: name,
    //     price: price 
    //   }
    // ) 
  })

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

})
