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

### Timeline PR clusters

Small circles show Jeff's other authored, merged `kubeflow/pipelines` PRs through November 9, 2026. Major milestone PRs are excluded from clusters. The approver summary includes all authored merges through the February 23 approver PR's exact merge timestamp (16, including milestone PRs).

Each interval between milestones is divided into three time bins; empty bins are omitted. Milestone spacing itself is not proportional to time. Circle diameters use count buckets (1, 2-9, 10+), not lines changed or effort. Work-area labels summarize the existing changed-path classification and can overlap. Every PR appears in at most one cluster. Clusters reveal when the next major milestone is reached; focus/hover/click opens their public PR links, and Escape dismisses the panel.

Rebuild from public GitHub data (requires `gh` and the local research classification file):

```sh
gh pr list --repo kubeflow/pipelines --author jeffspahr --state merged \
  --search 'merged:2026-01-09..2026-11-09' --limit 1000 \
  --json number,title,mergedAt,url > /tmp/story-timeline-prs.json
node deck/scripts/build-timeline-clusters.mjs /tmp/story-timeline-prs.json
node --test deck/components/timeline-clusters.test.mjs
```

### Footer artwork

White slides use the intact [official CNCF North America 2026 color SVG](https://github.com/cncf/artwork/blob/main/other/kubecon-cloudnativecon/2026-na/color/kccnc-na-2026-color.svg), stored unchanged as `public/brand/footer-logo.svg`. The PowerPoint template's embedded raster logo clips the bottom lettering; shifting that image cannot restore it. The SVG preserves its own whitespace plus a 14px bottom inset. CNCF artwork remains subject to its [trademark license](https://github.com/cncf/artwork/blob/main/LICENSE.md).
