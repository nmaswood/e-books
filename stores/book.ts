import Groq from "groq-sdk";
import nuxtStorage from "nuxt-storage";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import type { AllBooks, SingleBook } from "~/helpers/interfaces/book.interface";

export const useBooksStore = defineStore("books", () => {
  //Data
  const allBooks: Ref<AllBooks> = ref({});
  const singleBook: Ref<SingleBook | null> = ref(null);

  //Functions
  const initializeBooks = () => {
    //get all books stored in locaStorage

    const storedBooks = nuxtStorage.localStorage.getData("books");
    allBooks.value = JSON.parse(storedBooks || "{}");
  };
  const fetchSingleBook = async (bookId: string) => {
    // Reset the singleBook state to null
    singleBook.value = null;
    // Check if the book is already stored in localStorage and allBooks
    const book = nuxtStorage.localStorage.getData(`book-${bookId}`);
    if (book && allBooks.value[bookId]) {
      // If found, load the book from localStorage and update its viewed timestamp

      singleBook.value = JSON.parse(book);
      allBooks.value[bookId].viewedAt = new Date().toISOString();
    } else {
      // If not found, fetch the book's content and metadata
      const { data, error } = await getBook(bookId);
      if (error || !data) {
        singleBook.value = null;
        saveBooks();
        throw new Error();
      }

      const { content, metadata } = data;
      // Parse metadata HTML to extract details
      const domElement = new DOMParser().parseFromString(metadata, "text/html");
      const imgSrc = domElement
        .querySelector("img.cover-art")
        ?.getAttribute("src");
      const tableRows = domElement.querySelectorAll("#bibrec table.bibrec tr");
      // Extract metadata details into an object
      const parsedData: {
        [key: string]: string[];
      } = {};
      tableRows?.forEach((row) => {
        const th = row.querySelector("th");
        const td = row.querySelector("td");

        if (th && td) {
          const key = th.textContent?.trim()?.toLowerCase() || "";
          if (!parsedData[key]) parsedData[key] = [];
          parsedData[key].push(td.textContent?.trim() || "");
        }
      });
      const newBook = {
        id: bookId,
        content: content || undefined,
        metadata: parsedData,
        title: parsedData.title?.[0] || "",
        author: parsedData.author?.[0] || parsedData.editor?.[0] || "-",
        imgSrc: imgSrc ?? undefined,
      };

      singleBook.value = newBook;
      // Update allBooks with the new book data and update the view timestamp
      allBooks.value = {
        ...allBooks.value,
        [bookId]: {
          id: bookId,
          author: newBook.author,
          title: newBook.title,
          imgSrc: newBook.imgSrc,
          viewedAt: new Date().toISOString(),
        },
      };
      // Save the updated books to localStorage
      saveBooks();
      nuxtStorage.localStorage.setData(
        `book-${bookId}`,
        JSON.stringify(newBook),

        30,
        "d"
      );
    }
  };

  const saveBooks = () => {
    nuxtStorage.localStorage.setData(
      "books",
      JSON.stringify(allBooks.value),
      30,
      "d"
    );
  };

  const analysisBook = (book: SingleBook) => {
    // Initialize a Groq instance
    const groq = new Groq({
      apiKey: "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",
      dangerouslyAllowBrowser: true,
    });

    return groq.chat.completions.create({
      messages: [
        // The system's role, providing instructions on how the AI should behave

        { role: "system", content: `You are a literary analysis expert.` },
        // The user's request, specifying what to analyze in the book

        {
          role: "user",
          content: `
  analyze this book "${
    book?.content ? book?.content?.slice(0, 25000) : book?.title
  }"  Sentiment Analysis, key characters,language detection, and Plot Summary. Response should only contain the analysis text.`,
        },
      ],

      model: "llama3-8b-8192",
      temperature: 0.1,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: false,
    });
  };

  return {
    fetchSingleBook,
    allBooks,
    singleBook,
    analysisBook,
    initializeBooks,
  };
});
