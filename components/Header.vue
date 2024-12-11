<script setup lang="ts">
import { ColorTheme } from "~/types/ColorTheme.ts";
const colorMode = useColorMode();
const toggleDark = (newTheme: ColorTheme) => {
  colorMode.preference = newTheme;
};
</script>

<template>
  <header
    class="flex items-center justify-between px-6 py-4 border-b shadow dark:border-gray-700 bg-white dark:bg-gray-900"
  >
    <NuxtLink to="/">
      <div class="flex items-center space-x-2 cursor-pointer">
        <icon-logo />
        <span class="text-lg font-semibold dark:text-gray-50">My Library</span>
      </div></NuxtLink
    >
    <button
      @click="
        toggleDark(
          $colorMode.value == ColorTheme.LIGHT
            ? ColorTheme.DARK
            : ColorTheme.LIGHT
        )
      "
      class="flex items-center justify-center p-2 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-200"
    >
      <icon-light-theme v-if="$colorMode.preference == 'dark'" />
      <icon-dark-theme v-else />
    </button>
  </header>
</template>
