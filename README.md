# JobFlowAI 🚀

---

Welcome to JobFlowAI! This project is designed to be your intelligent assistant in the often challenging journey of job hunting. JobFlowAI helps you streamline your job search, optimize your resumes, and prepare for interviews using our suite of AI-powered tools.

## ✨ Key Features

-   **Resume Analysis & ATS Optimization:** Upload your resume and get an ATS-friendly score, along with suggestions to improve its compatibility with specific job descriptions. This helps your resume get noticed by recruiters.
-   **Targeted Job Searching:** Our AI scans numerous job boards to find positions that best match your skills and preferences, saving you time and effort. Stop sifting through irrelevant listings and focus on opportunities that matter.
-   **In-depth Company Insights:** Gain valuable insights into companies you're interested in, including their culture, financial health, and recent news. This knowledge empowers you to make informed decisions and tailor your application.
-   **Employee Review Summarization:** We intelligently summarize employee reviews from various platforms to give you a quick understanding of a company's work environment and employee satisfaction. This helps you gauge if a company is the right fit for you.
-   **Alumni & Mentor Connection:** Connect with alumni from your institution or professionals in your target industry for mentorship and networking opportunities. Building a strong network can significantly boost your job search.
-   **Interview Candidate Outreach:** Identify and connect with individuals who have recently interviewed at your target companies to gain firsthand insights into their interview process and experiences. This can give you a competitive edge.
-   **Comprehensive Interview Question Bank:** Access a vast database of interview questions, sortable by company, role, and interview type. Practice with real questions to build confidence and ace your interviews.
-   **HR & Recruiter Contact Discovery:** Find contact information for HR personnel and recruiters at companies you're targeting. Directly reaching out can make your application stand out.

## 🤖 How It Works: The AI Crew

JobFlowAI leverages a specialized team of AI agents, our "AI Crew" powered by CrewAI, to perform its diverse range of tasks. Each agent has a specific role:

-   **`JobScout`**: Discovers relevant job openings based on user criteria.
-   **`ATS_Agent`**: Analyzes resumes against job descriptions, providing an ATS score and feedback.
-   **`CompanyInsider`**: Gathers the latest news, developments, and key facts about a company.
-   **`ReviewRadar`**: Summarizes online reviews about a company's culture, salary, and hiring difficulty.
-   **`AlumniConnector`**: Finds alumni from the user's university working at the target company and helps craft outreach messages.
-   **`MentorFinder`**: Identifies potential mentors within the target company and assists in creating outreach messages.
-   **`InterviewInsider`**: Locates individuals who have recently interviewed for similar roles and helps draft messages to request insights.
-   **`InterviewInsight`**: Collects and categorizes common interview questions (technical, behavioral, coding) for the specified role.
-   **`HRHunter`**: Seeks out contact information for HR personnel and recruiters at the company.
-   **`ReportMaster`**: Compiles all the information gathered by other agents into a final, structured report.

## 🛠️ Technology Stack

-   **Python:** The core programming language used for development.
-   **Streamlit:** Used to create the interactive web user interface.
-   **CrewAI:** The framework used to orchestrate the team of AI agents.
-   **Langchain:** Utilized for building applications powered by large language models.
-   **Gemini (Google):** The specific Large Language Model (LLM) leveraged for generating insights and text, accessed via an API.
-   **SerperDevTool:** Integrated for enabling real-time web search capabilities for the agents.

## 🚀 Getting Started

Follow these steps to get JobFlowAI up and running on your local machine:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/JobFlowAI.git # Replace with the actual repository URL
    cd JobFlowAI
    ```

2.  **Create a Virtual Environment (Recommended):**
    Using a virtual environment helps manage project dependencies and avoid conflicts.
    ```bash
    python -m venv venv
    ```
    Activate the virtual environment:
    -   On macOS and Linux:
        ```bash
        source venv/bin/activate
        ```
    -   On Windows:
        ```bash
        venv\Scripts\activate
        ```

3.  **Install Dependencies:**
    Install all the necessary packages listed in the `requirements.txt` file.
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set Up API Keys:**
    JobFlowAI requires API keys for some of its core functionalities.

    *   **Gemini API Key (Google AI Studio):**
        This key is required for the AI models to function.
        -   Obtain your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
        -   The Gemini API key will be entered directly in the settings panel of the Streamlit application when you run it.

    *   **Serper API Key (serper.dev):**
        This key enables the web search capabilities used by some agents.
        -   Sign up for an account at [serper.dev](https://serper.dev) to get your free API key.
        -   Set this key as an environment variable named `SERPER_API_KEY`. The recommended way to do this is by creating a `.env` file in the root directory of the project.
        -   Create a file named `.env` in the project root and add the following line, replacing `your_serper_api_key_here` with your actual key:
            ```
            SERPER_API_KEY='your_serper_api_key_here'
            ```
        -   Since `python-dotenv` is included in `requirements.txt`, the application will automatically load this environment variable if the `.env` file is present.

5.  **Run the Application:**
    Once the setup is complete, you can start the Streamlit application.
    ```bash
    streamlit run app.py
    ```
    This will open JobFlowAI in your default web browser.

## 🖥️ Usage

Here's how to use JobFlowAI to supercharge your job search:

1.  **Launch the Application:**
    After completing the "Getting Started" steps, the application will open in your web browser, typically at `http://localhost:8501`.

2.  **Configure Settings (Sidebar):**
    Look for the sidebar on the left side of the application.
    *   **Select Model:** Choose your preferred language model from the dropdown menu. (This option will be available if multiple models are configured).
    *   **Enter API Key:** Input your Gemini API Key into the field labeled "Enter your Gemini API Key" and click the "Save API Key" button. This step is essential for the AI to function. If you close and reopen the app, you might need to re-enter it unless it has been hardcoded into the application.
    *   **Upload Resume:** Click on the "Upload your resume (PDF)" button. A file dialog will appear, allowing you to select your resume. Please ensure your resume is in PDF format. A success message will appear in the sidebar once the resume is uploaded correctly.

3.  **Input Job Details (Main Form):**
    In the main area of the application, you'll find a form to enter details about the job you're targeting:
    *   **Company Name:** Type the name of the company you are applying to.
    *   **Role:** Enter the specific job title or role you're interested in (e.g., "Software Engineer," "Product Manager").
    *   **Experience Level:** Specify your current experience level (e.g., "Entry-Level," "Mid-Level," "Senior").
    *   **University Name:** Provide the name of your university. This is used by the AI agents to find alumni and networking opportunities.

4.  **Start Analysis:**
    Once all the details are filled in, click the prominent "Start Analysis" button.

5.  **Processing:**
    After you click "Start Analysis," you'll see a progress indicator. The AI Crew is now at work, gathering and analyzing information. This process can take a few moments, so please be patient.

6.  **View Results:**
    When the analysis is complete, the comprehensive report generated by the AI agents will be displayed in the "📊 Analysis Results" section on the page. This report will contain insights on the company, job role, interview questions, and more, based on your inputs.

## ⚙️ Customization & Configuration

For users familiar with Python and the CrewAI framework, JobFlowAI offers several avenues for customization to tailor the application to specific needs or to experiment with its AI capabilities:

-   **AI Agent Behavior:** The core logic of each AI agent—including its designated `role`, primary `goal`, detailed `backstory`, assigned `tools`, and `max_execution_time`—is defined within `app.py`. You can modify these parameters to refine agent behavior, specialize their tasks, or improve their efficiency.

-   **Crew Composition & Task Sequencing:** The `app.py` file also outlines the composition of the AI crew and the sequence of tasks they perform. Feel free to add new specialized agents, remove existing ones, or replace them with custom implementations. The task list for the crew can be reordered or modified to create different analytical workflows.

-   **Language Model Selection & Parameters:** While the Streamlit interface allows for selecting a configured language model, advanced users can directly alter the LLM choices or their parameters (like temperature, top_p) in `app.py`. This is typically done where the `ChatOpenAI` class (or a similar class for other LLMs like Gemini) is instantiated. This allows for deeper experimentation with different model capabilities and response styles.

-   **Knowledge Source Integration:** The application's handling of PDF resumes serves as a baseline. Users can extend this functionality to include other document types (e.g., `.docx`, `.txt`) or integrate additional knowledge sources (like personal notes or project portfolios) by modifying the data processing parts of the application.

We encourage technically inclined users to explore the codebase, particularly `app.py`, and adapt JobFlowAI to their unique job search strategies or research interests.

## 🤝 Contributing

We believe in the power of community and welcome contributions to make JobFlowAI even better! Whether you're fixing a bug, proposing a new feature, or improving documentation, your input is valuable.

Here’s how you can contribute:

-   **Reporting Bugs and Issues:** If you encounter a bug or any other issue, please [open an issue](https://github.com/notsointresting/JobFlowAI_/issues) on our GitHub repository. Provide as much detail as possible, including steps to reproduce, error messages, and your environment setup.
-   **Suggesting Enhancements:** Have an idea for a new feature or an improvement to an existing one? We'd love to hear it! Please submit your suggestions by [opening an issue](https://github.com/notsointresting/JobFlowAI_/issues) and detailing your proposal.
-   **Improving Documentation:** Notice a typo, an unclear explanation, or an area where the documentation could be enhanced? Contributions to documentation are highly appreciated. You can suggest changes by opening an issue or submitting a pull request directly.
-   **Submitting Code Changes:** If you'd like to contribute code for bug fixes or new features, please feel free to open a pull request. We'll review it as soon as possible.

If you plan to make a more significant change, such as a major feature or a substantial refactoring, please open an issue first to discuss your ideas with the maintainers. This helps ensure that your contributions align with the project's goals and roadmap.

Thank you for considering contributing to JobFlowAI!

## 📄 License

This project is not currently distributed under a specific open-source license.

The project owner may consider adding a license to define how others can use, modify, and distribute the code. Common choices include the [MIT License](https://opensource.org/licenses/MIT) or the [Apache License 2.0](https://opensource.org/licenses/Apache-2.0).


