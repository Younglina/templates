// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  shortcuts: [
    // ...
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      collections: {
        ms: () =>
          import("@iconify-json/material-symbols/icons.json").then(
            (i) => i.default
          ),
      },
    }),
    presetTypography(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
