export default defineEventHandler(async (event) => {
  // Extract bookId from the route parameters
  const bookId = getRouterParam(event, "bookId");

  if (!bookId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Book Id is required",
    });
  }

  // Construct URLs for content and metadata
  const contentUrl = `https://www.gutenberg.org/files/${bookId}/${bookId}-0.txt`;
  const metaDataUrl = `https://www.gutenberg.org/ebooks/${bookId}`;

  try {
    // Fetch content and metadata concurrently

    const [contentResponse, metadataResponse] = await Promise.all([
      fetch(contentUrl),
      fetch(metaDataUrl),
    ]);

    // Check for response validity
    if (metadataResponse.status !== 200 && metadataResponse.status !== 201) {
      throw createError({
        statusCode: 404,
        statusMessage: "Failed to fetch content or metadata",
      });
    }

    // Extract text from responses
    const [content, metadata] = await Promise.all([
      contentResponse.text(),
      metadataResponse.text(),
    ]);

    // Return fetched data
    return { content, metadata };
  } catch (error) {
    // Handle errors during fetch
    console.error("Error fetching book data:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch book data",
    });
  }
});
