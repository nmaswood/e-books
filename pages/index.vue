<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { Ref } from "vue";
import { computed, ref } from "vue";

//Data
const bookId: Ref<number | string> = ref("");
const router = useRouter();
const booksStore = useBooksStore();
const { allBooks } = storeToRefs(booksStore);
//Functions
const getBookById = () => {
  if (bookId.value) {
    router.push(`/books/${bookId.value}`);
  }
};

//Computed
const books = computed(() => {
  //convert the allBooks object values into array and sort them by the 'viewAt'property

  return (
    Object.values(allBooks.value)?.sort(
      (a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
    ) || []
  );
});
</script>

<template>
  <main>
    <form @submit.prevent="getBookById()" class="w-1/2 mx-auto">
      <InputField
        placeholder="Enter Book ID here"
        v-model="bookId"
        type="number"
        @keydown.enter="getBookById()"
      >
        <template v-slot:action>
          <button
            type="submit"
            @click="getBookById()"
            class="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e border border-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Search
          </button>
        </template>
      </InputField>
    </form>
    <div class="py-10">
      <div
        v-if="books.length"
        class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <template v-for="book in books" :key="book.id">
          <BookCard :book="book" />
        </template>
      </div>
      <div class="w-full" v-else>
        <EmptyState
          primaryMessage="Your Library is Empty"
          secondaryMessage="Start exploring by adding a book ID to get started."
        >
          <template #icon>
            <IconBook />
          </template>
        </EmptyState>
      </div>
    </div>
  </main>
</template>
