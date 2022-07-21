// Importar productos de json 
const productosJson = './js/productos.json'
const importarProductos = async () => {
     const respuesta = await fetch(productosJson)
     const productos = await respuesta.json()
     //     funcion para cargar productos en el DOM 
     function renderizarProductos() {
          const cargarProductos = document.querySelector('#cargarProductos');
          productos.forEach((info) => {
               const divProductos = document.createElement('div');
               divProductos.classList.add("col-12", "col-lg-3", "col-md-4");
               const divProductosCardBody = document.createElement('div');
               divProductosCardBody.classList.add('card');
               const tagProductosImagen = document.createElement('img');
               tagProductosImagen.classList.add("imagen-curso", "u-full-width");
               tagProductosImagen.setAttribute('src', info.imagen);
               const divProductosInfoCard = document.createElement('div');
               divProductosInfoCard.classList.add('info-card');
               const tagProductosTitle = document.createElement('h4');
               tagProductosTitle.textContent = info.titulo;
               const tagProductosDescripcion = document.createElement('p');
               tagProductosDescripcion.textContent = info.descripcion;
               const tagProductosPrecio = document.createElement('p');
               tagProductosPrecio.classList.add('precio');
               tagProductosPrecio.textContent = `$ ${info.precio}`;
               const tagProductosOferta = document.createElement('span');
               tagProductosOferta.classList.add('u-pull-right', "precioCarrito");
               tagProductosOferta.textContent = `$ ${info.oferta}`;
               const tagProductosBotton = document.createElement('a');
               tagProductosBotton.classList.add("u-full-width", "button-primary", "button", "input", "agregar-carrito");
               tagProductosBotton.setAttribute("data-id", info.id)
               tagProductosBotton.textContent = `Agregar al carrito`;

               divProductosCardBody.appendChild(tagProductosImagen);
               divProductosCardBody.appendChild(divProductosInfoCard);
               divProductosInfoCard.appendChild(tagProductosTitle);
               divProductosInfoCard.appendChild(tagProductosDescripcion);
               divProductosInfoCard.appendChild(tagProductosPrecio);
               tagProductosPrecio.appendChild(tagProductosOferta);
               divProductosInfoCard.appendChild(tagProductosBotton);
               divProductos.appendChild(divProductosCardBody);
               cargarProductos.appendChild(divProductos);
          })
     }
     // carga los productos en el DOM
     renderizarProductos()
}
// Importa los prductos 
importarProductos()
// Variables
const carrito = document.querySelector('#carrito');
const listaZapas = document.querySelector('#lista-ropa');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const finalizarCompraBtn = document.querySelector('#finalizarCompra');
const vaciarCarritoBtn = document.querySelector('#vaciarCarrito');
let articulosCarrito = [];

// Listeners
cargarEventListeners();

function cargarEventListeners() {
     // Dispara cuando se presiona "Agregar Carrito"
     listaZapas.addEventListener('click', agregarZapas);

     // Cuando se elimina un ropa del carrito
     carrito.addEventListener('click', eliminarZapas);

     // Al Vaciar el carrito
     finalizarCompraBtn.addEventListener('click', finalizarCompra);
     vaciarCarritoBtn.addEventListener('click', vaciarCarritoLocal);


     // NUEVO: Contenido cargado
     document.addEventListener('DOMContentLoaded', () => {
          articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
          // console.log(articulosCarrito);
          carritoHTML();
     });
}


// Función que añade el ropa al carrito
function agregarZapas(e) {
     e.preventDefault();
     // Delegation para agregar-carrito
     if (e.target.classList.contains('agregar-carrito')) {
          const ropa = e.target.parentElement.parentElement;
          // Enviamos el ropa seleccionado para tomar sus datos
          leerDatosZapas(ropa);
     }
}

// Lee los datos del ropa
function leerDatosZapas(ropa) {
     const infoZapas = {
          imagen: ropa.querySelector('img').src,
          titulo: ropa.querySelector('h4').textContent,
          precio: ropa.querySelector('.precio span').textContent,
          id: ropa.querySelector('a').getAttribute('data-id'),
          cantidad: 1
     }


     if (articulosCarrito.some(ropa => ropa.id === infoZapas.id)) {
          const zapas = articulosCarrito.map(ropa => {
               if (ropa.id === infoZapas.id) {
                    let cantidad = parseInt(ropa.cantidad);
                    cantidad++
                    ropa.cantidad = cantidad;
                    return ropa;
               } else {
                    return ropa;
               }
          })
          articulosCarrito = [...zapas];
     } else {
          articulosCarrito = [...articulosCarrito, infoZapas];
     }
     // console.log(articulosCarrito)
     carritoHTML();
}

// Elimina el ropa del carrito en el DOM
function eliminarZapas(e) {
     e.preventDefault();
     if (e.target.classList.contains('borrar-ropa')) {
          // e.target.parentElement.parentElement.remove();
          const ropa = e.target.parentElement.parentElement;
          const zapasId = ropa.querySelector('a').getAttribute('data-id');

          // Eliminar del arreglo del carrito
          articulosCarrito = articulosCarrito.filter(ropa => ropa.id !== zapasId);

          carritoHTML();
     }
}


// Muestra la ropa seleccionada en el Carrito
function carritoHTML() {

     vaciarCarrito()

     articulosCarrito.forEach(ropa => {
          const row = document.createElement('tr');
          row.innerHTML = `
               <td>  
                    <img src="${ropa.imagen}" width=100>
               </td>
               <td>${ropa.titulo}</td>
               <td>${ropa.precio}</td>
               <td>${ropa.cantidad} </td>
          `;
          contenedorCarrito.appendChild(row);
     });

     sincronizarStorage();

}

function sincronizarStorage() {
     localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

articulosCarrito.forEach(ropa => {
     const row = document.createElement('tr');
     row.innerHTML = `
          <td>  
               <img src="${ropa.imagen}" width=100>
          </td>
          <td>${ropa.titulo}</td>
          <td>${ropa.precio}</td>
          <td>${ropa.cantidad} </td>
          <td>
               <a href="#" class="borrar-ropa" data-id="${ropa.id}">X</a>
          </td>
     `;
     contenedorCarrito.appendChild(row);
});

// Elimina los elementos del carrito en el DOM
function finalizarCompra() {
     sincronizarStorage()

     let html = contenedorCarrito
     
     console.log(contenedorCarrito)
     Swal.fire({
          icon: 'success',
          title: "Compra realizada con exito",
          html:`<div id="carrito">
          <table id="lista-carrito" class="u-full-width">
            <thead>
              <tr>
                <th class="text-start ms-5">Imagen</th>
                <th class="text-start ms-3">Nombre</th>
                <th class="text-start ms-3">Precio</th>
                <th class="text-start ms-3">Cantidad</th>
                <th>${html.innerHTML}</th>
                </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>`,
          width: 600,
     }).then((result) => {
           
               vaciarCarritoLocal();
          
     })
}
function vaciarCarrito() {
     while (contenedorCarrito.firstChild) {
          contenedorCarrito.removeChild(contenedorCarrito.firstChild);
     }
}
function vaciarCarritoLocal() {
     localStorage.clear()
     vaciarCarrito()
}