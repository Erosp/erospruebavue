<script>
import axios from 'axios';

export default{

  data() {
    return {
      categorias: []
    }
  },

  methods: {
    obtenerCategorias(){
      axios.get('https://fakestoreapi.com/products/categories')
        .then(resp =>{
          this.categorias=resp.data;
        });
    },
    seleccionarCategoria(categoria){
        this.$emit('seleccionar', categoria);
    }
  },

  mounted() {
    this.obtenerCategorias();
  }
}

</script>

<template>
    <div class="d-flex flex-wrap">
        <button type="button" class="btn btn-outline-primary me-3 mt-3" @click="seleccionarCategoria('todos')">Todos</button>
        <button type="button" class="btn btn-outline-primary me-3 mt-3" v-for="(cat, index) in categorias" :key="index" @click="seleccionarCategoria(cat)">{{ cat }}</button>
    </div>
</template>

<style scoped>

</style>
