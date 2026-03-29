# Planning Board Meeting Transcript Summaries

This directory contains structured summaries of Planning Board meeting transcripts extracted from TSV files.

## Purpose

These summaries are designed to support legal research and strategy development by:
- Identifying key development projects discussed
- Extracting voting records and member positions
- Highlighting legal and procedural issues
- Tracking discussions about specific projects (especially Belton Court)
- Documenting public comments and concerns

## Organization

Summaries and full transcripts are organized by year:
```
meeting-transcripts/
├── 2023/
│   ├── 2023-03-07-summary.md
│   ├── 2023-03-07-transcript.tsv      # Full transcript
│   ├── 2023-04-04-summary.md
│   ├── 2023-04-04-transcript.tsv      # Full transcript
│   ├── 2023-07-11-summary.md
│   ├── 2023-07-11-transcript.tsv      # Full transcript
│   ├── 2023-10-03-summary.md
│   └── 2023-10-03-transcript.tsv      # Full transcript
├── 2024/
│   ├── 2024-07-09-summary.md
│   ├── 2024-07-09-transcript.tsv      # Full transcript
│   ├── 2024-11-05-summary.md
│   └── 2024-11-05-transcript.tsv      # Full transcript
├── 2026/
│   ├── 2026-02-03-transcript.txt      # Feb 3, 2026 hearing (plain text, no timestamps)
│   └── 2026-03-03-transcript.txt      # Mar 3, 2026 hearing (plain text, no timestamps)
└── README.md
```

Each meeting has both:
- **Summary** (`*-summary.md`): Structured markdown summary with key points
- **Transcript** (`*-transcript.tsv`): Full timestamped transcript in TSV format

## Summary Format

Each summary includes:
1. **Meeting Information**: Date, type, duration, members present
2. **Projects Discussed**: All development projects mentioned
3. **Key Discussion Points**: Important segments from the transcript
4. **Voting Activity**: Voting-related segments identified
5. **Legal Strategy Notes**: 
   - Belton Court / Middle Highway mentions
   - Comprehensive permit discussions
   - Other legally relevant information

## Source Files

**2023–2024 transcripts**: Generated from Town-provided audio/video; stored as `.tsv` (timestamped Whisper output).
- Source of truth: `sources/scraped/planning-board/meeting-packets/[YEAR]/[Meeting Folder]/[filename].tsv`
- Copies alongside summaries: `documentation/research/planning-board/meeting-transcripts/[YEAR]/[date]-transcript.tsv`

**2026 transcripts**: **Personally recorded by the project researcher at the public hearings** (not Town-provided). Stored as `.txt` (plain-text Whisper output, no timestamps). The original `.m4a` and `.mp3` audio files are retained in `/tmp/Untitled Folder/` (not committed to the project).
- Source copy: `sources/scraped/planning-board/meeting-packets/2026/[Meeting Folder]/[date]-[time].txt`
- Documentation copy: `documentation/research/planning-board/meeting-transcripts/2026/[date]-transcript.txt`

## Generated Summaries

### 2023 Meetings

- **2023-03-07**: March 7, 2023 Regular Meeting
  - 5,221 segments processed
  - Duration: 186 minutes
  - Source: `PB_03-07-2023.tsv`
  - Projects discussed: Belton Court, Chipotle, Watson Avenue, 17 Lorraine

- **2023-04-04**: April 4, 2023 Regular Meeting
  - 2,337 segments processed
  - Source: `PB Regular Meeting 04-04-2023.tsv`

- **2023-07-11**: July 11, 2023 Meeting
  - 1,502 segments processed
  - Source: `2023-07-11-18-59-59.tsv`

- **2023-10-03**: October 3, 2023 Meeting
  - 2,218 segments processed
  - Source: `Planning Board 10-03-2023 Audio.tsv`

### 2026 Meetings ⭐ BELTON COURT PUBLIC HEARINGS

- **2026-02-03**: February 3, 2026 Public Hearing — Belton Court Comprehensive Permit
  - Source: **Personal recording by project researcher** (not Town-provided)
  - Original file: `Feb 3 at 7-04 PM.m4a / .mp3`; transcript: `.txt` (plain text, no timestamps)
  - Source copy: `sources/scraped/planning-board/meeting-packets/2026/02 February 03 2026 Meeting/2026-02-03-19-04-00.txt`
  - 2,066 lines; Whisper transcription of audio recorded at the hearing
  - Summary: `2026-02-03-summary.md` ✅

- **2026-03-03**: March 3, 2026 Planning Board Meeting — Belton Court continued
  - Source: **Personal recording by project researcher** (not Town-provided)
  - Original file: `Mar 3 at 6-45 PM.m4a / .mp3`; transcript: `.txt` (plain text, no timestamps)
  - Source copy: `sources/scraped/planning-board/meeting-packets/2026/03 March 03 2026 Meeting/2026-03-03-18-45-00.txt`
  - 1,244 lines; Whisper transcription of audio recorded at the hearing
  - Summary: `2026-03-03-summary.md` ✅

### 2024 Meetings

- **2024-07-09**: July 9, 2024 Meeting
  - 1,859 segments processed
  - Source: `2024-07-09-19-27-57.tsv`

- **2024-11-05**: November 5, 2024 Meeting
  - 1,400 segments processed
  - Source: `2024-11-05-20-36-05.tsv`

## Notes

- All meetings listed above have been successfully processed and summarized.

## Related Documentation

- **Best Practices**: `documentation/references/MEETING_SUMMARY_BEST_PRACTICES.md`
- **Voting Analysis**: `documentation/research/planning-board/voting-analysis/`
- **Meeting Index**: `documentation/research/planning-board/meeting-index/`
- **Meeting Packets**: `sources/scraped/planning-board/meeting-packets/`

## Script

Summaries are generated using:
- `scripts/analysis/summarize_meeting_transcripts.py`

Usage:
```bash
python scripts/analysis/summarize_meeting_transcripts.py <tsv_file> [output_dir]
```

## Integration

These summaries integrate with:
- **OSINT Research**: Member profiles and positions
- **Voting Records**: Structured voting data
- **Legal Strategies**: Arguments and precedents
- **Project Tracking**: Development project timelines

