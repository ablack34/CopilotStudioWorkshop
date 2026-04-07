# Workshop Summary: What Each Exercise Produces and Why

This document summarises the output and business value of each exercise in the Copilot Studio workshop, with references back to the original workshop instructions.

---

## The Big Picture

The 5 exercises build an **end-to-end automated monthly reporting pipeline**. Each exercise adds one link in the chain. When combined, they replace what is typically a manual, error-prone, multi-day process with something that runs largely on its own.

```
Ex 4: Prepare folders  →  Ex 5: Send reminders  →  Stream leads upload  →  Ex 3: Detect completion  →  Ex 1/2: Generate report
   (scheduled)              (automated)              (manual)                (event-driven)              (AI-powered)
```

---

## Exercise 1: Create Monthly Business Report in Agent Builder

### What It Produces
A **Copilot agent** (built in Agent Builder) that reads the 5 stream reports and the previous month's consolidated report from a SharePoint folder, then generates:

- An **Executive Summary** (max 6 bullets) of what changed
- A **Change Log by Stream** showing new, modified, and resolved items
- **Cross-Stream Observations** highlighting systemic risks and dependencies
- **Open Leadership Attention** items requiring decisions

The output appears **in the chat window** — it is not saved as a document.

### Why It's Beneficial
| Without this | With this |
|---|---|
| Someone manually reads 5 separate reports and writes a summary | The agent reads, consolidates, and compares automatically |
| Inconsistent formatting across months | Standardised output format every time |
| Comparison to previous month requires opening two documents side-by-side | Agent performs the comparison and highlights only material changes |
| Hours of work per reporting cycle | Minutes |

### Reference to Original Instructions
> *"Creation of an initial draft for the monthly project report, structuring and summarizing all shared content."*
>
> *"Using a Copilot agent to create monthly reports is faster and more reliable than manual work, as it automates data collection and comparison across streams."*

### Limitation Identified
The output lives only in the chat window — it cannot be easily shared with stakeholders or archived. This is addressed in Exercise 2.

---

## Exercise 2: Create Monthly Business Report in Copilot Studio

### What It Produces
The same agent as Exercise 1, but **moved into Copilot Studio** where it gains the ability to:

1. **Save the consolidated report as a Word document** in the MBR Output SharePoint folder
2. Be **triggered by other flows** (not just manual chat interaction)

The concrete output is a `.docx` file in SharePoint containing the full consolidated report with comparison.

### Why It's Beneficial
| Without this | With this |
|---|---|
| Report exists only in a chat thread — hard to find later | Report is saved as a Word document in a known SharePoint location |
| Sharing requires copy-pasting from chat | Stakeholders can access the document directly via SharePoint |
| No audit trail or version history | SharePoint provides versioning and access logs |
| Agent can only run when someone types a prompt | Agent can be triggered programmatically by other flows |

### Reference to Original Instructions
> *"In Agent Builder, the output is part of the chat window. However, this is not the best to share with others and keep an archive. Therefore, output as a document that is saved in SharePoint is better."*
>
> *"The agent should save a new Word document in the MBR Output folder."*

### Key Technical Difference from Exercise 1
Agent Builder = conversational AI only. Copilot Studio = conversational AI **+ actions** (write files, call APIs, trigger flows). This exercise demonstrates why Studio is needed for production workflows.

---

## Exercise 3: Check for Input Documents and Trigger Report Generation

### What It Produces
A **Power Automate cloud flow** that:

1. **Triggers automatically** whenever a file is uploaded to the MBR Input SharePoint folder
2. **Counts the files** in the folder and checks if all 5 required stream reports are present (looking for "UX", "FrontendDev", "BackendDev", "Integration", "Test" in the file names)
3. **If all files are present:** notifies the project lead and/or triggers the report-generation agent from Exercise 2
4. **If not all files are present:** does nothing (waits for the remaining files)

### Why It's Beneficial
| Without this | With this |
|---|---|
| Someone has to manually check "have all 5 reports been uploaded yet?" — possibly multiple times a day | The system checks automatically on every upload |
| Report generation doesn't start until someone notices all files are in | Report generation starts immediately once the last file arrives |
| Risk of generating an incomplete report (e.g., missing one stream) | The file-name validation ensures all streams are accounted for |
| Manual coordination between stream leads and the PMO | Zero coordination needed — the system handles the handoff |

### Reference to Original Instructions
> *"Have a flow that regularly checks if all required documents are in the MBR input folder."*
>
> *"The agent should be triggered when all 5 files from each stream are available in the MBR Input folder."*
>
> Agent instructions: *"There needs to be files with the following text in the file name: 'UX', 'FrontendDev', 'BackendDev', 'Integration', and 'Test'"*

---

## Exercise 4: Prepare Folders for the New Monthly Report

### What It Produces
A **scheduled Power Automate cloud flow** that runs on a set day each month (e.g., the 1st) and:

1. **Creates a dated archive subfolder** (e.g., `MBR Archive/2026-03`)
2. **Moves all files** from MBR Input into the archive folder
3. **Moves all files** from MBR Output into the archive folder
4. **(Optionally) copies the previous consolidated report** back into MBR Input so the next cycle's agent has it for comparison

After running, MBR Input and MBR Output are clean and ready for the new reporting period.

### Why It's Beneficial
| Without this | With this |
|---|---|
| Old files pile up in the input folder, confusing agents and users | Folders are clean at the start of each cycle |
| Someone has to manually archive and organise files | Archiving is automatic and consistent |
| If folder paths change, every agent and flow needs updating | Same folders are reused every month — all automations keep working |
| Risk of the agent processing stale data from a previous month | Only current-period files are in the input folder |
| No organised archive of past reports | Monthly archive folders provide a clear historical record |

### Reference to Original Instructions
> *"It's better to have the same input and output folder for the files as this allows other agents to work with the same folders all the time. Thus, we save previous input to an archive folder and empty the MBR Input folder. This also allows agents from the streams to always save their files in this folder."*
>
> *"Understand that sometimes preparation steps are needed for agents and flows to run."*

---

## Exercise 5: Send Email/Chat Message to Gather Input

### What It Produces
A **Power Automate cloud flow** that automatically sends an **email** (and optionally a **Teams message**) to all 5 stream leads, containing:

- A clear request to submit their monthly stream report
- The **deadline** for submission
- A **direct link** to the MBR Input SharePoint folder where they should upload
- Instructions on the expected file naming and format

This flow can be triggered on a schedule (e.g., the 1st of each month, right after Exercise 4 runs) or chained directly to the folder-preparation flow.

### Why It's Beneficial
| Without this | With this |
|---|---|
| Someone manually sends 5 emails each month | Emails are sent automatically with zero effort |
| Risk of forgetting to notify someone | Every stream lead is notified every time |
| Inconsistent instructions or missing folder links | Standardised message with embedded folder link |
| No deadline communicated | Automated deadline calculation included |
| Manual follow-up for late submissions | Can be extended with an automatic follow-up reminder |

### Reference to Original Instructions
> *"Send reminders to project members so they provide their input."*
>
> *"Automate recurring communication to project members, requesting their input for the monthly report."*
>
> *"Include instructions and a link to the input folder."*

---

## How the Exercises Connect (End-to-End Flow)

| Step | Exercise | Trigger | Output | Feeds Into |
|------|----------|---------|--------|------------|
| 1 | **Ex 4** — Prepare Folders | Scheduled (1st of month) | Clean MBR Input & Output folders; archive of previous month | Ex 5 |
| 2 | **Ex 5** — Send Reminders | After folder prep (or scheduled) | Emails/Teams messages to stream leads | Stream leads upload files |
| 3 | *(Manual)* | Stream leads receive reminders | 5 stream reports uploaded to MBR Input | Ex 3 |
| 4 | **Ex 3** — Monitor Folder | File added to MBR Input | Validation that all 5 reports are present | Ex 2 |
| 5 | **Ex 2** — Generate Report | Triggered by Ex 3 (or manual) | Consolidated Word document saved to MBR Output | Stakeholders |
| — | **Ex 1** | Manual (chat prompt) | Same report, but in chat only | Used for learning/prototyping |

### Total Manual Effort After Automation
The only manual step remaining is **stream leads uploading their reports** — everything else runs automatically.

---

## Key Takeaways for Leadership

1. **Ex 1 → Ex 2 progression** shows the difference between a prototype (chat-only) and a production-ready solution (saves documents). Always start simple, then enhance.

2. **Ex 3** eliminates the "are we ready yet?" coordination overhead. The system knows when it has everything it needs.

3. **Ex 4** ensures the system is **self-resetting** — it prepares itself for the next cycle without human intervention.

4. **Ex 5** removes the **communication burden** from the PMO. Reminders go out reliably, on time, every month.

5. **Together**, these exercises demonstrate that Copilot Studio can handle the **full lifecycle** of a recurring business process — not just the AI-powered analysis, but also the file management, monitoring, communication, and scheduling around it.
