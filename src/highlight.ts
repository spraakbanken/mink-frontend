import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import highlightPlugin from "@highlightjs/vue-plugin";
import "highlight.js/styles/base16/monokai.css";

hljs.registerLanguage("xml", xml);
hljs.registerLanguage("yaml", yaml);

export default highlightPlugin;

export type SyntaxLanguage = "xml" | "yaml";
