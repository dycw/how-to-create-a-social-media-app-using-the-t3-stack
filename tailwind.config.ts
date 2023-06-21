import aspectRatio from "@tailwindcss/aspect-ratio";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [aspectRatio, forms, typography],
} satisfies Config;
