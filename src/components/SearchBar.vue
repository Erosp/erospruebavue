<script>
import InputText from 'primevue/inputtext';

export default{
  components: {
    InputText
  },

  data() {
    return {
      busqueda: ""
    }
  },

  methods: {
    obtenerBusqueda(filtro){
      this.$emit('obtener', filtro);
    }
  }
}

</script>

<template>
    <span class="p-input-icon-left">
      <i class="pi pi-search" />
      <InputText v-model="busqueda" @keyup="obtenerBusqueda(busqueda)" placeholder="Buscar" />
    </span>
</template>

<style scoped>

</style>