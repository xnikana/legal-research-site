# Capabilities overview

This repository is a **municipal planning-document toolkit**: discover where towns publish materials, mirror a SharePoint packet library, turn PDFs and audio into text-friendly formats, and optionally drive a browser with a **local vision model**. Most of the heavy lifting is **Python** in isolated virtual environments; the repo root also holds a **React + Vite** template for a small front end.

Running the stack on an **NVIDIA DGX** (or any Linux host with NVIDIA GPUs and a working CUDA stack) is what makes the experience practical: **GPU-backed inference** for speech and document models, **fast PyTorch** workloads, and **Ollama** serving vision LLMs without round-trips to the cloud.

---

## What we built

### SharePoint sync and browser automation (`sharepoint-sync/`)

- **Folder inventory and gap analysis** — Compare SharePoint folder titles to a local mirror, produce JSON/Markdown reports (`folder_titles_compare.py`).
- **Auth-aware downloads** — Walk **AllItems.aspx** views, discover real file links in the DOM, then download using session cookies or Playwright’s download path; optional **humanized** mouse movement and click delays to behave more like a real user (`download_missing.py`).
- **Local vs remote diff** — Headless or headed Playwright comparison of crawled tree to disk (`compare_to_local.py`).
- **Two crawl modes** (`crawl.py`):
  - **DOM / BFS** — No LLM: queue folder and list URLs and collect document links (including broader media extensions where configured).
  - **Agent** — **browser-use** + **Ollama** vision (default **`llava:7b`**) for exploratory navigation; GPU-backed Ollama on a DGX keeps step latency tolerable compared to CPU-only inference.
- **Operational polish** — Optional **WebM screen recordings** for debugging Playwright flows; **Planning Board** vs **direct library** entry URLs; shared constants for the RI Barrington packet library context.
- **Rhode Island context** — [RI_MUNICIPAL_PLANNING_SOURCES.md](https://github.com/fossnik/hackathon3-mar28/blob/main/sharepoint-sync/RI_MUNICIPAL_PLANNING_SOURCES.md) documents how RI municipalities publish planning materials (SharePoint vs CivicPlus, Municode, etc.), plus optional **HTML scanners** under `sharepoint-sync/scripts/` for reproducible probes.

Detailed commands and prerequisites are in [sharepoint-sync/RUNBOOK.md](https://github.com/fossnik/hackathon3-mar28/blob/main/sharepoint-sync/RUNBOOK.md).

### PDF → Markdown (`pdf-transcription/`)

- **PyMuPDF4LLM** — Fast path for PDFs with a real text layer; **CPU-oriented**, ideal for quick runs and digital reports.
- **Marker (`marker-pdf`)** — Recommended when you want **DGX-class throughput**: PyTorch layout/OCR pipelines that **use CUDA** when available, batch-friendly, optional **`--use_llm`** with a **local Ollama** model on the same machine for harder tables and math.

See [pdf-transcription/README.md](https://github.com/fossnik/hackathon3-mar28/blob/main/pdf-transcription/README.md) for install patterns, `TORCH_DEVICE=cuda`, and **multi-GPU** fan-out (`CUDA_VISIBLE_DEVICES` per worker).

### Audio transcription (`audio-transcription/`)

- **OpenAI Whisper** via PyTorch — Transcribe long meetings and field recordings; **`transcribe.py`** loads audio with **librosa** at **16 kHz mono** so a system **ffmpeg** binary is optional for common formats (e.g. WAV).
- Outputs **plain text** and **JSON** (full text plus segments) for downstream search or RAG.

On a DGX, **CUDA-enabled PyTorch** dramatically shortens wall time for **`large`** / **`large-v3`** models versus CPU-only runs. Model weights cache under `~/.cache/whisper/`.

### Research platform (`legal-research-site/`)

The frontend is not a template — it is a fully deployed public research platform at **[legal-research.tech](https://legal-research.tech/)**, built on React 19 + Vite and hosted on Vercel. It exposes everything the ingestion pipeline produces as a searchable, navigable intelligence environment.

**Full-text archive search**
Search across all 502 inventoried documents and 2.18 million indexed words in a single query. Results appear instantly in a dropdown preview as you type, with highlighted match fragments, file type badges, and document metadata. File type filter pills (PDF / Video / Word / Spreadsheet / Audio) let you scope results before committing. Pressing Enter expands to a full paginated result set rendered as rich document cards with direct action buttons.

**Ask the Archive — RAG chat**
A Claude-powered conversational interface that answers natural-language questions about the municipal record. Every answer is grounded in retrieved document chunks and includes inline source citations — no hallucinated facts, no unsupported claims. Users can ask questions like "What did the planning board decide about the Belton Court setback?" and receive a structured, evidence-backed response with links to the source documents.

**RI Legal Guide**
A 10-section Rhode Island public records and land use law reference, rendered inline and fully navigable via a table of contents. Covers the Comprehensive Permit Act (§ 45-53), Zoning Enabling Act (§ 45-24), RIDEM environmental regulations, APRA public records access (§ 38-2), the Open Meetings Act (§ 42-46), appeals and judicial review, and research workflow portals. Built for legal practitioners working the RI municipal planning context.

**Meeting transcript viewer**
Eight Planning Board hearings transcribed by Whisper and surfaced as readable, searchable written summaries. Each meeting page includes the full markdown transcript, a link to the official video recording, and is indexed for full-text search alongside all other documents.

**Archive browser by file type**
Five category views — PDF, Video, Word, Spreadsheet, Audio — each with scoped search, folder metadata, date, and per-document action buttons: View Markdown (local rendered text) and SharePoint Folder (direct link to the source location). Documents without markdown pairs still appear with SharePoint links so nothing in the inventory is hidden.

---

## How the DGX makes this runnable

| Capability | Role of the DGX |
|------------|------------------|
| **Whisper (audio-transcription)** | PyTorch uses **GPU** when installed with CUDA; large models become feasible for real meeting-length audio. |
| **Marker / future GPU PDF tooling** | **CUDA** drives layout and OCR models at high page rates; scale with **one process per GPU** over split file lists. |
| **Ollama + vision models (SharePoint agent crawl)** | Ollama can bind to **NVIDIA GPUs**; **`llava:7b`** or **`llama3.2-vision:11b`** stay responsive for **browser-use** steps instead of stalling on CPU. |
| **RAM and storage** | Comfortable headroom for **multi-GB** Whisper checkpoints, PyTorch wheels, and browser automation **without** swapping during long jobs. |
| **Linux + display** | Matches the **Playwright** / headed-browser workflows in the runbook (SharePoint sign-in, optional video capture). |

Nothing here *requires* a DGX brand name: any **Linux workstation with NVIDIA GPUs**, sufficient **VRAM** for the chosen Whisper and Ollama models, and **CUDA-compatible PyTorch** gets the same benefits. The DGX is simply the environment this project was exercised against—**uniform drivers**, **multiple GPUs**, and **local inference** without shipping municipal documents to third-party APIs.

---

## Documentation map

| Document | Contents |
|----------|-----------|
| [sharepoint-sync/RUNBOOK.md](https://github.com/fossnik/hackathon3-mar28/blob/main/sharepoint-sync/RUNBOOK.md) | Venv setup, Playwright, Ollama, crawl/download/compare workflows |
| [sharepoint-sync/RI_MUNICIPAL_PLANNING_SOURCES.md](https://github.com/fossnik/hackathon3-mar28/blob/main/sharepoint-sync/RI_MUNICIPAL_PLANNING_SOURCES.md) | RI publishing patterns and scanner scripts |
| [pdf-transcription/README.md](https://github.com/fossnik/hackathon3-mar28/blob/main/pdf-transcription/README.md) | PDF → Markdown on GPU (Marker) and CPU (PyMuPDF4LLM) |
| [audio-transcription/README.md](https://github.com/fossnik/hackathon3-mar28/blob/main/audio-transcription/README.md) | Whisper venv, CLI, and resource notes |

Together, these pieces form a complete pipeline: **mirror** public packet libraries, **transcribe** hearings, **convert** agendas and packets to Markdown, **index** everything for full-text and semantic search, and **serve** it through a public research platform — all accelerated where the hardware allows, and fully accessible at [legal-research.tech](https://legal-research.tech/).
