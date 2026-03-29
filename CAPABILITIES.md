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

### Web shell (repository root)

- **Vite + React** template for a minimal UI; not required for the Python ingestion pipelines.

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

Together, these pieces support an **on-premise or air-gapped-friendly** path: **mirror** public packet libraries, **transcribe** hearings, **convert** agendas and packets to Markdown, and optionally **agent-navigate** SharePoint—all accelerated where the hardware allows.
