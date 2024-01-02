import { GithubRepoLoader } from "langchain/document_loaders/web/github";

export const githubLoad = async ({ url, branch }) => {
  const loader = new GithubRepoLoader(url,
    {
      branch: branch,
      recursive: false,
      unknown: "warn",
      maxConcurrency: 5, // Defaults to 2
    }
  );
  const docs = await loader.load();
  return docs;
};