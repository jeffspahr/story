# Slidev presentation

Installed and verified on October 31, 2026 using Node 26.13.0 and npm 11.20.0. Node >=22.12.0 is required.

Pinned dependencies: Slidev 53.0.0, default theme 0.25.0, Vue 3.5.44, playwright-chromium 1.64.1. DOMPurify is overridden to patched version 3.4.17.

From this directory:

    npm ci
    npx playwright install chromium
    npm run dev
    npm run build
    npm run export

PDF output goes to exports/zero-to-maintainer.pdf. slides.md contains the revised speaker-led draft, with speaker notes, a comic placeholder, and a placeholder for the UI modernization reveal.

## Verification and remaining dependency issues

- npm ci completed; npm ls --depth=0 resolves all direct dependencies.
- npm run build passed.
- npm run export rendered the slide with Chromium and generated a PDF; pdftotext confirmed the title, subtitle, and speaker.
- DOMPurify override removes the critical audit finding and associated moderate findings.
- npm audit still reports four high findings, all rooted in image-size via pptxgenjs (also attributed to Slidev client/CLI). Available image-size 1.x releases remain affected; a forced major override or Slidev downgrade has not been applied. Review upstream fixes before PowerPoint export or processing untrusted images.
- Export logs a caught FloatingVue/Twoslash tooltip patch error. The title slide renders and exports despite it; code-hover tooltip functionality remains unverified. This is an upstream dependency integration issue, not a clean browser-console result.

npm may warn that install scripts need approval under its install-script policy. Chromium is installed on this machine; the explicit playwright install command above supports a fresh setup.
