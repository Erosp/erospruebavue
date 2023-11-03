import { createApp } from 'vue'
import { createStore } from 'vuex'
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'primeicons/primeicons.css'
import App from './App.vue'

const store = createStore({
    state () {
      return {
        carrito: []
      }
    },
    getters: {
        total (state) {
            let total = 0;
            for(let i=0; i<state.carrito.length; i++){
                total=total+state.carrito[i].total;
            }
            return total;
        }
    },
    mutations: {
      agregar(state, producto) {
        let agregar=true;
        let index=null;
        for(let i=0; i<state.carrito.length; i++){
            if(state.carrito[i].id==producto.id){
                agregar=false;
                index=i;
            }
        }
        if(agregar){
            state.carrito.push(producto);
        }
        else{
            state.carrito[index].cantidad=state.carrito[index].cantidad+producto.cantidad;
            state.carrito[index].total=state.carrito[index].cantidad*state.carrito[index].price;
        }
      },
      eliminar(state, producto){
        let eliminar=false;
        let index=null;
        for(let i=0; i<state.carrito.length; i++){
            if(state.carrito[i].id===producto.id){
                index=i;
                if(state.carrito[i].cantidad===producto.cantidad){
                    eliminar=true;
                }
            }
        }
        if(eliminar){
            state.carrito.splice(index, 1);
        }
        else{
            state.carrito[index].cantidad=state.carrito[index].cantidad-producto.cantidad;
            state.carrito[index].total=state.carrito[index].cantidad*state.carrito[index].price;
        }
      }
    }
});


const app = createApp(App);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(store);
app.mount('#app');