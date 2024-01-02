import { YoutubeLoader } from "langchain/document_loaders/web/youtube";

export const youtubeLoad = async ({ url }) => {
  const loader = YoutubeLoader.createFromUrl(url, {
    language: "en",
    addVideoInfo: true,
  });
  return await loader.load();
};