//Definicion de variables
const url = 'http://localhost:3000/api/clientes/'
let resultados = ''
const contenedor = document.querySelector('tbody')

const modalCliente = new bootstrap.Modal(document.getElementById('modalCliente'))
const formCliente = document.querySelector('form')
const nombres = document.getElementById('nombres')
const apellidos = document.getElementById('apellidos')
const tipodoc = document.getElementById('tipodoc')
const documento = document.getElementById('documento')
const numero = document.getElementById('numero')
const clasificacion = document.getElementById('clasificacion')
let opcion = ''

btnCrear.addEventListener('click', ()=>{
    nombres.value = ''
    apellidos.value = ''
    tipodoc.value = ''
    documento.value = ''
    numero.value = ''
    clasificacion.value = ''
    modalCliente.show()
    opcion = 'crear'
})

//Procedimiento mostrar
const mostrar = (clientes) =>{
    clientes.forEach(cliente =>{
        resultados += `<tr>
                          <td> ${cliente.id} </td>
                          <td> ${cliente.nombres} </td>
                          <td> ${cliente.apellidos} </td>
                          <td> ${cliente.tipodoc} </td>
                          <td> ${cliente.documento} </td>
                          <td> ${cliente.numero} </td>
                          <td> ${cliente.clasificacion} </td>
                          <td class="text-center"><a class="btnEditar btn btn-primary"> Editar <a class="btnBorrar btn btn-danger"> Borrar </a> </td>
                       </tr>
                      `
    })
    contenedor.innerHTML = resultados
}

fetch(url)
    .then( response => response.json() )
    .then( data => mostrar(data) )
    .catch( error => console.log(error) )

const on = (element, event, selector, handler) =>{
    element.addEventListener(event, e =>{
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}

//procedimiento Borrar
on(document, 'click', '.btnBorrar', e =>{
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    alertify.confirm("This is a confirm dialog.",
    function(){
        fetch(url+id, {
            method: 'DELETE'
        })
        .then( res => res.json() )
        .then( ()=> location.reload() )
        // alertify.success('Ok')
    },
    function(){
        alertify.error('Cancel')
    })
})

//procedimiento Editar
let idForm = 0
on(document, 'click', '.btnEditar', e => {
    const fila = e.target.parentNode.parentNode
    idForm = fila.children[0].innerHTML
    const nombresForm = fila.children[1].innerHTML
    const apellidosForm = fila.children[2].innerHTML
    const tipodocForm = fila.children[3].innerHTML
    const documentoForm = fila.children[4].innerHTML
    const numeroForm = fila.children[5].innerHTML
    const clasificacionForm = fila.children[6].innerHTML

    nombres.value = nombresForm.trim()
    apellidos.value = apellidosForm.trim()
    tipodoc.value = tipodocForm.trim()
    documento.value = documentoForm.trim()
    numero.value = numeroForm.trim()
    clasificacion.value = clasificacionForm.trim()
    opcion = 'editar'
    modalCliente.show() 
})
//procedimiento para crear y editar
formCliente.addEventListener('submit', (e) =>{
    e.preventDefault()
    if(opcion=='crear'){
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                nombres:nombres.value,
                apellidos:apellidos.value,
                tipodoc:tipodoc.value,
                documento:documento.value,
                numero:numero.value,
                clasificacion:clasificacion.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoCliente = []
            nuevoCliente.push(data)
            mostrar(nuevoCliente)
        })
    }
    if(opcion=='editar'){
        fetch(url+idForm, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                nombres:nombres.value,
                apellidos:apellidos.value,
                tipodoc:tipodoc.value,
                documento:documento.value,
                numero:numero.value,
                clasificacion:clasificacion.value
            })
        })
        .then( response => response.json() )
        .then( response => location.reload() )
    }
    modalCliente.hide()
})
