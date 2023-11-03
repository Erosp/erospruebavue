<script>
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import CategoryList from './CategoryList.vue';
import SearchBar from './SearchBar.vue';
import ConfirmDialog from 'primevue/confirmdialog';
import Button from 'primevue/button';
import { useConfirm } from "primevue/useconfirm";
import InputText from 'primevue/inputtext';
import ShoppingCart from './ShoppingCart.vue';
import NavbarMenu from './NavbarMenu.vue';

export default{

  components: {
    DataTable,
    Column,
    CategoryList,
    SearchBar,
    ConfirmDialog,
    Button,
    InputText,
    ShoppingCart,
    NavbarMenu
  },

  data() {
    return {
      productos: [],
      productosAux: [],
      productoAgregar: null
    }
  },

  methods: {
    obtenerProductos(){
      axios.get('https://fakestoreapi.com/products')
        .then(resp =>{
          this.productos=resp.data;
          this.productosAux=resp.data;
        });
    },
    obtenerProductosCategoria(categoria){
      axios.get('https://fakestoreapi.com/products/category/' + categoria)
        .then(resp =>{
          this.productos=resp.data;
        });
    },
    filtrarCategoria(categoria){
      if(categoria=="todos"){
        this.obtenerProductos();
      }
      else{
        this.obtenerProductosCategoria(categoria);
      }
    },
    filtrarTexto(filtro){
      if(filtro===""){
        this.productos=[];
        for(let i=0; i<this.productosAux.length; i++){
          this.productos.push(this.productosAux[i]);
        }
      }
      else{
        let expresion = new RegExp(`${filtro}.*`, "i");
        this.productos = this.productosAux.filter(pro => expresion.test(pro.title));
      }
    },
    async addTemplate(datos){

      datos.cantidad=1;
      datos.total=datos.price;
      this.productoAgregar=datos;
      
      this.$confirm.require({
        group: 'agregar',
        header: 'Agregar Producto',
        acceptIcon: 'pi pi-check',
        rejectIcon: 'pi pi-times',
        rejectClass: 'p-button-danger p-button-sm',
        acceptClass: 'p-button-outlined p-button-sm',
        acceptLabel: 'Agregar',
        rejectLabel: 'Cancelar',
        datos: datos,
        accept: () => {
          this.$store.commit('agregar', this.productoAgregar);
        },
        reject: () => {
          console.log("rechazar");
        }
      });
    },
    calcularAgregado(opcion){
      if(opcion=="aumentar"){
        this.productoAgregar.cantidad++;
      }
      else if(opcion=="disminuir" && this.productoAgregar.cantidad>1){
        this.productoAgregar.cantidad--;
      }
      this.productoAgregar.total=this.productoAgregar.cantidad*this.productoAgregar.price;
    }
  },

  mounted() {
    this.obtenerProductos();
  }
}

</script>

<template>
  <NavbarMenu />
  <div class="container">
    <div class="row mt-5">
      <div class="col-12 col-sm-6 text-center text-sm-start">
        <h1>Productos</h1>
      </div>
      <div class="col-12 col-sm-6 text-center text-sm-end">
        <SearchBar @obtener="filtrarTexto" />
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <CategoryList @seleccionar="filtrarCategoria" />
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-12">
        <DataTable :value="productos" stripedRows tableStyle="">
          <Column header="Nro">
            <template #body="slotProps">
              <div class="w-100 text-end">{{ slotProps.data.id }}</div>
            </template>
          </Column>
          <Column field="title" header="Nombre"></Column>
          <Column header="Imagen">
            <template #body="slotProps">
              <img :src="slotProps.data.image" class="w-25 shadow-sm rounded" />
            </template>
          </Column>
          <Column field="category" header="Categoría"></Column>
          <Column header="Precio">
            <template #body="slotProps">
              <div class="w-100 text-end">${{ slotProps.data.price }}</div>
            </template>
          </Column>
          <Column header="">
            <template #body="slotProps">
              <Button @click="addTemplate(slotProps.data)" icon="pi pi-plus" ></Button>
            </template>
          </Column>
        </DataTable>
        <ConfirmDialog group="agregar">
          <template #message="slotProps">
            <div class="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
              <div class="container">
                <div class="row d-flex justify-content-between">
                  <div class="col-6">
                    <label>Nombre</label>
                    <InputText class="w-100" disabled v-model="slotProps.message.datos.title" />
                  </div>
                  <div class="col-6">
                    <label>Precio</label>
                    <InputText class="w-100 text-end" disabled v-model="productoAgregar.price" />
                  </div>
                </div>
                <div class="row d-flex justify-content-between mt-3">
                  <div class="col-6">
                    <label>Cantidad</label>
                    <div class="d-flex">
                      <Button @click="calcularAgregado('disminuir')" icon="pi pi-minus" ></Button>
                      <InputText class="w-100 text-end mx-3" disabled v-model="productoAgregar.cantidad" />
                      <Button @click="calcularAgregado('aumentar')" icon="pi pi-plus" ></Button>
                    </div>
                  </div>
                  <div class="col-6">
                    <label>Total</label>
                    <InputText class="w-100 text-end" disabled v-model="productoAgregar.total" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </ConfirmDialog>
      </div>
    </div>
  </div>
  <ShoppingCart />
</template>

<style scoped>

</style>
