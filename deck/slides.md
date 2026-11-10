---
theme: default
title: 'Zero to Maintainer in 45 Days'
aspectRatio: '16/9'
fonts:
  webfonts: []
class: cover
---

<div class="hero"><div class="kicker">KubeCon + CloudNativeCon North America 2026</div><h1>Zero to Maintainer<br>in 45 Days</h1><div class="subtitle">An AI-Assisted Migration of a CNCF Project's Legacy Frontend</div><div class="speaker">Jeff Spahr · November 10, 2026</div></div>

<!-- I'm a people leader with an infrastructure and SRE background, not a frontend developer. I started this work to solve a problem in a project I cared about. The 45 days describe becoming a maintainer; the migration continued afterward. -->

---
class: blue
---

# Jeff Spahr

<div class="intro-content">
  <img class="intro-headshot" src="/speaker/jeff-spahr.jpg" alt="Jeff Spahr" />
  <div>
    <p class="lead">Director, Software Engineering<br>Capital One</p>
    <p class="lead">Maintainer<br>Kubeflow Pipelines</p>
    <p class="intro-background">Infrastructure and SRE background<br>Not a frontend developer</p>
  </div>
</div>

<!-- Headshot and work title from my SREcon 2026 presenter slide. I'm a people leader with an infrastructure and SRE background; frontend development wasn't my specialty. -->

---
class: blue
---

# What problem was I trying to solve? Why did I care?

<p class="lead">I'm accountable for an internal platform and keeping it well managed.</p>

<p class="lead">I needed to eliminate vulnerabilities in the Kubeflow Pipelines frontend.</p>

<!-- I saw vulnerabilities in the frontend and frontend server that weren't getting patched. I didn't understand what was preventing the updates, so I started digging. -->

---
---

# I didn't start from nowhere

<p class="lead">I already worked with a Kubeflow maintainer. That connection helped me get involved.</p>

<!-- This relationship mattered. I had help getting started, and I don't want to tell a bootstrap story that leaves out that connection. This is what happened for me, not a formula that guarantees the same outcome for someone else. Credit later collaborators as their help enters the story. -->

---
---

# Why weren't the dependencies getting updated?

<p class="small" style="opacity: 1">Maybe this was a configuration issue?</p>

<div class="two"><div class="card"><b>Dependabot</b><p>It was running, using GitHub defaults. There was no config file in the repo.</p></div><div class="card"><b>Renovate</b><p>There was a config file, but it had been disabled in 2022.</p></div></div>

<p class="small muted">The renovate file had me looking in the wrong place. Let's remove that confusion for myself, others, and agents.</p>
<p class="source">PR <a href="https://github.com/kubeflow/pipelines/pull/12631" target="_blank" rel="noopener noreferrer">#12631</a> · removal merged January 9, 2026</p>

<!-- I initially had to untangle how dependency updates were configured. Dependabot was running. The remaining renovate.json5 had enabled set to false. It was disabled in July 2022 and removed in January 2026, about three and a half years later. Confirm the defaults detail against the original repository settings before presenting; it is based on my account. -->

---
---

# My first PR: delete renovate.json5

<div class="pathway"><div class="step">July 2022<span>Renovate disabled</span></div><div class="arrow">→</div><div class="step">January 2026<span>Disabled config removed</span></div><div class="arrow">→</div><div class="step">PR <a href="https://github.com/kubeflow/pipelines/pull/12631" target="_blank" rel="noopener noreferrer">#12631</a><span>small, scoped, no risk change.</span></div></div>

<p class="small muted">It had been disabled for about three and a half years.</p>

<a href="https://github.com/kubeflow/pipelines/pull/12631/files" target="_blank" rel="noopener noreferrer" class="pr-screenshot-link"><img src="/evidence/pr-12631-deleted-file.png" alt="GitHub PR 12631 showing the deleted .github/renovate.json5 file and 63 deletions, with file contents collapsed" /></a>
<p class="source"><a href="https://github.com/kubeflow/pipelines/pull/12631" target="_blank" rel="noopener noreferrer">github.com/kubeflow/pipelines/pull/12631</a></p>

<!-- My first PR was simply to remove the disabled renovate.json5 file. The PR description says the file had been disabled since July 2022, about 3.5 years, not 4-plus years. This did not fix the vulnerabilities. -->

---
---

# My first Kubeflow Pipelines PR

<MilestoneTimeline :step="1" />

---
---

# These weren't simple dependency bumps

<p class="small dependency-context">The frontend server still depended on <code>request</code>, deprecated since 2020.</p>

<div class="pathway dependency-chain"><div class="step">Remove vulnerable packages<span><code>request</code>, old <code>tar</code> and <code>qs</code> came through the Kubernetes client.</span></div><div class="arrow">→</div><div class="step">Upgrade that client<span><code>@kubernetes/client-node</code><br>0.16.3 → 1.4.0</span></div><div class="arrow">→</div><div class="step">Change the server<span>CommonJS → ESM<br>Rewrite API calls and response handling<br>Migrate server tests</span></div></div>

<p class="small muted">Fixing the dependency tree meant changing the code that used it.</p>
<p class="source"><a href="https://github.com/request/request#readme" target="_blank" rel="noopener noreferrer">request deprecation</a> · PR <a href="https://github.com/kubeflow/pipelines/pull/12756" target="_blank" rel="noopener noreferrer">#12756</a></p>

<!-- Dependabot was running; the problem was not just configuration. request was fully deprecated on February 11, 2020. PR #12756 removed request, old tar and qs from the Kubernetes client's dependency subtree by moving @kubernetes/client-node 0.16.3 to 1.4.0. The new client required ESM; API calls changed from positional arguments to named objects and returned objects directly instead of body wrappers. The implementation also moved server tests from Jest to Vitest for better ESM support; that runner choice was part of our solution, not the only possible solution. The PR reports six targeted CVEs addressed, not an entirely vulnerability-free application. qs still existed via Express at a newer version. -->

---
---

# React 16 → 17<br>needed other migrations

<p class="small dependency-context">Create React App was deprecated. We had to replace our entire UI testing framework.</p>

<div class="pathway dependency-chain"><div class="step">Build + tests<span>Create React App → Vite<br>Jest / Enzyme → Vitest / Testing Library<br><a href="https://github.com/kubeflow/pipelines/pull/12754" target="_blank" rel="noopener noreferrer">#12754</a></span></div><div class="arrow">→</div><div class="step">Charting dependencies<span>Replace react-vis with Recharts<br>Pin its react-redux dependency for React 17<br><a href="https://github.com/kubeflow/pipelines/pull/12829" target="_blank" rel="noopener noreferrer">#12829</a></span></div><div class="arrow">→</div><div class="step">Then React 17<span>Upgrade React and its types<br>Adjust table and graph code<br><a href="https://github.com/kubeflow/pipelines/pull/12849" target="_blank" rel="noopener noreferrer">#12849</a></span></div></div>

<p class="small muted">Even the replacement chart library brought another compatibility problem.</p>
<p class="source"><a href="https://react.dev/blog/2025/02/14/sunsetting-create-react-app" target="_blank" rel="noopener noreferrer">CRA deprecated February 2025</a> · Merged PRs linked above</p>

<!-- This is the project's actual migration sequence, not a claim that every React app needs these exact replacements. PR #12754 explicitly identifies CRA and legacy test/tooling dependencies as blockers for this project's React upgrade. Its package.json removes enzyme-adapter-react-16 while keeping React at 16. PR #12829 replaced react-vis/react-svg-line-chart with Recharts/inline SVG and pinned Recharts' transitive react-redux to 8.1.3 for React17 compatibility. PR #12849 explicitly stacks on that merged chart migration and changes CustomTable.tsx and SubDagLayer.tsx alongside React and type versions. The checklist also records the Material UI v4 baseline (#12793); this slide is a selected chain, not every prerequisite. CRA was deprecated for new apps in February 2025, with existing apps encouraged to migrate; do not claim that CRA could never run newer React or that React/Jest themselves were EOL. -->

---
class: blue
---

# Pre-AI, I would have stopped right here.

<div class="bigquote">Nah, I'm good.</div>

<!-- Before AI dev tools, this is where I would have stopped. I wasn't a frontend developer, and this was much more than a dependency bump. -->

---
class: blue
---

# Could I make these changes with AI tools?

<p class="lead">I had to be confident enough in my changes.<br><br>I had to convince the maintainers to be confident enough in my changes.</p>

<!-- Confidence had to come from checking the changes, not just trusting the tools. -->

---
---

# How would I know the AI-written code was good enough?

<p class="lead">I wasn't a frontend developer. I still had to stand behind the changes.</p>

<!-- Human-written code doesn't come with a quality guarantee either. That doesn't lower the bar for AI. It means I needed a way to check. -->

---
class: comic-slide
---

<div class="comic-with-transition">
  <div>
    <img class="comic-illustration" src="/illustrations/ai-coding-comic.png" alt="Four-panel comic: two developers worry AI coding tools might write terrible code or introduce production bugs, while one repairs a fragile production system with gum and toothpicks." />
    <p class="comic-disclosure">Image generated with ChatGPT</p>
  </div>
  <div class="comic-transition">
    <p>Human-written code doesn't come with a quality guarantee either.</p>
    <p><strong>That doesn't lower the bar for AI.</strong></p>
    <p>It means I needed a way to check.</p>
  </div>
</div>

<!-- Give the audience time to read the four panels. Keep this a quick aside: human-written code is not automatically good, but that is not an excuse for bad AI output. The following story explains how I checked the work through smaller changes, frontend review, tests, and screenshot comparisons. -->

---
---

# We built confidence in the changes<br>over time

<p class="lead">I was learning the frontend.<br>Other people brought experience I didn't have.</p>

<!-- The confidence came from working through changes together, not from a personal formula for earning trust. The next example shows tests before an upgrade; then credit the UI colleague who helped review the work. -->

---
---

# Tests before the upgrade

<div class="pathway"><div class="step">Add test coverage<span>Kubernetes client tests · <a href="https://github.com/kubeflow/pipelines/pull/12635" target="_blank" rel="noopener noreferrer">#12635</a></span></div><div class="arrow">→</div><div class="step">Upgrade the client<span>Server security fixes · <a href="https://github.com/kubeflow/pipelines/pull/12756" target="_blank" rel="noopener noreferrer">#12756</a></span></div></div>

<p class="small muted">These changes helped me get familiar with the project.</p>
<p class="source">Merged PRs <a href="https://github.com/kubeflow/pipelines/pull/12635" target="_blank" rel="noopener noreferrer">#12635</a>, <a href="https://github.com/kubeflow/pipelines/pull/12756" target="_blank" rel="noopener noreferrer">#12756</a></p>

<!-- I added tests around the Kubernetes client before upgrading it. The later server PR removed vulnerable dependencies but involved a substantial ESM and test migration. This is a concrete example from my work, not a claim that every PR was small. -->

---
---

# My first frontend changes

<MilestoneTimeline :step="2" />

---
---

# I asked a UI developer to review my changes

<p class="lead">His thumbs-up gave me and the maintainers confidence to start merging.</p>

<!-- I pulled in an internal UI developer to review some changes. His approval made me and the maintainers confident enough to start merging. Speaker to add the colleague's name and specific example if he wants to credit him publicly. -->

---
---

# I couldn't rely on him for every review

<p class="lead">I needed a way to check the UI myself.</p>

<div class="card" style="margin-top:20px;min-height:0"><b>I built a screenshot comparison tool</b><p>Take screenshots before and after a change, then highlight the pixel differences.</p></div>

<!-- I could not move at the speed I needed to if I depended on another person to validate every change. I built tooling to compare the UI before and after and make visual differences easier to investigate. -->

---
---

# I added comparisons to my PRs

<div class="three"><div class="card"><b>Before</b><p>Take screenshots of the existing UI.</p></div><div class="card"><b>After</b><p>Take the same screenshots with my changes.</p></div><div class="card"><b>Compare</b><p>Look at the differences and share them with reviewers.</p></div></div>

<p class="small muted">Maintainers could see what had changed.</p>
<p class="source">PR <a href="https://github.com/kubeflow/pipelines/pull/12754" target="_blank" rel="noopener noreferrer">#12754</a> · visual evidence · PR <a href="https://github.com/kubeflow/pipelines/pull/12784" target="_blank" rel="noopener noreferrer">#12784</a> · comparison tool</p>

<!-- The Vite PR included visual comparisons for eight views before the separate UI smoke-test tool PR merged. PR 12784 describes automated Playwright captures, side-by-side images and pixel difference percentages. Include a real artifact on this slide later, not a fabricated example. Sharing the comparisons helped maintainers gain confidence. -->

---
---

# A comparison from the Vite PR

<img src="/evidence/recurring-runs-comparison.png" alt="Side-by-side screenshots of the Recurring Runs page on the base branch and the migration PR" style="width:100%;max-height:260px;object-fit:contain;border:1px solid #c7d7e7" />

<p class="tiny muted">One of eight comparisons I posted on the Vite migration PR.</p>
<p class="source">PR <a href="https://github.com/kubeflow/pipelines/pull/12754" target="_blank" rel="noopener noreferrer">#12754</a> · visual comparison comment</p>

<!-- This is the actual Recurring Runs comparison posted in PR 12754. The base is on the left, the PR on the right. Comparisons help us inspect changes; they do not prove the absence of regressions. -->

---
---

# Sometimes the UI did change

<div class="regression-comparison">
  <div>
    <b>Before</b>
    <svg viewBox="480 125 500 300" role="img" aria-label="The original chart tooltip has light, readable text on a dark background.">
      <image href="/evidence/roc-before.png" width="1830" height="1318" />
      <ellipse cx="740" cy="244" rx="165" ry="82" />
    </svg>
  </div>
  <div>
    <b>After</b>
    <svg viewBox="950 285 520 300" role="img" aria-label="The changed chart tooltip has dark text that is difficult to read on a dark background.">
      <image href="/evidence/roc-regression.png" width="2060" height="1252" />
      <ellipse cx="1232" cy="448" rx="185" ry="87" />
    </svg>
  </div>
</div>

<p class="small">The tooltip text became difficult to read.</p>
<p class="source">Reviewer screenshots · PR <a href="https://github.com/kubeflow/pipelines/pull/12829#issuecomment-3918215968" target="_blank" rel="noopener noreferrer">#12829</a></p>

<!-- Anish Surti found this tooltip contrast regression during manual review of the Recharts migration. These are his screenshots; the red circles were added for this slide. The two tooltips show different values, so point out the text contrast rather than comparing the numbers. Do not claim the automated comparison discovered this specific issue. -->

---
---

# The build and test tools were replaced

<MilestoneTimeline :step="3" />

---
---

# Then more people showed up

<p class="lead">Manaswini and I made a plan and divided up the work.</p>

<p class="small">Contributors picked up dependencies, tests, and framework upgrades.</p>
<p class="source">Collaborative planning: speaker account · Kubeflow modernization blog</p>

<!-- Jeff identifies Manaswini as a key collaborator who helped plan and distribute the work. Add verified examples and specific contributor names as we research them. The blog acknowledges several contributors; it is not an exhaustive list. -->

---
---

# I became a frontend approver

<MilestoneTimeline :step="4" />

---
---

# From React 16 to React 19

<div class="pathway"><div class="step">Vite + tests<span>Replace CRA / Enzyme</span></div><div class="arrow">→</div><div class="step">React 17<span>Clear peer blockers</span></div><div class="arrow">→</div><div class="step">React 18<span>Upgrade dependencies</span></div><div class="arrow">→</div><div class="step">React 19<span>Community-led upgrade</span></div></div>

<p class="small muted">The migration continued after the 45-day maintainer milestone.</p>
<p class="source">Kubeflow modernization blog · PR <a href="https://github.com/kubeflow/pipelines/pull/12754" target="_blank" rel="noopener noreferrer">#12754</a> · PR <a href="https://github.com/kubeflow/pipelines/pull/13153" target="_blank" rel="noopener noreferrer">#13153</a></p>

<!-- Explain the high-level sequence without implying I did all the work. The React 19 PR merged March 27 and was authored by Premved Dhote. -->

---
class: blue
---

# I became a reviewer<br>as much as a contributor.

<p class="lead">The work started in the frontend. It grew into CI and, eventually, the whole project.</p>

<!-- I became a frontend approver, then later a maintainer for the entire project. By the React 19 upgrade, I was reviewing and approving someone else's work. -->

---
---

# The work grew into CI

<MilestoneTimeline :step="5" />

---
---

# From frontend into the wider project

<ContributionCharts mode="heatmap" />

<p class="tiny muted">Authored PRs by month opened in 2026; file-path categories overlap and are not effort. October is partial.</p>
<p class="source">GitHub contribution data collected Oct 31, 2026</p>

<!-- Categories derive from changed paths and overlap. The graph shows the widening scope of authored PRs, not how much time or effort each took. October is partial. -->

---
---

# I became a project maintainer

<MilestoneTimeline :step="6" />

<!-- Frontend approver was the 45-day milestone. Project-wide maintainer came later, on July 28. All timeline merge dates use UTC. -->

---
---

# Security advisories in 2.18

<MilestoneTimeline :step="7" />

<!-- Jeff's role in triaging and publishing advisories is speaker-confirmed. Public advisories were published October 28-29 UTC around the 2.18.0 release (October 28 UTC); fifteen list 2.18.0 as the patched version, while another October disclosure lists 2.17.0. Do not equate all published advisories with new 2.18 fixes or claim sole credit for reports and fixes. Sources: public GitHub advisories and 2.18.0 release notes. Separately, droctothorpe built the release automation; my work iterated on it and focused on eliminating fixable vulnerabilities. The release still documents accepted vulnerabilities and security limitations. -->

---
---

# My GitHub activity over time

<ContributionCharts />

<p class="tiny muted">All repositories. *2026 through Oct 31; prior years are full years.<br>Separate scales and measures: a PR and its commits can both appear. Counts are not added.</p>
<p class="source">GitHub authenticated contribution totals · refreshed Nov 9, 2026</p>

<!-- Separate measures preserve direct-to-branch work without adding commits to PRs. Each panel has its own labeled scale and aligned periods. Reviewed uses distinct PRs in the selected GitHub contribution period. Includes accessible private activity in aggregate. -->

---
---

# My GitHub activity in 2026

<ContributionCharts mode="monthly" />

<p class="tiny muted">All repositories, January–October. Each panel has its own scale; counts are not added.<br>A PR reviewed in multiple months can count in each month.</p>
<p class="source">GitHub authenticated monthly contribution totals · refreshed Nov 9, 2026</p>

<!-- Monthly commit and PR measures. A PR reviewed across months can count in each; monthly reviews need not sum to the annual reviewed-PR count. The chart uses its own monthly scale. -->

---
class: blue
---

# So why does the UI<br>still look so dated?

<div class="bigquote">Because a visual change<br>was treated as a <span class="accent">regression.</span></div>

<!-- During the stack migration, we treated visual changes as regressions. We needed confidence that replacing the foundations had not accidentally changed the experience. That left the visual redesign as separate work. -->

---
---

# Before

<img class="modernization-image" src="/evidence/ui-pipelines-before.png" alt="Legacy Kubeflow Pipelines list" />

<p class="source">Pipelines list · <a href="https://github.com/jeffspahr/jeffspahr-pipelines/releases/tag/ui-modernization-comparison-20261021" target="_blank" rel="noopener noreferrer">Comparison recording</a> · sample data</p>

<!-- Legacy application build cd3ed541, from the October 21 comparison recording. The next slide shows the same view and sample data in the modernization build. -->

---
---

# Today: a new UI

<MilestoneTimeline :step="8" />

---
---

# This project deserves a modern UI

<img class="modernization-image" src="/evidence/ui-pipelines-preview.png" alt="Redesigned Kubeflow Pipelines list" />

<p class="source">Preview · <a href="https://github.com/kubeflow/pipelines/pull/14584" target="_blank" rel="noopener noreferrer">PR #14584</a> · sample data</p>

<!-- Modernization build ba521c410, from the October 21 comparison recording. PR #14584 was open as of November 4; check status before presenting. -->

---
---

# Dark mode

<img class="modernization-image" src="/evidence/ui-pipelines-dark-preview.png" alt="Redesigned Kubeflow Pipelines list in dark mode" />

<p class="source">Preview · <a href="https://github.com/kubeflow/pipelines/pull/14584" target="_blank" rel="noopener noreferrer">PR #14584</a> · sample data</p>

<!-- Captured from the mock-backed review preview on November 4; preview source revision b710d6d9d. -->

---
---

# Run details

<img class="modernization-image" src="/evidence/ui-run-details-preview.png" alt="Redesigned run graph with task logs in the Kubeflow Pipelines preview" />

<p class="source">Preview · <a href="https://github.com/kubeflow/pipelines/pull/14584" target="_blank" rel="noopener noreferrer">PR #14584</a> · sample data</p>

<!-- The run-details image is from the mock-backed review preview, captured October 22; it is not a production deployment. Check PR status before presenting. -->

---
---

# Thank you

<div class="credits"><div><b>Manaswini Das · @manaswinidas</b><br><span class="small muted">Planning, frontend tests, and reliability</span></div><div><b>Premved Dhote · @PR3MM</b><br><span class="small muted">React 19 upgrade</span></div><div>@kanishka-commits<br>@jsonmp-k8</div><div>@dpanshug<br>@rishi-jat</div></div>

<p class="small" style="margin-top:22px">And the colleagues, maintainers, reviewers, and contributors who helped along the way.</p>
<p class="source">Kubeflow modernization blog · additional credits to verify</p>

<!-- Include the colleague who was already a maintainer and the internal UI reviewer if Jeff wants to identify them. This list is a baseline, not an exhaustive list of everyone who contributed. -->

---
---

# Thank you

<p class="lead">For the /lgtm and /approve on my PRs:</p>

<div class="three" style="margin-top:22px; line-height:1.8; font-size:18px">
  <div><a href="https://github.com/droctothorpe" target="_blank" rel="noopener noreferrer">@droctothorpe</a><br><a href="https://github.com/zazulam" target="_blank" rel="noopener noreferrer">@zazulam</a><br><a href="https://github.com/manaswinidas" target="_blank" rel="noopener noreferrer">@manaswinidas</a><br><a href="https://github.com/juliusvonkohout" target="_blank" rel="noopener noreferrer">@juliusvonkohout</a></div>
  <div><a href="https://github.com/hbelmiro" target="_blank" rel="noopener noreferrer">@hbelmiro</a><br><a href="https://github.com/mprahl" target="_blank" rel="noopener noreferrer">@mprahl</a><br><a href="https://github.com/jsonmp-k8" target="_blank" rel="noopener noreferrer">@jsonmp-k8</a><br><a href="https://github.com/Priyanshu-u07" target="_blank" rel="noopener noreferrer">@Priyanshu-u07</a></div>
  <div><a href="https://github.com/sathish-thangaraj" target="_blank" rel="noopener noreferrer">@sathish-thangaraj</a><br><a href="https://github.com/HumairAK" target="_blank" rel="noopener noreferrer">@HumairAK</a><br><a href="https://github.com/srtanish1992" target="_blank" rel="noopener noreferrer">@srtanish1992</a><br><a href="https://github.com/dpanshug" target="_blank" rel="noopener noreferrer">@dpanshug</a></div>
</div>

<p class="small muted" style="margin-top:20px">And everyone who reviewed, commented, and helped.</p>
<p class="source"><a href="https://github.com/kubeflow/pipelines/pulls?q=is%3Apr+author%3Ajeffspahr" target="_blank" rel="noopener noreferrer">Pipelines PRs</a> · checked November 4, 2026</p>

<!-- Handles found in standalone /lgtm or /approve commands in PR conversation comments and submitted review bodies across 468 authored Pipelines PRs, checked November 4. Inline review-thread comments were not scanned; this is not an exhaustive list of reviewers. -->

---
class: blue
---

# Questions?

<p class="lead" style="margin-top:45px">Jeff Spahr · Kubeflow Pipelines</p>

<!-- Close with thanks to the people who helped. Invite questions. -->
