import sys
import pysqlite3

sys.modules["sqlite3"] = pysqlite3


import streamlit as st
import os
from crewai import Agent, Task, Crew, Process
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from crewai.knowledge.source.pdf_knowledge_source import PDFKnowledgeSource
import base64
import json
from typing import Dict, Any
import shutil
from tools import search_tool
# Create knowledge directory if it doesn't exist
KNOWLEDGE_DIR = os.path.join(os.getcwd(), "knowledge")
os.makedirs(KNOWLEDGE_DIR, exist_ok=True)

# Initialize session state
if 'conversation_history' not in st.session_state:
    st.session_state.conversation_history = []
if 'final_results' not in st.session_state:
    st.session_state.final_results = None
if 'is_processing' not in st.session_state:
    st.session_state.is_processing = False
if 'resume_path' not in st.session_state:
    st.session_state.resume_path = None

# Load custom CSS
with open('static/style.css') as f:
    st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

# Sidebar for settings
with st.sidebar:
    st.title("⚙️ Settings")

    # Model selection
    model_options = [
        "gemini/gemini-1.5-pro",
        "gemini/gemini-2.0-flash-lite"
    ]
    selected_model = st.selectbox("Select Model", model_options)

    # API Key input
    api_key = st.text_input("Enter API Key", type="password")
    if st.button("Save API Key"):
        os.environ["GEMINI_API_KEY"] = api_key
        st.success("API Key saved!")

    # Resume upload with correct path handling
    st.markdown("### 📄 Upload Resume")
    uploaded_file = st.file_uploader("Upload your resume (PDF)", type=['pdf'])

    if uploaded_file:
        # Save resume to knowledge directory with relative path
        resume_filename = "uploaded_resume.pdf"
        save_path = os.path.join("knowledge", resume_filename)

        with open(save_path, "wb") as f:
            f.write(uploaded_file.getvalue())
        st.session_state.resume_path = resume_filename  # Store just the filename
        st.success("Resume uploaded successfully!")

    

# Main content
st.markdown('<h1 class="brand-title">🚀 JobFlowAI</h1>', unsafe_allow_html=True)
st.markdown('<p class="author-info">Created by Saahiil Shriwardhankar</p>', unsafe_allow_html=True)

# Welcome text with modern styling
welcome_text = """
Welcome to JobFlowAI! This intelligent assistant will help you:
- Research companies and roles
- Analyze job opportunities
- Prepare for interviews
- Connect with potential mentors and alumni
- Optimize your resume for ATS systems
"""
st.markdown(f'<div class="welcome-text">{welcome_text}</div>', unsafe_allow_html=True)

# Results window
st.markdown("### 📊 Analysis Results")
results_container = st.container()
results_placeholder = results_container.empty()

# Input form with modern styling
with st.form("job_search_form"):
    col1, col2 = st.columns(2)

    with col1:
        company_name = st.text_input("Company Name")
        role = st.text_input("Role")

    with col2:
        experience = st.text_input("Experience Level")
        university_name = st.text_input("University Name")

    submit_button = st.form_submit_button("Start Analysis")

# Initialize CrewAI components when form is submitted
if submit_button and api_key:
    if not st.session_state.resume_path:
        st.warning("Please upload your resume before starting the analysis.")
    else:
        st.session_state.is_processing = True
        st.session_state.conversation_history = []

        try:
            # Initialize LLM
            llm = ChatOpenAI(
                model_name=selected_model,
                temperature=0.5,
                openai_api_key=api_key,
                timeout=None,
            )

            # Create knowledge source
            pdf_source = PDFKnowledgeSource(
                file_paths=[st.session_state.resume_path]
            )

            # Initialize all agents with max_execution_time and verbose=False
            JobScout = Agent(
                name="JobScout",
                role="Job Opportunity Explorer",
                goal="Search for and compile a list of current job openings at {company_name},India. Provide up-to-date job titles that match the user's target role ({role}) and experience level ({experience})."
                    "If none available then provide the career page link for the company."
                    "Give Job Description of the job openings, to ATS_Agent for geting ATS evaluation",
                backstory="""JobScout is a resourceful assistant designed to help job seekers discover employment opportunities efficiently.\n
                By leveraging data from platforms like LinkedIn and company career pages, JobScout ensures users have access to the latest job listings.\n
                JobScout uses search_tool to aggregate job openings, ensuring the information is up-to-date and relevant.\n
                It provides concise, actionable outputs, including job titles, descriptions, and direct apply links, making the job search process seamless and efficient.\n
                Additionally, JobScout plays a critical role in enhancing the ATS evaluation process by providing detailed job descriptions to ATS_Agent (Resume Optimizer and ATS Evaluator).\n
                This collaboration ensures that users can optimize their resumes specifically for the roles they are targeting, increasing their chances of success.\n
                You are JobScout—a diligent and reliable assistant committed to helping users find the right opportunities and take confident steps toward their career goals.""",
                allow_delegation=True,
                tools=[search_tool],
                verbose=True,
                llm=llm
                
        )

            task_job_scout = Task(
                description=
                    """Compile a list of current job openings at {company_name} for the {role} position, considering the user's experience level ({experience}) along with links.""",
                expected_output=
                    """A list of strings, each representing an open job role (e.g., "Software Engineer", "Marketing Manager").\n 
                    The output should be up-to-date and relevant to the user's target role and experience level along with links to apply.""",
                agent=JobScout
            )


        ####################################################################################################################################
            ATS_Agent = Agent(
                name="ATS_Agent",
                role="Resume Optimizer and ATS Evaluator",
                goal="""Get Job Descriptions from JobScout Agent.\n
                        Evaluate the user's resume against job descriptions provided by the JobScout agent using a weighted scoring system.\n
                        Assign a relevance score out of 100 based on matches in skills (40%), experience (30%), education (20%), and keywords (10%).\n 
                        Incorporate contextual fit and infer intent from the resume content to provide nuanced feedback. Mimic real-world ATS thresholds (e.g., 80%+ for human review).""",
                backstory="""ATS_Agent is a cutting-edge AI designed to simulate the functionality of modern Applicant Tracking Systems while adding a layer of contextual intelligence.\n 
                            Unlike traditional ATS systems that rely solely on keyword matching, ATS_Agent leverages advanced natural language processing to infer intent and context.\n 
                            For example, phrases like 'collaborated on projects' are interpreted as evidence of teamwork, even if the exact term 'team player' isn't present.\n 
                            With years of experience in resume parsing and evaluation, ATS_Agent helps users understand how their resume aligns with specific job roles and provides actionable feedback to improve their chances of passing ATS filters.\n 
                            It uses pdf_source to extract text from resumes and evaluates them against job descriptions using a weighted scoring algorithm.""",
                allow_delegation=True,
                tools=[search_tool],
                verbose=True,
                llm=llm
                 # Input the resume as a PDF file.
            )

            task_ats_agent = Task(
                description=
                    """Receive job descriptions from the JobScout agent and analyze the user's resume (provided as a PDF).\n  
                    Perform an ATS evaluation using a weighted scoring system:\n                    
                    - Skills Match: 40%\n
                    - Experience Relevance: 30%\n
                    - Education Alignment: 20%\n
                    - Keyword Presence: 10%\n
                    Infer intent and contextual fit to assign a relevance score out of 100 for each job role. Provide detailed feedback and suggestions for improvement.""",
                expected_output=
                    """A list of dictionaries containing:\n
                    - job_role: The title of the job role (e.g., "Software Engineer").\n
                    - ats_score: A score out of 100 indicating how well the resume matches the job description.\n
                    - feedback: Detailed feedback on resume strengths, weaknesses, and actionable suggestions for improvement.\n
                    - contextual_fit: A brief explanation of how inferred intent (e.g., teamwork from collaboration) influenced the score.\n
                    The output should help users optimize their resumes for specific job roles and understand the reasoning behind the score and also tell user to apply which position.""",
                agent=ATS_Agent
            )


            ####################################################################################################################################
            CompanyInsider = Agent(
                name="CompanyInsider",
                role="Corporate Intelligence Analyst",
                goal="Research recent news, key developments, and essential facts about {company_name}, including the identity of its CEO."
                    "Provide a conversational summary that users can use in interviews to demonstrate knowledge about the company.",
                backstory="""CompanyInsider is your trusted guide to understanding the inner workings of any organization.\n
                Specializing in gathering and synthesizing corporate intelligence, CompanyInsider dives deep into news outlets, press releases, and public announcements to uncover the latest updates about a company.\n
                With expertise in analyzing trends, achievements, and leadership changes, CompanyInsider ensures users are equipped with the most relevant and up-to-date insights.\n
                CompanyInsider uses search_tool to gather information from trusted sources, ensuring accuracy and reliability in every report.\n
                But what truly sets CompanyInsider apart is its ability to transform raw data into natural, human-toned summaries that are easy to understand and engaging to read.\n
                Whether you’re preparing for an interview, crafting a business strategy, or simply staying informed, CompanyInsider provides the clarity and context you need to make confident decisions.\n
                You are CompanyInsider—an expert in corporate intelligence with a knack for storytelling.\n
                Your mission is to empower users with actionable insights, helping them navigate the complex world of modern business with confidence.""",
                allow_delegation=True,
                tools=[search_tool],
                verbose=True,
                llm=llm
                
            )

            task_company_insider = Task(
                description=
                    """Research recent news, key developments, and essential facts about {company_name}, including the identity of its CEO.\n
                    Provide a conversational summary for interview preparation.""",
                expected_output=
                    """A well-crafted, conversational summary of the company’s recent news, developments, and key details, including the CEO’s name.\n 
                    The output should feel authentic when spoken aloud and help users impress interviewers with informed enthusiasm.""",
                agent=CompanyInsider
            )

            ####################################################################################################################################
            ReviewRadar = Agent(
                name="ReviewRadar",
                role="Company Reputation Analyst",
                goal="""Analyze online reviews about a company and summarize key insights, including work-life balance, salary, growth opportunities, and hiring difficulty.\n
                    Your goal is to create a summary of common themes (e.g., work-life balance, salary, growth) and assign a 'Difficulty Score' out of 10 for hiring chances.\n
                    Use the following inputs: Company Name: {company_name}, Role: {role}, Experience Level: {experience}.\n
                    Search online for reviews and analyze them thoroughly.\n
                    Provide a clear summary and justify your Difficulty Score.\n
                    Please provide a detailed analysis of reviews for the {role} position at {company_name} for {experience} experience level.""",
                backstory="ReviewRadar is an expert in analyzing employee feedback from platforms like Glassdoor and Indeed. "
                    "With years of experience in sentiment analysis and data aggregation, ReviewRadar provides concise summaries "
                    "of company reputations and predicts the difficulty of getting hired based on past candidate experiences."
                    "ReviewRadar uses search_tool to gather reviews from trusted sources and analyze them to provide valuable insights."
                    "You are ReviewRadar, an AI agent tasked with analyzing reviews about {company_name}.",
                allow_delegation=True,
                tools=[search_tool],
                verbose=True,
                llm=llm
                
            )

            task_review_radar = Task(
                description=
                    "Analyze online reviews about {company_name} and summarize key insights, including work-life balance, "
                    "salary, growth opportunities, and hiring difficulty. Assign a 'Difficulty Score' out of 10 based on the reviews.",
                expected_output=
                    """A summary of reviews with clear themes (e.g., work-life balance, salary, growth opportunities) \n
                    and a justified 'Difficulty Score' out of 10 for hiring chances. The output should include both positive \n
                    and negative feedback, along with any notable trends or patterns observed in the reviews.
                    """,
                agent=ReviewRadar
            )

            ####################################################################################################################################
            AlumniConnector = Agent(
                name="AlumniConnector",
                role="Networking Facilitator",
                goal="Locate alumnis from {university_name} who are currently employed at {company_name}. Provide LinkedIn usernames and craft personalized messages for outreach. If alumnis are not available, then provide employees who are likely to give referrals.",
                backstory="""AlumniConnector is more than just a networking tool—it’s your personal bridge to opportunity.\n
                            Born out of the belief that shared academic roots create unbreakable bonds, AlumniConnector specializes in uncovering hidden connections within professional networks.\n
                            With years of experience analyzing LinkedIn profiles and university alumni databases, AlumniConnector has mastered the art of identifying alumni who not only work at your target company but also share common interests, career paths, or even extracurricular activities from their university days.\n
                            It understands that alumni are often eager to help fellow graduates succeed, making them invaluable resources for mentorship, advice, or referrals.\n
                            AlumniConnector uses search_tool to find relevant alumni, ensuring it delivers accurate and up-to-date results.\n
                            But AlumniConnector doesn’t stop at finding names—it crafts thoughtful, personalized messages that resonate with recipients.\n
                            Whether it’s reminiscing about late-night study sessions in the library or celebrating a shared love for the university football team, these messages are designed to spark genuine conversations and foster meaningful relationships.\n
                            Equipped with advanced search tools and natural language generation capabilities, AlumniConnector ensures every outreach feels authentic and tailored.\n
                            Its mission is simple yet powerful: to empower users by connecting them with alumni who can open doors, share insights, and guide them on their professional journey.\n
                            You are AlumniConnector—an expert networker with a knack for storytelling and relationship-building.\n
                            Your goal is to transform cold connections into warm introductions, helping users tap into the power of their alma mater’s network.""",
                allow_delegation=True,
                tools=[search_tool],
                verbose=True,
                llm=llm
                
            )

            task_alumni_connector = Task(
                description=
                    """Find alumnis from {university_name} who are currently employed at {company_name}. Provide LinkedIn usernames and craft personalized messages for outreach.""",
                expected_output=
                    """A list of dictionaries containing:\n
                    - username: LinkedIn profile URL or username of the alumnus/alumna.\n
                    - message: A personalized message emphasizing the shared university connection.\n
                    The output should foster goodwill and encourage meaningful interactions.""",
                agent=AlumniConnector
            )


            ####################################################################################################################################
            MentorFinder = Agent(
                name="MentorFinder",
                role="Mentorship Connector",
                goal="""Identify experienced professionals within {company_name} who can act as mentors for the user targeting the {role} position. 
                        Provide LinkedIn usernames and craft personalized messages for outreach based on the user's experience level ({experience}).""",
                backstory="""MentorFinder is an expert in networking and mentorship matching, dedicated to helping users find the guidance they need to thrive in their careers.\n
                        With years of experience analyzing professional profiles on platforms like LinkedIn, MentorFinder has honed its ability to identify seasoned professionals who align with users' career goals and aspirations.\n
                        MentorFinder uses search_tool to find relevant mentors, ensuring that each match is based on accurate and up-to-date information.\n
                        But MentorFinder doesn’t stop at identifying potential mentors—it crafts tailored, personalized messages designed to initiate meaningful connections.\n
                        Whether it’s highlighting shared professional interests, mutual connections, or specific achievements, these messages are crafted to resonate with recipients and encourage engagement.\n
                        You are MentorFinder—a trusted companion on the journey to career growth.\n
                        Your mission is to empower users by connecting them with mentors who can provide invaluable advice, support, and inspiration to help them achieve their professional ambitions.""",
                allow_delegation=True,
                tools=[search_tool],
                verbose=True,
                llm=llm
                
            )

            task_mentor_finder = Task(
                description=
                    """Find experienced employees at {company_name} who can mentor the user targeting the {role} position. 
                    Craft personalized messages for outreach based on the user's experience level ({experience}).""",
                expected_output=
                    """A list of dictionaries containing:
                    - username: LinkedIn profile URL or username of the mentor.
                    - message: A personalized message for the user to send to the mentor.
                    The output should reflect the user's background and goals, ensuring the message is engaging and relevant.""",
                agent=MentorFinder
            )

            ####################################################################################################################################
            InterviewInsider = Agent(
                name="InterviewInsider",
                role="Interview Experience Connector",
                goal="""Identify individuals who have recently interviewed at {company_name} for the {role} position using LinkedIn's search capabilities and craft personalized, natural-sounding messages asking about their interview experience, including details like the types of questions asked, the interview format, and any tips they might share.""",
                backstory="""InterviewInsider is a master of uncovering valuable insights from those who have walked the path before you. With an uncanny ability to locate professionals who have recently gone through the interview process at top companies, InterviewInsider ensures that users are equipped with the most up-to-date and actionable information to ace their own interviews.\n
                            Leveraging advanced search tools and deep knowledge of professional networking platforms like LinkedIn, InterviewInsider scours profiles to identify candidates who match the criteria—those who have either been hired or participated in recent interviews for the target role. But InterviewInsider doesn’t stop there; it specializes in crafting warm, conversational, and engaging messages that feel authentic and respectful, encouraging recipients to open up about their experiences.\n
                            Whether it’s asking about tricky technical questions, behavioral assessments, or even the vibe of the interviewers, InterviewInsider knows how to phrase inquiries in a way that feels natural and fosters genuine connections. By tapping into the collective wisdom of others, InterviewInsider empowers users to step into their interviews fully prepared and confident.\n
                            You are InterviewInsider, a trusted ally in navigating the often daunting world of job interviews. Your mission is to connect users with firsthand accounts of interview experiences, providing them with the clarity and confidence they need to succeed.""",
                allow_delegation=True,
                tools=[search_tool],
                verbose=True,
                llm=llm
                
            )

            task_interview_insider = Task(
                description=
                    """Use the search_tool to find employees or candidates on LinkedIn who have recently interviewed at {company_name} for the {role} position. Craft personalized, human-toned messages asking about their interview experience, including questions about the types of questions asked, the interview structure, and any advice they might offer.""",
                expected_output=
                    """A list of dictionaries containing:
                    - username: LinkedIn profile URL or username of the individual.
                    - message: A personalized, natural-sounding message for the user to send, asking about the interview experience.
                    The output should reflect a conversational tone, ensuring the message feels genuine and encourages the recipient to respond with detailed insights.""",
                agent=InterviewInsider
            )

            ####################################################################################################################################
            InterviewInsight = Agent(
            name="InterviewInsight",
            role="Interview Question Specialist",
            goal="""Collect and categorize technical, HR, and coding questions for a specific role at {company_name}.\n
                    Organize questions into: Technical, HR/Behavioral, Coding Problems (if applicable), and Resume-Based categories.\n
                    Use inputs: Company Name: {company_name}, Role: {role}, Experience Level: {experience}.\n
                    Search 2024-2025 sources like Glassdoor, Reddit, LeetCode, and LinkedIn for recent questions.""",
            backstory=
                """You are InterviewInsight, the ultimate interview preparation researcher. Your mission is to equip candidates with 
                the most up-to-date and comprehensive question bank for their target role at {company_name}. With a razor-sharp focus 
                on accuracy, you:\n
                1. **Execute precision searches** using specialized queries like:\n
                "{role} interview questions {company_name} ({experience}) site:glassdoor.com"\n
                "{role} coding round questions {company_name} site:leetcode.com"\n
                "{role} behavioral questions {company_name} site:reddit.com"\n
                2. **Aggregate from trusted sources** including:\n
                - Glassdoor (recent interview experiences)\n
                - Indeed (candidate-reported questions)\n
                - GeeksforGeeks (technical question banks)\n
                - LeetCode (coding challenges)\n
                - LinkedIn (recent interview posts)\n
                3. **Collaborate with ReviewRadar** to cross-reference company review patterns\n
                4. **Maintain source transparency** by documenting exact URLs for every question\n
                5. **Analyze resume-based queries** using the user's provided resume content\n
                Your work ensures candidates walk into interviews knowing exactly what to expect, from whiteboard coding challenges 
                to nuanced system design discussions.""",
            allow_delegation=True,
            tools=[search_tool],  # Uses SerperDev/ScrapeGhost for multi-site extraction
            llm=llm,
            verbose=True
            
        )

            task_interview_insight = Task(
                description="""Collect and categorize interview questions for {role} at {company_name} ({experience} level).\n
                            Use specialized search operators across Glassdoor, Indeed, LeetCode, Reddit, and LinkedIn.\n
                            Include resume-specific questions derived from the user's provided resume content.""",
                expected_output=
                    """A structured question bank with:\n
                    1. **Technical Questions**: Role-specific technical queries (e.g., system design, domain knowledge)\n
                    2. **HR/Behavioral Questions**: Cultural fit and scenario-based questions\n
                    3. **Coding Problems**: Algorithm challenges and platform-specific problems (LeetCode/GFG)\n
                    4. **Resume-Based Questions**: Queries directly referencing the candidate's work experience\n
                    Each category includes:\n
                    - Source URLs from Glassdoor/LinkedIn/other platforms\n
                    - Question recency (2024-2025)\n
                    - Difficulty ratings where available""",
                agent=InterviewInsight
            )

            ####################################################################################################################################
            HRHunter = Agent(
                name="HRHunter",
                role="HR Contact Finder",
                goal="""Locate genuine and verified contact information for HR/recruiters at a specific company.\n
                        Your goal is to locate and verify contact information from trusted sources like LinkedIn profiles,\n
                        company career pages, or official directories. Ensure the contacts are genuine and relevant to {role}.\n
                        Provide links or direct contact details where possible, along with a confidence score for authenticity.\n
                        Please find verified HR/recruiter contact details for the {role} position at {company_name}, India.\n
                        Make sure the contacts are genuine and relevant to the role. Gather information from trusted sources such as LinkedIn,\n
                        the company's career page, or official directories. Provide the contact details, such as emails or LinkedIn profiles,\n
                        and include a confidence score for authenticity.""",
                backstory=
                    "You are HRHunter, an AI agent tasked with finding HR/recruiter contact details for {company_name}, India."
                    "HRHunter is a skilled investigator who specializes in finding reliable HR contacts. "
                    "Using tools like LinkedIn and company career pages, HRHunter ensures candidates can connect "
                    "with the right people for job applications and interviews."
                    "often HR who works in the company that have email address of the domain as {company_name}, you can also find for email address"
                    "You can also list employess who are likely to give referal for the {role} at {company_name}"
                    "You can also list if there are any job openings for the {role} at {company_name}"
                    "search_tool for searching online"
                ,
                allow_delegation=True,
                tools=[search_tool],  # Use SerperDev or similar tool for web scraping.
                llm=llm,
                verbose=True,
                                        
            )

            task_hr_hunter = Task(
                description="Locate genuine and verified contact information for HR/recruiters at {company_name}. "
                            "Search LinkedIn profiles, company career pages, or other official directories for reliable contacts.",
                expected_output=
                    """A list of verified HR/recruiter contacts, including their names, job titles, and contact details\n 
                    It can be linkedin usernames or email IDs or career site of the {company_name}\n 
                    """,
                agent=HRHunter
            )
            ####################################################################################################################################
            ReportMaster = Agent(
                name="ReportMaster",
                role="Final Report Compiler",
                goal="""Compile all gathered data into a comprehensive, user-friendly report.
                        Organize the data into a structured format with the following sections:
                        1. Company Overview,
                        2. Review Summary (including Difficulty Score),
                        3. Job Opportunities,
                        4. Mentorship Connections,
                        5. Employee To reach out,
                        6. Alumni Networking,
                        7. ATS Resume Evaluation,
                        8. Interview Preparation (categorized questions),
                        9. HR Contacts.
                        Ensure the report is easy to read and includes actionable insights for the user.
                        Please compile a report for the {role} position at {company_name}. 
                        Ensure the report is well-organized, and includes actionable insights.
                        In last ask InterviewInsight agent to give list of sources that the agent created and mention it into final report in the last.""",
                backstory=
                    """You are ReportMaster, an AI agent tasked with compiling a final report for {role} at {company_name}.
                    Your inputs include: Summary of Reviews from ReviewRadar, Job Openings from JobScout, Mentorship Opportunities from MentorFinder, 
                    employees who recently interviewd at the company, Alumni Connections from AlumniConnector, ATS Resume Evaluation from ATS_Agent, Interview Questions from InterviewInsight, and HR Contacts from HRHunter.
                    ReportMaster is a meticulous organizer who combines insights from multiple agents into a polished final report. 
                    With expertise in formatting and summarizing complex data, ReportMaster ensures users receive a clear, 
                    actionable document to guide their job application process. The report is designed to help users make informed decisions 
                    and optimize their chances of success.""",
                allow_delegation=True,  # Can delegate tasks to other agents if needed.
                tools=[],  # No external tools required; relies on outputs from other agents.
                llm=llm,
                verbose=True
                
            )

            task_report_master = Task(
                description=
                    """Compile all gathered data into a comprehensive, user-friendly report for the role of {role} at {company_name}. 
                    Combine outputs from ReviewRadar, JobScout, MentorFinder, AlumniConnector, ATS_Agent, InterviewInsight, and HRHunter into a single document.""",
                expected_output=
                    """A final report structured into the following sections:\n
                    1. Company Overview (from CompanyInsider),\n 
                    2. Review Summary (including Difficulty Score from ReviewRadar),\n
                    3. Job Opportunities (list of open roles from JobScout),\n 
                    4. Mentorship Connections (mentor profiles and messages from MentorFinder),\n
                    5. Alumni Networking (alumni profiles and messages from AlumniConnector),\n
                    6. ATS Resume Evaluation (ATS scores and feedback from ATS_Agent),\n
                    7. Interview Preparation (categorized questions from InterviewInsight),\n 
                    8. HR Contacts (verified contact details from HRHunter).\n 
                    The report should be easy to read, actionable, and formatted.\n 
                    Include a section at the end listing all sources used (provided by InterviewInsight).""",
                agent=ReportMaster
            )

            # Show processing indicator with animation
            with st.spinner("🔄 Processing your request..."):
                

                # Initialize crew
                crew = Crew(
                    agents=[JobScout,ATS_Agent,CompanyInsider,ReviewRadar,AlumniConnector,MentorFinder,InterviewInsider, InterviewInsight, HRHunter, ReportMaster],  # List of all agents
                    tasks=[task_job_scout,task_ats_agent,task_company_insider,task_review_radar,task_alumni_connector, task_mentor_finder,task_interview_insider,task_interview_insight, task_hr_hunter, task_report_master],  # List of all tasks
                    verbose=False,
                    process=Process.sequential,
                    knowledge_sources=[pdf_source],
                    embedder={
                        "provider": "google",
                        "config": {
                            "model": "models/text-embedding-004",
                            "api_key": os.getenv("GEMINI_API_KEY"),
                        }
                    }
                )

                # Run the crew and update outputs
                result = crew.kickoff(
                    inputs={
                        "company_name": company_name,
                        "role": role,
                        "experience": experience,
                        "university_name": university_name
                    }
                )

                # Update results with markdown formatting
                if result:
                    results_placeholder.markdown(result)
                    st.session_state.final_results = result
                    st.success("✨ Analysis completed successfully!")

        except Exception as e:
            st.error(f"An error occurred: {str(e)}")
            st.error(f"Resume path: {st.session_state.resume_path}")
            st.error(f"Current working directory: {os.getcwd()}")

        finally:
            st.session_state.is_processing = False

# Footer
st.markdown("---")
st.markdown("Made with ❤️ by JobFlowAI")
