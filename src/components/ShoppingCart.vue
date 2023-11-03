<script>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import InputText from 'primevue/inputtext';

export default{
  components: {
    Button,
    Dialog,
    DataTable,
    Column,
    ConfirmDialog,
    InputText
  },

  data() {
    return {
      busqueda: "",
      visible: false,
      productoEliminar: null,
      eliminarMaximo: 0
    }
  },

  computed: {
    carrito() {
      return this.$store.state.carrito;
    },
    total() {
      return this.$store.getters.total
    }
  },

  methods: {
    deleteTemplate(datos){
      this.productoEliminar={
        id: datos.id,
        title: datos.title,
        price: datos.price,
        image: datos.image,
        description: datos.description,
        category: datos.category,
        rating: datos.rating,
        cantidad: datos.cantidad,
        total: datos.total
      };
      this.eliminarMaximo=datos.cantidad;
      
      this.$confirm.require({
        group: 'eliminar',
        header: 'Eliminar Producto',
        acceptIcon: 'pi pi-check',
        rejectIcon: 'pi pi-times',
        rejectClass: 'p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        acceptLabel: 'Eliminar',
        rejectLabel: 'Cancelar',
        datos: datos,
        accept: () => {
          this.$store.commit('eliminar', this.productoEliminar);
        },
        reject: () => {
          console.log("rechazar");
        }
      });
    },
    calcularEliminado(opcion){
      if(opcion=="aumentar" && this.productoEliminar.cantidad<this.eliminarMaximo){
        this.productoEliminar.cantidad++;
      }
      else if(opcion=="disminuir" && this.productoEliminar.cantidad>1){
        this.productoEliminar.cantidad--;
      }
      this.productoEliminar.total=this.productoEliminar.cantidad*this.productoEliminar.price;
    }
  }
}

</script>

<template>
    <Button icon="pi pi-shopping-cart" @click="visible=true" class="position-fixed bottom-0 end-0 mb-5 me-5 rounded-circle" severity="success" rounded />
    <Dialog v-model:visible="visible" modal header="Carrito de Compras" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <DataTable :value="carrito" stripedRows tableStyle="">
          <Column header="Nro">
            <template #body="slotProps">
              <div class="w-100 text-end">{{ slotProps.data.id }}</div>
            </template>
          </Column>
          <Column field="title" header="Nombre"></Column>
          <Column header="Precio">
            <template #body="slotProps">
              <div class="w-100 text-end">${{ slotProps.data.price }}</div>
            </template>
          </Column>
          <Column header="Cantidad">
            <template #body="slotProps">
              <div class="w-100 text-end">{{ slotProps.data.cantidad }}</div>
            </template>
          </Column>
          <Column header="Total">
            <template #body="slotProps">
              <div class="w-100 text-end">${{ slotProps.data.total }}</div>
            </template>
          </Column>
          <Column header="">
            <template #body="slotProps">
              <Button @click="deleteTemplate(slotProps.data)" severity="danger" icon="pi pi-trash" ></Button>
            </template>
          </Column>
          <template #footer><div class="w-100 text-end pe-5"> Total: ${{ total }}</div></template>
      </DataTable>
    </Dialog>
    <ConfirmDialog group="eliminar">
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
                    <InputText class="w-100 text-end" disabled v-model="productoEliminar.price" />
                  </div>
                </div>
                <div class="row d-flex justify-content-between mt-3">
                  <div class="col-6">
                    <label>Cantidad</label>
                    <div class="d-flex">
                      <Button @click="calcularEliminado('disminuir')" icon="pi pi-minus" ></Button>
                      <InputText class="w-100 text-end mx-3" disabled v-model="productoEliminar.cantidad" />
                      <Button @click="calcularEliminado('aumentar')" icon="pi pi-plus" ></Button>
                    </div>
                  </div>
                  <div class="col-6">
                    <label>Total</label>
                    <InputText class="w-100 text-end" disabled v-model="productoEliminar.total" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </ConfirmDialog>
</template>

<style scoped>

</style>