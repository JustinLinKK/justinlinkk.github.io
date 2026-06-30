---
title: "Emergency Assistant Voice Workflow"
date: 2023-03-20
excerpt: "Early voice-driven LLM workflow that records emergency-call audio, transcribes it with Whisper, summarizes the report with GPT-3.5, flags fake reports, and maps the extracted location.<br/><img src='/images/projects/emergency-assistant/approach.jpg'>"
collection: projects
---

# Project Title: Emergency Assistant Voice Workflow

## Project Overview
Emergency Assistant is an early prototype for turning an emergency-call style voice report into a structured response workflow. The system records audio, transcribes the speech with **Whisper**, sends the transcript into an **OpenAI GPT-3.5** prompt, extracts the key emergency information, checks whether the call looks like a fake report, and uses **Google Maps** to visualize the reported location.

- **GitHub Repository:** [JustinLinKK/Emergency-Assistant](https://github.com/JustinLinKK/Emergency-Assistant)

The project was built in **March 2023**, before I had the now-common vocabulary of **agents** or **voice agents** to describe this kind of system. Looking back, that is the most interesting part of the work: I was already trying to explore how far an LLM workflow could be automated end to end. The pipeline listens, transcribes, reasons over the report, extracts structured fields, decides whether the report should be rejected, and triggers a map action.


## Objectives
- **Voice Input:** Capture spoken emergency reports as audio.
- **Speech-to-Text:** Use Whisper to convert the recording into text.
- **LLM-Based Triage:** Use GPT-3.5 to summarize the call, extract the address and situation, and reject obviously ridiculous reports.
- **Workflow Automation:** Connect transcription, reasoning, report generation, and mapping into one pipeline.
- **Location Output:** Geocode the extracted address and show the incident on a Google Maps view.

## System Flow
The prototype connects several small modules into a single voice-to-action workflow:

```text
Caller speech
  -> audio recording
  -> Whisper transcription
  -> GPT-3.5 emergency report prompt
  -> structured address and situation summary
  -> fake-report check
  -> Google Maps coordinate lookup
  -> map marker for the reported incident
```

This was not a full dispatcher product. It was a proof of concept for whether an LLM could sit in the middle of a practical automation chain and transform unstructured speech into downstream software actions.

## Implementation Details
The repository combines a lightweight Python backend, local audio handling, Whisper transcription, and a browser-facing map page.

- **Audio Capture:** `audio.py` records microphone input with PyAudio, saves `output.wav`, and stops after silence or a maximum recording length.
- **Transcription:** `speechToText.py` loads the `small.en` Whisper model and returns the transcribed text.
- **LLM Processing:** `AItalk.py` sends the transcript to GPT-3.5 with a role prompt asking the model to act as an emergency line worker, summarize the report, extract the address and situation, and return `FAKE REPORT` for unreasonable calls.
- **Address Extraction:** The generated report is parsed for an address field, then passed into the maps layer.
- **Mapping:** `maps.py` uses Google Maps geocoding to obtain latitude and longitude, while `app.py` renders a Flask Google Maps view with a marker at the reported location.
- **Browser Recording Demo:** `index.html` and `js/app.js` include a WebAudioRecorder-based interface for recording voice clips from the browser.

## Why It Mattered
At the time, my goal was not to build a polished voice assistant. I wanted to understand the automation boundary around LLMs:

- Can speech become structured incident data without a human manually filling the form?
- Can a model separate a plausible emergency report from an obviously fake one?
- Can the output of a language model drive the next software step, such as geocoding and map rendering?
- What breaks when the system depends on model formatting, imperfect transcription, and real-world address ambiguity?

That last question was especially useful. The project made clear that LLM workflow automation is not only about calling a model. The hard part is turning model output into reliable program state.

## Retrospective Note
In current terminology, this project looks like a simple **voice agent**:

- a voice input interface,
- an ASR model,
- an LLM reasoning step,
- a tool/action layer,
- and a final user-facing artifact.

But I built it before those labels became the default way I described systems like this. That makes it a useful marker in my own learning path: I was exploring the same core idea behind modern agentic applications, but from a hands-on prototype angle rather than from a formal framework.

## Limitations
- **Prompt Fragility:** Address extraction depended on the model returning fields in a predictable format.
- **Safety Risk:** Emergency workflows require verification, accountability, and human oversight; this prototype should not be treated as a deployable emergency service.
- **Credential Hygiene:** API-backed prototypes need proper secret management before any public or production use.
- **Transcription Error:** Whisper can mishear names, addresses, accents, background noise, or low-quality audio.
- **Fake-Report Detection:** A single LLM prompt is not a reliable fraud classifier; it is only an exploratory signal.

## Outcome
Emergency Assistant became a compact experiment in **voice-driven LLM automation**. It connected speech recognition, language-model reasoning, fake-report handling, and map visualization into one pipeline, giving me an early practical understanding of what later became the standard agent pattern: model reasoning plus tools plus stateful workflow automation.
