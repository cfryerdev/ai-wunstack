import { PlaywrightWebBaseLoader } from "langchain/document_loaders/web/playwright";

export const webLoad = async ({ url }) => {
  const loader = new PlaywrightWebBaseLoader(url);
  return await loader.load();
};