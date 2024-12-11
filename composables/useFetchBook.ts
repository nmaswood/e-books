export async function getBook(bookId: string) {
  try {
    const { data, error } = await useFetch<{
      content: string;
      metadata: string;
    }>(`/api/book/${bookId}`, {
      method: "GET",
    });
    if (data.value)
      return {
        data: { content: data.value.content, metadata: data.value.metadata },
      };
    else return { data: null, error: error.value };
  } catch (e) {
    console.error("Error in getBook:", e);
    return { data: null, error: e };
  }
}
