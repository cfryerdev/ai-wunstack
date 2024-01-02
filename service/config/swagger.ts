import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import packageJson from "../../package.json";

const options = {
    explorer: true,
    definition: {
      info: {
        title: 'wun-openai-server',
        description: 'OpenAI Rag & LLM for Wun',
        version: packageJson.version,
        contact: {
          name: "Chris Fryer",
          url: "http://www.cfryerdev.com/"
        },
      },
    },
    produces: ["application/json"],
    schemes: process.env.ENVIRONMENT === "dev" ? ["http"] : ["http", "https"],
    apis: [
      path.resolve(__dirname, "../routes/*.ts"),
      path.resolve(__dirname, "../models/*.ts")
    ]
  };

  export default swaggerJsdoc(options);