<script lang="ts"  setup>
const bookStore = useBooksStore()
bookStore.initializeBooks();

</script>
<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <div class="p-6 bg-gray-50 dark:bg-gray-800 w-full h-full grow">
      <div class="container m-auto">
        <NuxtPage /></div></div>
      </div>
</template>
