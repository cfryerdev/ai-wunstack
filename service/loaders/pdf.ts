import { WebPDFLoader } from "langchain/document_loaders/web/pdf";

// https://js.langchain.com/docs/integrations/document_loaders/web_loaders/pdf

export const pdfLoad = async ({ fileWithPath }) => {
  const loader = new WebPDFLoader(fileWithPath,
    {
      // you may need to add `.then(m => m.default)` to the end of the import
      pdfjs: () => import("pdfjs-dist/legacy/build/pdf.js"),
    }
  );
  const docs = await loader.load();
  return docs;
};