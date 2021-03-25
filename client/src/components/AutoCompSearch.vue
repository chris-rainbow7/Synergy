<template>
  <div>
    <advanced-search
      v-model="model"
      :options="options"
    >
    </advanced-search>
  </div>
</template>

<script>
  import  AdvancedSearch from 'vue-advanced-search';

  export default {
    components: { AdvancedSearch },
    data () {
      return {
        model: null,
        options: [
            { label: 'label1', value: 'value1' },
            { label: 'label2', value: 'value2' }
        ]
      }
    }
  }
</script>
<style src="vue-advanced-search/dist/AdvancedSearch.css"></style>