# Copilot Studio Workshop: Automating Monthly Project Reporting

## Overview

This workshop guides you through practical exercises to build agents and workflows in Copilot Studio. Each exercise focuses on automating or enhancing a step in the monthly project reporting process.

By the end of this workshop, you will have built an end-to-end automated reporting pipeline that:
1. Notifies stream leads to submit their reports
2. Monitors a SharePoint folder for incoming reports
3. Automatically generates a consolidated monthly business report when all inputs arrive
4. Saves the output as a Word document in SharePoint
5. Prepares folders for the next reporting cycle

**Estimated Duration:** 3–4 hours (all exercises)

**What You Need Before Starting:**
- A Microsoft 365 account with access to Copilot
- Access to Microsoft Copilot Studio (https://copilotstudio.microsoft.com)
- Permission to create SharePoint folders and upload files
- The 6 sample files provided with this workshop (5 stream reports + 1 previous consolidated report)

---

## Preparation: Set Up SharePoint Folders and Upload Sample Files

Before starting the exercises, set up the SharePoint folders and files you will use throughout the workshop.

### Step 1 — Create SharePoint Folders

1. Open **SharePoint** in your browser and navigate to a site you have edit access to (e.g., your team site).
2. Go to **Documents** (or any document library).
3. Click **+ New > Folder** and create a folder named: **MBR Input**
4. Click **+ New > Folder** again and create a folder named: **MBR Output**
5. Click **+ New > Folder** again and create a folder named: **MBR Archive**
6. Copy the link to each folder:
   - Click on the **MBR Input** folder, click the **(i)** information icon or right-click and select **Details**, then copy the direct link/URL.
   - Repeat for **MBR Output** and **MBR Archive**.
7. Save these 3 links — you will need them in multiple exercises.

### Step 2 — Prepare Sample Files

Convert the 6 sample Markdown files provided with this workshop into **.docx** (Word) format. You can do this by:
- Opening each `.md` file, copying the content into a new Word document, and saving it as `.docx`
- Or using any Markdown-to-Word converter

The files are:
| File | Purpose |
|------|---------|
| `UX-Stream-Report.docx` | Current month — UX stream input |
| `Frontend-Stream-Report.docx` | Current month — Frontend stream input |
| `Backend-Stream-Report.docx` | Current month — Backend stream input |
| `Integrations-Stream-Report.docx` | Current month — Integrations stream input |
| `Testing-Stream-Report.docx` | Current month — Testing stream input |
| `Previous-Report-February-2026.docx` | Previous month's consolidated report |

### Step 3 — Upload Sample Files

1. Upload the **5 stream report files** into the **MBR Input** folder.
2. Upload the **Previous-Report-February-2026.docx** file also into the **MBR Input** folder (the agent will use it for comparison).

> **Tip:** Do NOT upload all 5 files yet if you plan to test Exercise 3 (the trigger flow). For Exercise 1 and 2, you can upload them all at once.

---

## Exercise 1: Create Monthly Business Report Agent in Agent Builder

### Goal
- **Technical:** Understand what you can do with Copilot Agent Builder and where Copilot Studio is needed.
- **Content:** Create a summary of multiple input files and compare the new report to a previous one.

### Why
Using a Copilot agent to create monthly reports is faster and more reliable than manual work, as it automates data collection and comparison across streams. The agent ensures consistent formatting and reduces errors, even as project complexity grows. It frees up team members to focus on analysis and decision-making instead of repetitive tasks.

### Introduction
In this exercise, you will create an agent in Copilot (Agent Builder) that reads all stream reports from a SharePoint folder, consolidates them into a single report, and compares the result to the previous month's report. The output will appear directly in the chat window — later exercises will improve on this.

### Prerequisites
- The 6 sample files uploaded to your **MBR Input** SharePoint folder (see Preparation above)
- Access to Microsoft 365 Copilot (https://m365.cloud.microsoft/copilot)

### Steps

#### 1. Open Copilot and Create an Agent
1. Go to **https://m365.cloud.microsoft/copilot** in your browser.
2. In the right sidebar, click **Agents** (the icon that looks like a small robot/sparkle).
3. Click **"+ New Agent"** (or **"Create Agent"**).
4. You will see a conversational setup wizard. Click **"Skip to configuration"** at the bottom right of the chat input area to go directly to the configuration form.

#### 2. Configure the Agent Identity
Fill in the following fields:

| Field | Value |
|-------|-------|
| **Name** | `Monthly Reports Generator` |
| **Description** | `Analyzes monthly project reports across delivery streams, summarizes the current state, and highlights key changes, risks, and escalations compared to the previous report.` |

#### 3. Add Instructions
In the **Instructions** field, paste the following prompt:

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
```

#### 4. Add Knowledge Sources
1. Scroll down to the **Knowledge** section.
2. Click **"+ Add knowledge"**.
3. Select **SharePoint** as the source type.
4. Paste the link to your **MBR Input** folder and confirm.
5. Click **"+ Add knowledge"** again.
6. Paste the link to your **MBR Output** folder and confirm.

> **Why both folders?** The agent reads input from MBR Input and, in later exercises, will reference output stored in MBR Output.

#### 5. Add a Suggested Prompt
1. Scroll down to the **Starters** (or **Conversation starters** / **Suggested prompts**) section.
2. Click **"+ Add starter"**.
3. Set the **Title** to: `Monthly Report`
4. Set the **Message** to: `Create a monthly report by summarizing all stream reports in the MBR Input folder and comparing the consolidated result to the previous month's report.`

#### 6. Create and Test the Agent
1. Click **"Create"** in the top right corner. Wait for the agent to be provisioned (this may take 30–60 seconds).
2. Once created, you will see the agent's chat interface.
3. Click the **"Monthly Report"** suggested prompt (or type the message manually).
4. The agent will read the files from your SharePoint folder and generate a consolidated report with comparison in the chat window.

#### 7. Review the Output
Check that the agent's response includes:
- An **Executive Summary** with the most important changes
- A **Change Log by Stream** showing new, modified, and resolved items
- **Cross-Stream Observations** (e.g., the staging environment blocker affecting Backend, Integrations, and Testing)
- **Open Leadership Attention** items (e.g., SAP escalation, budget approvals)

> **Discussion point:** Notice that the output appears only in the chat window. This is useful for quick analysis, but not ideal for sharing with stakeholders or archiving. Exercise 2 addresses this limitation.

---

## Exercise 2: Create Monthly Business Report Agent in Copilot Studio

### Goal
- **Technical:** Understand the differences between Agent Builder and Copilot Studio. In Agent Builder, the output is part of the chat window. In Copilot Studio, we can add actions — such as saving the report as a Word document to SharePoint.
- **Content:** Same as Exercise 1 — create a summary of multiple input files and compare the new report to a previous one, but now save the result as a document.

### Introduction
In this exercise, you move your agent from the basic Agent Builder into Copilot Studio, where you can add powerful actions like writing files to SharePoint. The agent will generate the same consolidated report, but save it as a Word document in your MBR Output folder.

### Prerequisites
- Your **Monthly Reports Generator** agent from Exercise 1
- Access to Copilot Studio (https://copilotstudio.microsoft.com)
- The **MBR Output** SharePoint folder link

### Steps

#### 1. Open Your Agent for Editing
1. In Microsoft 365 Copilot, locate your **Monthly Reports Generator** agent in the right sidebar under **Agents**.
2. Hover over the agent name and wait for the **three dots (...)** menu to appear.
3. Click the **three dots** and select **"Edit"**.

#### 2. Copy the Agent to Copilot Studio
1. Once the agent editor loads, click the **three dots (...)** overflow menu at the **top right** of the screen.
2. Select **"Edit in Copilot Studio"** (or **"Copy to Copilot Studio"**).
3. If prompted, select your **environment** (e.g., your default environment or a sandbox).
4. Wait for Copilot Studio to open in a new browser tab with your agent loaded.

#### 3. Verify the Agent Configuration
In Copilot Studio, verify that all sections from your Agent Builder configuration carried over:
1. **Name** — should be "Monthly Reports Generator"
2. **Description** — should match what you entered
3. **Instructions** — the full prompt should be present
4. **Knowledge** — your SharePoint folder links should appear

> If any section is missing, re-enter the values from Exercise 1.

#### 4. Create an Action to Save the Report as a Word Document

This is the key enhancement over Exercise 1. You will create a Power Automate cloud flow that takes the agent's generated report text and saves it as a Word document in SharePoint.

##### 4a. Add a New Topic
1. In Copilot Studio, go to the **Topics** section in the left navigation.
2. Click **"+ Add a topic"** > **"From blank"**.
3. Name the topic: `Save Report to SharePoint`
4. Add trigger phrases:
   - `Save report`
   - `Save the report to SharePoint`
   - `Create report document`
   - `Generate and save report`

##### 4b. Add a Message Node to Generate the Report
1. In the topic canvas, add a **Message** node.
2. In the message, write: `Generating your consolidated monthly report...`
3. Add a **Question** node after the message (optional — to confirm save):
   - Question text: `The report has been generated. Would you like me to save it as a Word document in the MBR Output folder?`
   - Set the response type to **Boolean (Yes/No)**.
   - Store the response in a variable named `ConfirmSave`.

##### 4c. Create the Power Automate Flow
1. Add a condition node: **If** `ConfirmSave` **equals** `Yes`, then:
2. Click **"+"** to add a node > select **"Call an action"** > **"Create a flow"**.
3. Power Automate will open within Copilot Studio. Build the flow as follows:

**Flow Name:** `Save MBR Report to SharePoint`

**Flow Steps:**

| Step | Action | Details |
|------|--------|---------|
| 1 | **Trigger** | "Run a flow from Copilot" (auto-configured). Add an input parameter: **ReportContent** (type: Text) |
| 2 | **Create file** | Connector: **SharePoint** — Action: **Create file**. Site Address: *(select your SharePoint site)*. Folder Path: `/MBR Output`. File Name: `Monthly-Report-[utcNow('yyyy-MM')].docx`. File Content: Use the **ReportContent** input from step 1. |
| 3 | **Return value(s) to Copilot** | Return a text variable **FileLink** with the value: the **Link to item** output from the Create file step. |

> **Note on .docx format:** The SharePoint "Create file" action with a `.docx` extension and plain text content will create a basic Word document. For richer formatting, you can use the **Populate a Microsoft Word template** action instead. For this workshop, plain text is sufficient.

4. **Save** the flow and return to Copilot Studio.
5. Back in the topic canvas, map the **ReportContent** input to the agent's generated content (the response variable from the report generation step).
6. Add a final **Message** node: `Your report has been saved to SharePoint. [Link to document]` — insert the **FileLink** variable returned by the flow.

##### 4d. Add a Trigger Topic for Automatic Execution (Advanced)

To have the agent run automatically when all 5 stream files are present (rather than requiring a user to type a command), you will set this up in Exercise 3. For now, the agent can be triggered manually by using the suggested prompt.

#### 5. Test the Agent
1. Click **"Test your agent"** in the top right to open the test pane.
2. Type: `Create a monthly report and save it to SharePoint`
3. Verify that:
   - The agent generates the consolidated report
   - It asks for confirmation to save
   - After confirming, a new Word document appears in your **MBR Output** SharePoint folder
4. Open the Word document in SharePoint to confirm the content is correct.

#### 6. Publish the Agent
1. Click **"Publish"** in the top right corner.
2. Select the channels where you want the agent available (e.g., Microsoft Teams, Copilot).
3. Click **"Publish"** to make the agent live.

> **Key takeaway:** Copilot Studio adds the ability to perform *actions* — like saving files, sending messages, or calling external APIs — that Agent Builder alone cannot do. This makes it suitable for production workflows, not just interactive Q&A.

---

## Exercise 3: Check for Input Documents and Trigger the Report Agent

### Goal
- **Technical:** Understand how Power Automate cloud flows in Copilot Studio can automate repetitive tasks by reacting to events.
- **Content:** Build a flow that monitors the MBR Input folder and triggers the report agent when all 5 stream documents have been uploaded.

### Why
In a real scenario, different stream leads upload their reports at different times during the month. Instead of someone manually checking "are all reports in yet?", this flow does it automatically and kicks off report generation the moment all inputs are present.

### Introduction
You will create a Power Automate cloud flow that triggers whenever a file is added to the MBR Input folder. Each time, it checks whether all 5 required stream reports are now present. When they are, it triggers the Monthly Reports Generator agent (or sends a notification).

### Prerequisites
- The **MBR Input** SharePoint folder link
- The **Monthly Reports Generator** agent from Exercise 2 (published)
- Access to Copilot Studio

### Steps

#### 1. Open Copilot Studio and Navigate to Cloud Flows
1. Go to **https://copilotstudio.microsoft.com**.
2. In the left navigation, click **"Automations"** (or **"Cloud flows"** if shown directly).
3. Click **"+ New flow"** to create a new cloud flow directly within Copilot Studio.

#### 2. Set the Trigger
1. Search for and select the trigger: **SharePoint — When a file is created (properties only)**
2. Configure the trigger:
   - **Site Address:** Select your SharePoint site
   - **Library Name:** Select the document library (e.g., "Documents")
   - **Folder:** `/MBR Input`

> This trigger fires every time any file is added to the MBR Input folder.

#### 3. Add an Action to List All Files in the Folder
1. Click **"+ New step"**.
2. Search for: **SharePoint — Get files (properties only)**
3. Configure:
   - **Site Address:** Same SharePoint site
   - **Library Name:** Same document library
   - **Folder:** `/MBR Input`
   - **Filter Query (optional):** You can leave this blank to get all files.

#### 4. Count the Files and Check for Completeness
1. Click **"+ New step"** and add a **"Compose"** action.
2. Set the **Inputs** to the following expression to count the files:

   ```
   length(outputs('Get_files_(properties_only)')?['body/value'])
   ```

   Rename this step to `FileCount`.

3. Click **"+ New step"** and add a **"Condition"** action.
4. Configure the condition:
   - **Left value:** `outputs('FileCount')` (the output of the Compose step)
   - **Operator:** `is greater than or equal to`
   - **Right value:** `6`

> **Why 6?** The folder should contain the 5 current stream reports plus 1 previous consolidated report. Adjust this number based on your actual file setup.

#### 5. Add Validation — Check for Specific File Names (Recommended)

For a more robust check, instead of just counting files, verify that specific files are present:

1. In the **"If yes"** branch of the Condition, add a **"Compose"** action.
2. Use this expression to extract all file names into an array:

   ```
   join(body('Get_files_(properties_only)')?['value'], ',')
   ```

3. Alternatively, add **Apply to each** with nested conditions to check for each expected file name pattern:
   - Contains "UX"
   - Contains "Frontend"
   - Contains "Backend"
   - Contains "Integrations"
   - Contains "Testing"

> **Simplified approach for the workshop:** The file count check (≥ 6) is sufficient to demonstrate the concept. In production, you would validate exact file names.

#### 6. Trigger the Report Agent (If Yes Branch)

When all files are present, you have several options to trigger report generation:

**Option A — Send a notification (simpler, recommended for this workshop):**
1. In the **"If yes"** branch, add **"Send an email (V2)"** (Office 365 Outlook connector).
2. Configure:
   - **To:** Your email address (or the project lead's email)
   - **Subject:** `All MBR Input Documents Received — Report Ready to Generate`
   - **Body:** `All 5 stream reports have been uploaded to the MBR Input folder. You can now generate the monthly report by opening the Monthly Reports Generator agent and clicking "Create a monthly report".`
3. Optionally, add a **Post message in a chat or channel** (Microsoft Teams connector) to notify a Teams channel.

**Option B — Trigger the agent automatically via HTTP (advanced):**
1. If you have published your agent with an API endpoint (via Copilot Studio's channel settings), you can add an **HTTP** action to call the agent's trigger URL.
2. This is more complex and may require additional permissions. For this workshop, Option A is recommended.

**Option C — Run the save-to-SharePoint flow directly:**
1. In the **"If yes"** branch, add a **"Run a child flow"** action.
2. Select the **Save MBR Report to SharePoint** flow from Exercise 2.
3. This skips the agent conversation and directly processes the files into a report.

> **Note:** Option C requires the flow from Exercise 2 to be refactored to read the files itself (rather than receiving content from the agent). This is the most automated approach but requires additional setup.

#### 7. Handle the "If No" Branch
1. In the **"If no"** branch (not all files present yet), you can optionally add a **Compose** action to log:
   ```
   Not all input files received yet. Current count: [FileCount]
   ```
2. Or simply leave it empty — no action is needed if files are still missing.

#### 8. Save, Test, and Activate
1. Click **"Save"** to save the flow.
2. **Test the flow:**
   - If you uploaded all files earlier, remove one file from the MBR Input folder.
   - Re-upload the file. The flow should trigger.
   - If you now have all 6 files, you should receive the email notification.
3. Ensure the flow is **turned on** (active). Check the toggle at the top of the flow editor.

> **Tip:** In the flow's run history (left sidebar > "My flows" > click the flow > "Run history"), you can see each execution and whether it succeeded or failed.

---

## Exercise 4: Create Flow to Prepare Folders for New Monthly Report

### Goal
- **Technical:** Understand how to work with folders and files programmatically using Power Automate flows.
- **Content:** Understand that sometimes preparation steps are needed for agents and flows to run correctly. Clean, predictable folder structures make automation reliable.

### Why
It's better to reuse the same input and output folders rather than creating new ones each month. This allows all agents and flows to always reference the same folder paths. Before a new reporting cycle, we archive the previous month's files and clear the input folder, so stream leads can upload fresh reports to the same location.

### Introduction
You will create a scheduled Power Automate flow that runs on a specific day each month. It will:
1. Create a dated archive subfolder (e.g., `MBR Archive/2026-03`)
2. Move all files from MBR Input to the archive folder
3. Move all files from MBR Output to the archive folder
4. The folders are now empty and ready for the next cycle

### Prerequisites
- The **MBR Input**, **MBR Output**, and **MBR Archive** SharePoint folders
- Access to Copilot Studio

### Steps

#### 1. Create a New Scheduled Flow
1. In Copilot Studio, navigate to **Automations** > **Cloud flows**.
2. Click **"+ Create"** > **"Scheduled cloud flow"**.
3. Configure the schedule:
   - **Flow name:** `Prepare Monthly Report Folders`
   - **Starting:** Set to the 1st of next month
   - **Repeat every:** `1 Month`
   - **On these days:** Leave default (the flow runs on the start date's day-of-month each month)
4. Click **"Create"**.

> **Tip:** If your reporting cycle starts on a different day (e.g., the 25th), adjust the starting date accordingly.

#### 2. Create the Archive Subfolder
1. Click **"+ New step"** and search for **SharePoint — Create new folder**.
2. **Alternatively**, use an **HTTP request to SharePoint** action if the "Create new folder" action is not available.

**Using "Send an HTTP request to SharePoint":**

| Field | Value |
|-------|-------|
| **Site Address** | Your SharePoint site |
| **Method** | `POST` |
| **Uri** | `_api/web/folders` |
| **Headers** | `Accept`: `application/json;odata=verbose` |
| | `Content-Type`: `application/json;odata=verbose` |
| **Body** | `{"__metadata":{"type":"SP.Folder"},"ServerRelativeUrl":"/sites/[YourSite]/Shared Documents/MBR Archive/@{formatDateTime(utcNow(),'yyyy-MM')}"}` |

> Replace `[YourSite]` with your actual SharePoint site name. The expression `formatDateTime(utcNow(),'yyyy-MM')` creates a folder name like `2026-03`.

**Simplified alternative — use "Create new folder" action (if available):**

| Field | Value |
|-------|-------|
| **Site Address** | Your SharePoint site |
| **List or Library** | Documents |
| **Folder Path** | `MBR Archive/@{formatDateTime(utcNow(),'yyyy-MM')}` |

#### 3. Move Files from MBR Input to Archive
1. Add **SharePoint — Get files (properties only)**:
   - **Site Address:** Your SharePoint site
   - **Library Name:** Documents
   - **Folder:** `/MBR Input`

2. Add **Apply to each** (this loop iterates over every file returned):
   - **Select an output from previous steps:** `body('Get_files_(properties_only)')?['value']`

3. Inside the loop, add **SharePoint — Move file**:

| Field | Value |
|-------|-------|
| **Site Address** | Your SharePoint site |
| **Current file path** | `@{items('Apply_to_each')?['{Path}']}` (dynamic content from the Get files step — the file's full path) |
| **Destination** | `/MBR Archive/@{formatDateTime(utcNow(),'yyyy-MM')}/@{items('Apply_to_each')?['{FilenameWithExtension}']}` |

> **Note:** If a "Move file" action isn't available, use **Copy file** followed by **Delete file** to achieve the same result.

#### 4. Move Files from MBR Output to Archive
1. Add another **SharePoint — Get files (properties only)**:
   - **Folder:** `/MBR Output`
   - Rename this step to `Get_output_files` to distinguish from the earlier step.

2. Add another **Apply to each**:
   - Iterate over: `body('Get_output_files')?['value']`

3. Inside this loop, add **SharePoint — Move file**:

| Field | Value |
|-------|-------|
| **Current file path** | The file path from the output files step |
| **Destination** | `/MBR Archive/@{formatDateTime(utcNow(),'yyyy-MM')}/@{items('Apply_to_each_2')?['{FilenameWithExtension}']}` |

#### 5. (Optional) Upload the Previous Report to MBR Input
After archiving, the new cycle's agent will need the previous month's consolidated report for comparison. You can:

1. Add a **SharePoint — Copy file** action:
   - **Source file:** The consolidated report from MBR Output (before it was moved — or reference it from the archive)
   - **Destination:** `/MBR Input/Previous-Report.docx`

> This ensures the previous period's report is always in the input folder for comparison, ready for the agent to pick up.

#### 6. Test the Flow
1. Click **"Save"**.
2. Click **"Test"** > **"Manually"** > **"Run flow"**.
3. Verify in SharePoint:
   - A new folder exists in **MBR Archive** named with the current year-month (e.g., `2026-04`)
   - The files from **MBR Input** have been moved to the archive folder
   - The files from **MBR Output** have been moved to the archive folder
   - **MBR Input** and **MBR Output** are now empty (or contain only the previous report copy)
4. If the test fails, check the flow run history for error details and correct the SharePoint paths.

#### 7. Activate the Flow
1. Ensure the flow is turned **on** (check the toggle).
2. The flow will now run automatically on the scheduled day each month.

---

## Exercise 5: Send Email/Chat Message to Gather Input

### Goal
- **Technical:** Understand how to automate communication with other users from Copilot Studio / Power Automate.
- **Content:** Send reminders to project stream leads so they provide their monthly input reports on time.

### Why
Automating reminder emails eliminates the manual overhead of chasing down reports each month. It ensures consistent, timely communication and provides stream leads with clear instructions and direct links to where they should upload their files.

### Introduction
You will create a Power Automate flow that sends an email (and optionally a Teams message) to all stream leads, requesting them to upload their monthly reports to the MBR Input folder. This flow can be triggered on a schedule or linked to the folder preparation flow from Exercise 4.

### Prerequisites
- List of stream leads' email addresses:

| Stream | Lead | Email (example) |
|--------|------|-----------------|
| UX | Sarah Chen | sarah.chen@yourcompany.com |
| Frontend | James Okafor | james.okafor@yourcompany.com |
| Backend | Priya Mehta | priya.mehta@yourcompany.com |
| Integrations | Marcus Webb | marcus.webb@yourcompany.com |
| Testing | Anika Larsson | anika.larsson@yourcompany.com |

- The link to the **MBR Input** SharePoint folder
- Access to Copilot Studio or Power Automate

### Steps

#### 1. Create a New Flow
1. In Copilot Studio or Power Automate, create a new **Automated** or **Scheduled** cloud flow.
2. **Flow name:** `Send MBR Input Reminders`

#### 2. Set the Trigger

Choose one of the following trigger options:

**Option A — Schedule-based (recommended):**
- Trigger: **Recurrence**
- **Interval:** 1 Month
- **Start time:** Set to the day you want reminders sent (e.g., the 1st of each month, or right after the folder preparation flow runs)

**Option B — Triggered by the folder preparation flow:**
- In Exercise 4's flow, add a step at the end that calls this flow using **"Run a child flow"**
- In this flow, use the trigger: **"Manually trigger a flow"** or **"When a HTTP request is received"**

**Option C — Triggered by folder creation:**
- Trigger: **SharePoint — When a file or folder is created**
- This fires when the archive folder is created (from Exercise 4), signaling that the new cycle has started

#### 3. Add the Email Action
1. Click **"+ New step"**.
2. Search for and select: **Office 365 Outlook — Send an email (V2)**
3. Configure the email:

| Field | Value |
|-------|-------|
| **To** | `sarah.chen@yourcompany.com; james.okafor@yourcompany.com; priya.mehta@yourcompany.com; marcus.webb@yourcompany.com; anika.larsson@yourcompany.com` |
| **Subject** | `Action Required: Submit Your Monthly Stream Report by @{formatDateTime(addDays(utcNow(), 10), 'MMMM dd')}` |
| **Body** | See the email template below |
| **Importance** | High |

**Email Body Template:**

```html
<p>Hi Team,</p>

<p>It's time to submit your monthly stream report for the <b>@{formatDateTime(utcNow(), 'MMMM yyyy')}</b> reporting period.</p>

<p><b>What to do:</b></p>
<ol>
  <li>Prepare your stream report following the standard template (Status, Top Risks, Blockers, Leadership Asks, Delayed Tasks, Summary/Outlook).</li>
  <li>Save it as a Word document named: <code>[StreamName]-Stream-Report.docx</code></li>
  <li>Upload it to the MBR Input folder: <a href="[PASTE YOUR MBR INPUT FOLDER LINK HERE]">MBR Input Folder</a></li>
</ol>

<p><b>Deadline:</b> @{formatDateTime(addDays(utcNow(), 10), 'dddd, MMMM dd, yyyy')}</p>

<p>Once all 5 stream reports are uploaded, the consolidated monthly business report will be generated automatically.</p>

<p>Thank you,<br/>PMO Automated Reporting</p>
```

> **Important:** Replace `[PASTE YOUR MBR INPUT FOLDER LINK HERE]` with the actual link to your MBR Input SharePoint folder.

#### 4. (Optional) Send a Teams Message
1. Click **"+ New step"**.
2. Search for and select: **Microsoft Teams — Post message in a chat or channel**
3. Configure:

| Field | Value |
|-------|-------|
| **Post as** | Flow bot |
| **Post in** | Channel |
| **Team** | Select your project team |
| **Channel** | Select the appropriate channel (e.g., "Project Reporting") |
| **Message** | `📋 Monthly report input is now due. Please upload your stream reports to the MBR Input folder by @{formatDateTime(addDays(utcNow(), 10), 'MMMM dd')}. [Link to folder](YOUR_FOLDER_LINK)` |

#### 5. (Optional) Send a Follow-Up Reminder
To send a second reminder a few days before the deadline:

1. Add a **Delay** action: `7 days` (or however many days before the deadline you want the reminder).
2. Add a **Condition**: Check if all files are present (reuse the logic from Exercise 3 — get files from MBR Input, count them).
3. **If no** (not all files present): Send a follow-up email with subject `Reminder: Monthly Stream Report Still Needed` and list which files are missing.
4. **If yes** (all files present): Skip the reminder — no action needed.

#### 6. Test the Flow
1. Click **"Save"**.
2. Click **"Test"** > **"Manually"** > **"Run flow"**.
3. Verify:
   - All stream leads receive the email with correct content, the folder link works, and the deadline date is accurate.
   - If configured, the Teams message appears in the correct channel.
4. Check your own inbox (if you used your email for testing) to confirm formatting.

#### 7. Activate the Flow
1. Ensure the flow is turned **on**.
2. If using Option B (triggered by Exercise 4's flow), verify the connection between the two flows.

---

## Summary: The Complete Automated Reporting Pipeline

When all 5 exercises are complete, you have built an end-to-end automated monthly reporting pipeline:

```
┌─────────────────────────────────────────────────────────────┐
│  Day 1 of Month (Scheduled)                                 │
│                                                             │
│  Exercise 4: Prepare Folders                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 1. Create archive subfolder (e.g., 2026-03)        │    │
│  │ 2. Move MBR Input files → Archive                  │    │
│  │ 3. Move MBR Output files → Archive                 │    │
│  │ 4. Copy previous report into MBR Input             │    │
│  └──────────────────────┬──────────────────────────────┘    │
│                         │                                   │
│                         ▼                                   │
│  Exercise 5: Send Reminders                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 1. Email all stream leads with instructions         │    │
│  │ 2. Post to Teams channel                            │    │
│  │ 3. (Optional) Follow-up reminder after 7 days       │    │
│  └──────────────────────┬──────────────────────────────┘    │
│                         │                                   │
│            Stream leads upload reports                      │
│                         │                                   │
│                         ▼                                   │
│  Exercise 3: Monitor Input Folder                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 1. Trigger on each new file in MBR Input            │    │
│  │ 2. Check if all 5 stream reports are present        │    │
│  │ 3. If yes → notify / trigger report generation      │    │
│  └──────────────────────┬──────────────────────────────┘    │
│                         │                                   │
│                         ▼                                   │
│  Exercise 2: Generate Report (Copilot Studio Agent)         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 1. Read all stream reports from MBR Input           │    │
│  │ 2. Generate consolidated report with comparison     │    │
│  │ 3. Save as Word document in MBR Output              │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### What You Built
| Exercise | Component | Type | Trigger |
|----------|-----------|------|---------|
| 1 | Monthly Reports Generator (basic) | Agent (Agent Builder) | Manual (chat prompt) |
| 2 | Monthly Reports Generator (enhanced) | Agent (Copilot Studio) | Manual (chat prompt), saves to SharePoint |
| 3 | MBR Input Monitor | Cloud Flow | Automatic (file added to SharePoint) |
| 4 | Monthly Folder Preparation | Cloud Flow | Scheduled (1st of each month) |
| 5 | Input Reminder Emails | Cloud Flow | Scheduled or triggered by Exercise 4 |

### Next Steps / Ideas for Extension
- **Add an approval step:** Before saving the final report, route it to a manager for review and approval.
- **Add a Power BI dashboard:** Create a dashboard that reads the MBR Output reports and displays trends over time.
- **Expand to other report types:** Reuse the same pattern for weekly stand-up summaries, quarterly reviews, etc.
- **Add Adaptive Cards in Teams:** Instead of plain email, send rich interactive cards in Teams that let leads upload directly.
- **Version control:** Store reports in a SharePoint library with versioning enabled so changes are tracked.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Agent doesn't find files in SharePoint | Verify the SharePoint folder links in the Knowledge section. Ensure the links point to the exact folder (not the site root). Try removing and re-adding the knowledge source. |
| Flow doesn't trigger when files are added | Check that the SharePoint trigger is configured with the correct site and folder path. Verify the flow is turned on. Check flow run history for errors. |
| "Create file" action creates a file but content is empty | Ensure the **ReportContent** variable is properly mapped from the agent to the flow input. Test with a hardcoded string first. |
| Email action fails with permissions error | Verify the flow connection for Office 365 Outlook is authenticated with a user who has send permissions. Re-authenticate the connection if needed. |
| Scheduled flow runs at wrong time | Check the time zone setting in the Recurrence trigger. Set it explicitly to your local time zone. |
| "Move file" action fails | Verify the destination folder exists before moving. The archive subfolder must be created before files can be moved into it. |
| Agent generates inconsistent output | Refine the instructions prompt. Be more specific about the expected format. Test with different phrasings of the trigger message. |
