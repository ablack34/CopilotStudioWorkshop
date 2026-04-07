# Copilot Studio Workshop: Automated Monthly Business Reporting

## Overview

This workshop builds an end-to-end automated monthly project reporting pipeline using Microsoft Copilot Studio and Power Automate. The solution consolidates reports from 5 delivery streams into a single executive-level document, saves it to SharePoint, and automates all the logistics around it.

### What You Build

| Component | Type | Purpose |
|-----------|------|---------|
| **Monthly Reports Generator** | Copilot Studio Agent | Reads 5 stream reports, generates consolidated executive report, saves to SharePoint |
| **Monthly Preparation Flow** | Power Automate (Scheduled) | Archives previous month's files, cleans folders, sends reminder emails to stream leads |
| **MBR Input Monitor** | Power Automate (Event-driven) | Detects when all 5 stream reports are uploaded, notifies user to trigger the agent |
| **Check MBR Input (Agent)** | Power Automate (Agent-triggered) | Called by the agent to check how many files are in MBR Input |
| **Save MBR Report to SharePoint** | Power Automate (Agent-triggered) | Called by the agent to save the generated report as a Word document |

### End-to-End Flow

```
 MONTHLY CYCLE
 ─────────────

 1st of Month (Scheduled)
 ┌──────────────────────────────────────────────┐
 │  Monthly Preparation Flow                     │
 │  • Creates archive subfolder (e.g. 2026-03)  │
 │  • Moves MBR Input files → Archive           │
 │  • Moves MBR Output files → Archive          │
 │  • Sends reminder emails to all stream leads  │
 └──────────────────┬───────────────────────────┘
                    │
                    ▼
      Stream leads upload their 5 reports
      to MBR Input (only manual step)
                    │
                    ▼
 ┌──────────────────────────────────────────────┐
 │  MBR Input Monitor Flow                       │
 │  • Triggers on each file upload              │
 │  • Counts files in MBR Input                 │
 │  • If ≥ 5: notifies user "all reports ready" │
 └──────────────────┬───────────────────────────┘
                    │
                    ▼
      User opens agent → says "Generate report"
                    │
                    ▼
 ┌──────────────────────────────────────────────┐
 │  Monthly Reports Generator Agent              │
 │  • Calls Check flow → verifies all files in  │
 │  • Reads all reports (AI-powered)            │
 │  • Generates consolidated executive report   │
 │  • Calls Save flow → saves Word doc          │
 │  • Returns SharePoint link to user           │
 │  • User can ask follow-up questions          │
 └──────────────────────────────────────────────┘
```

### SharePoint Folder Structure

| Folder | Purpose |
|--------|---------|
| **MBR Input** | Stream leads upload their reports here. Agent reads from here. |
| **MBR Output** | Agent saves the consolidated report here. |
| **MBR Archive** | Monthly Preparation Flow archives old files here in dated subfolders (e.g. `2026-03`). |

---

## Prerequisites

- Microsoft 365 account with Copilot licence
- Access to Microsoft Copilot Studio (https://copilotstudio.microsoft.com)
- Access to Power Automate (https://make.powerautomate.com)
- Permission to create SharePoint folders and upload files
- 6 sample files (5 stream reports + 1 previous consolidated report)

---

## Preparation: SharePoint Setup

1. Open **SharePoint** → navigate to your team site (e.g. Mark 8 Project Team).
2. In the **Documents** library, create 3 folders:
   - **MBR Input**
   - **MBR Output**
   - **MBR Archive**
3. Copy the link to each folder — you'll need these throughout.
4. Upload the **5 sample stream reports** and the **previous consolidated report** into **MBR Input**.

### Sample Files

| File | Stream |
|------|--------|
| `UX_March2026.docx` | UX |
| `FrontendDev_March2026.docx` | Frontend Development |
| `BackendDev_March2026.docx` | Backend Development |
| `Integration_March2026.docx` | Integrations |
| `Testing_March2026.docx` | Testing |
| `Previous-Report-February-2026.docx` | Previous month's consolidated report |

---

## Component 1: The Agent — Monthly Reports Generator

### What It Does
- Checks if all 5 stream reports are present in MBR Input
- If yes: reads all reports, generates a consolidated executive report using AI, saves it as a Word document to MBR Output, and returns a SharePoint link
- If no: tells the user how many files are present and asks them to ensure all 5 are uploaded
- After generating, the user can ask follow-up questions about the report content

### Why an Agent?
An agent can **read and understand** documents — a flow cannot. The agent reads 5 reports, interprets risks/blockers/status changes, compares to the previous month, and writes an executive summary. This is the work that previously took a human analyst hours. The flows handle logistics (moving files, sending emails, counting files), but the agent handles the **thinking**.

### Step 1: Create the Agent

1. Go to **https://copilotstudio.microsoft.com**.
2. Click **+ Create** → **New agent**.
3. Click **"Skip to configuration"**.
4. Fill in:

| Field | Value |
|-------|-------|
| **Name** | `Monthly Reports Generator` |
| **Description** | `Analyzes monthly project reports across delivery streams, summarizes the current state, and highlights key changes, risks, and escalations compared to the previous report.` |

5. In **Instructions**, paste the following:

```
ROLE
You are a project reporting analysis agent for a multi-stream application development program.

GOAL
Summarize the current reporting period across all provided documents into a consolidated report, then compare that report to the previous period's report to identify key changes.

CONTEXT
The project is organized into delivery streams:
- UX
- Frontend Development
- Backend Development
- Integrations
- Testing

Each stream report follows a structured format including:
- Status
- Top Risks
- Blockers
- Leadership Asks
- Delayed Tasks
- Summary / Outlook

You will be given:
1) Multiple documents for the current reporting period (one per stream)
2) One consolidated report from the previous reporting period

TASKS
1. Summarization
   - Create a concise consolidated report for the current period.
   - Preserve stream separation.
   - Capture only material information (no verbatim copying).
   - Normalize terminology so items can be compared across months.

2. Comparison
   Compare the current consolidated report against the previous report and identify key changes, focusing on:
   - New risks, blockers, leadership asks, or delayed tasks
   - Removed or resolved items
   - Material changes to existing items (scope, severity, ownership, or timeline)
   - Status changes (e.g., GREEN → AMBER, AT RISK → MISSED)
   - Escalations and de-escalations
   - New dependencies or critical-path impacts

COMPARISON RULES
- Treat items as "the same" if they refer to the same underlying issue, even if wording differs.
- Do not invent changes — if an item cannot be confidently matched, mark it as "New".
- Ignore cosmetic or editorial differences.
- Focus on leadership-relevant change, not minor delivery detail.

OUTPUT FORMAT
1. Executive Summary (max 6 bullets)
   - The most important changes since the previous report
   - What worsened, what improved, and what is newly critical

2. Change Log by Stream
   For each stream:
   - New Items
   - Modified Items
   - Resolved / Removed Items

   Use this structure:
   - Item
   - Change Type (New / Modified / Resolved)
   - Previous State
   - Current State
   - Impact / Why It Matters

3. Cross-Stream Observations
   - Changes that affect multiple streams
   - Emerging systemic risks or bottlenecks
   - Downstream impacts (e.g., UX delays affecting Frontend)

4. Open Leadership Attention
   - Net-new or escalated asks
   - Decisions or approvals now on the critical path

TONE AND STYLE
- Clear, factual, and concise
- Executive-friendly
- No speculation
- No recommendations unless explicitly supported by the reports

WHEN INPUT FILES ARE MISSING
- If the MBR Input folder is empty or does not contain all 5 stream reports, do NOT attempt to generate a report.
- Tell the user which reports are missing based on the expected streams: UX, Frontend Development, Backend Development, Integrations, Testing.
- If the previous period's consolidated report is missing, note that the comparison section cannot be generated but the summarization can still proceed if all 5 current stream reports are present.
```

### Step 2: Add Knowledge Sources

1. Scroll to **Knowledge** → click **+ Add knowledge**.
2. Select **SharePoint** → paste the link to your **MBR Input** folder → confirm.
3. Add another knowledge source → paste the link to your **MBR Output** folder → confirm.

### Step 3: Create the "Check MBR Input (Agent)" Flow

This flow is called by the agent to check how many files are in MBR Input.

**Build in Power Automate:**

| Step | Action | Configuration |
|------|--------|---------------|
| 1 | **Run a flow from Copilot** (trigger) | No inputs |
| 2 | **SharePoint — Get files (properties only)** | Site: your site, Library: Documents, Folder: `Shared Documents/MBR Input` |
| 3 | **Compose** (rename to `FileCount`) | Expression: `length(outputs('Get_files_(properties_only)')?['body/value'])` |
| 4 | **Respond to Copilot** | Output: `FileCount` (Number) = `outputs('FileCount')` |

Save the flow.

### Step 4: Create the "Save MBR Report to SharePoint" Flow

This flow saves the agent's generated report as a Word document.

**Build in Power Automate:**

| Step | Action | Configuration |
|------|--------|---------------|
| 1 | **Run a flow from Copilot** (trigger) | Input: `ReportContent` (Text) |
| 2 | **SharePoint — Create file** | Site: your site, Folder: `Shared Documents/MBR Output`, File name: `MBR-Report-@{formatDateTime(utcNow(),'yyyy-MM')}.docx`, Content: `ReportContent` input |
| 3 | **Respond to Copilot** | Output: `FileLink` (Text) = Link to item from Create file step |

Save the flow.

### Step 5: Add Both Flows as Actions in the Agent

1. In Copilot Studio, open the agent → go to **Actions**.
2. Click **+ Add an action** → find **Check MBR Input (Agent)** → add it.
3. Click **+ Add an action** → find **Save MBR Report to SharePoint** → add it.

### Step 6: Create the "Generate Monthly Report" Topic

1. Go to **Topics** → **+ Add a topic** → **From blank**.
2. **Trigger:** Keep as "The agent chooses".
3. **Description:** `Checks if all 5 stream reports are uploaded to the MBR Input folder and generates the consolidated monthly report if they are present.`

**Build the topic canvas:**

```
[Trigger] The agent chooses
    │
    ▼
[Call an action] Check MBR Input (Agent)
    │ Returns: FileCount
    ▼
[Condition] FileCount is greater than or equal to 5
    │
    ├─ YES:
    │   ├─ [Message] "All reports found. Generating your consolidated report now..."
    │   ├─ [Create generative answers]
    │   │    Input: "Create the consolidated monthly report following your
    │   │    instructions. Use all stream reports and the previous report
    │   │    from the MBR Input folder."
    │   │    Data sources: MBR Input SharePoint folder
    │   │    Save output to variable: ReportOutput
    │   ├─ [Call an action] Save MBR Report to SharePoint
    │   │    Map ReportContent = ReportOutput.Text
    │   │    Returns: FileLink
    │   └─ [Message] "Your report has been saved to SharePoint: {FileLink}"
    │
    └─ NO:
        └─ [Message] "Only {FileCount} file(s) found in MBR Input.
            Please ensure all 5 stream reports are uploaded before
            generating the report."
```

**Key details for the canvas:**
- The `ReportOutput` variable is created automatically when you add the generative answers node — click the node's **...** menu to see variable properties.
- When mapping `ReportContent` in the Save flow action, select `ReportOutput.Text` (the text content property of the record).
- For the final message, insert the `FileLink` variable using the **{x}** button in the message toolbar — don't type it as plain text.

### Step 7: Test the Agent

1. Click **Test your agent** in the top right.
2. Type: `Generate report`
3. Expected result:
   - Agent calls the check flow
   - Reports "All reports found" (if 5+ files are in MBR Input)
   - Generates the consolidated report
   - Saves it to MBR Output
   - Returns a SharePoint link
4. Click the link to verify the document is in SharePoint.
5. Ask follow-up questions: `What are the top risks?`, `What changed since last month?`

**To test the missing files scenario:** Remove a file from MBR Input, type `Generate report` again — the agent should report the file count and ask for uploads.

---

## Component 2: Monthly Preparation Flow (Scheduled)

### What It Does
- Runs on a schedule (e.g., 1st of each month)
- Archives all files from MBR Input and MBR Output into a dated subfolder in MBR Archive
- Sends reminder emails to all stream leads asking them to upload their reports

### Why It's Needed
Using the same MBR Input and MBR Output folders every month means all agents and flows always reference the same paths. This flow cleans up the previous month's files and prompts the new cycle to begin.

### Flow Structure

```
[Trigger] Recurrence — 1 Month
    │
    ▼
[SharePoint — Create new folder]
    Site: your site
    List or Library: Documents
    Folder Path: MBR Archive/{formatDateTime(utcNow(),'yyyy-MM')}
    │
    ▼
[SharePoint — Get files (properties only)] from MBR Input
    │
    ▼
[Apply to each] file from MBR Input
    └─ [SharePoint — Move file]
        File to Move: {Identifier}  ← NOT the full Body object
        Destination: Shared Documents/MBR Archive/{yyyy-MM}/{FilenameWithExtension}
    │
    ▼
[SharePoint — Get files (properties only)] from MBR Output
    │
    ▼
[Apply to each] file from MBR Output
    └─ [SharePoint — Move file]
        File to Move: {Identifier}
        Destination: Shared Documents/MBR Archive/{yyyy-MM}/{FilenameWithExtension}
    │
    ▼
[Office 365 Outlook — Send an email (V2)]
    To: all stream lead email addresses
    Subject: Action Required: Submit Your Monthly Stream Report
    Body: Instructions with link to MBR Input folder and deadline
    (Use rich text editor toolbar to insert clickable links)
```

### Common Issues and Fixes

| Issue | Fix |
|-------|-----|
| **Move file fails with "file name too long"** | The "File to Move" field has the full Body object instead of just `{Identifier}`. Select **Identifier** from dynamic content. |
| **Move file fails with "destination not found"** | The destination path is missing `Shared Documents/` prefix. Use `Shared Documents/MBR Archive/...` |
| **Move file fails with "source not found"** | The archive subfolder doesn't exist yet. Make sure the **Create new folder** step runs before the Apply to each loops. |
| **Email shows raw HTML** | Use the rich text editor in the Body field to format the email. Insert links using the link icon (🔗) in the toolbar. Don't paste HTML tags directly. |

---

## Component 3: MBR Input Monitor Flow (Event-Driven)

### What It Does
- Triggers every time a file is uploaded to MBR Input
- Counts the files in the folder
- When all 5 (or more) files are present, sends a notification: "All reports are in — generate your report"

### Why It's Needed
Stream leads upload at different times. Instead of someone manually checking "are all reports in yet?", this flow watches automatically and notifies the moment everything is ready.

### Flow Structure

```
[Trigger] SharePoint — When a file is created (properties only)
    Site: your site
    Library: Documents
    Folder: MBR Input
    │
    ▼
[SharePoint — Get files (properties only)] from MBR Input
    │
    ▼
[Compose: FileCount]
    Expression: length(outputs('Get_files_(properties_only)')?['body/value'])
    │
    ▼
[Condition] FileCount >= 5
    │
    ├─ YES → [Send an email / Post to Teams]
    │         "All 5 stream reports received. Open the Monthly Reports
    │          Generator agent and say 'Generate report' to create
    │          the consolidated monthly business report."
    │
    └─ NO  → (do nothing)
```

---

## How It All Connects

### Automatic Path (monthly cycle)
```
Preparation Flow runs (1st of month)
  → Archives old files, sends reminders
  → Stream leads upload reports over the next few days
  → Monitor Flow detects each upload
  → When all 5 are in → sends notification
  → User opens agent → says "Generate report"
  → Agent checks, generates, saves → done
```

### Manual Path (on-demand)
```
User opens agent at any time
  → Says "Generate report"
  → Agent checks if files are present
  → If yes → generates and saves
  → If no → tells user what's missing
```

### Why the Agent Matters
| Without agent | With agent |
|---|---|
| Someone reads 5 reports manually | AI reads and synthesises in seconds |
| Inconsistent formatting each month | Standardised executive format every time |
| Manual comparison to previous month | Automated change detection and comparison |
| Hours of analyst work | Seconds |
| Static document — no Q&A | User can ask follow-up questions |

The flows handle **logistics** (move files, count files, send emails). The agent handles **thinking** (read, understand, compare, write). You need both.

---

## Testing Checklist

| Test | Expected Result |
|------|----------------|
| Upload 5 files to MBR Input | Monitor Flow triggers, notification sent when 5th file arrives |
| Open agent, say "Generate report" with files present | Agent checks files, generates report, saves to SharePoint, returns link |
| Open agent, say "Generate report" with empty folder | Agent reports "0 files found", asks user to upload |
| Ask "What are the top risks?" after report generation | Agent answers from the report content |
| Run Preparation Flow | Files moved to archive, MBR Input/Output emptied, emails sent |
| Check MBR Archive after Preparation Flow | Dated subfolder exists with archived files |
| Click SharePoint link from agent response | Opens the saved Word document |
