import streamlit as st
import snowflake.connector
import json

# Connect to Snowflake using secrets
def get_snowflake_connection():
    sf = st.secrets["snowflake"]
    conn = snowflake.connector.connect(
        user=sf["user"],
        password=sf["password"],
        account=sf["account"],
        warehouse=sf["warehouse"],
        database=sf["database"],
        schema=sf["schema"]
    )
    return conn

# Insert user data into Snowflake
def insert_job_preference(conn, keywords, location, job_type, experience_level, salary_range, notify_email, resume_binary):
    cursor = conn.cursor()
    try:
        # Convert keywords list to JSON string for storing
        keywords_json = json.dumps(keywords)

        insert_query = """
            INSERT INTO JOB_PREFERENCES
            (keywords, location, job_type, experience_level, salary_range, notify_email, resume)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (keywords_json, location, job_type, experience_level, salary_range, notify_email, resume_binary))
        conn.commit()
        return True
    except Exception as e:
        st.error(f"Error inserting data: {e}")
        return False
    finally:
        cursor.close()

# Streamlit UI starts here
st.title("CareerSync - Job Preferences Form")

with st.form("job_prefs_form"):
    keywords_input = st.text_input("Enter keywords (comma separated)", "Data Scientist, ML Engineer")
    location = st.text_input("Preferred Location", "Remote")
    job_type = st.selectbox("Job Type", ["Full-time", "Part-time", "Contract", "Internship"])
    experience_level = st.selectbox("Experience Level", ["Entry", "Mid-Senior", "Director", "Executive"])
    salary_range = st.text_input("Salary Range (e.g. 90000-120000)", "90000-120000")
    notify_email = st.text_input("Email to notify", "john@example.com")

    resume_file = st.file_uploader("Upload your Resume (PDF or DOCX)", type=["pdf", "docx"])

    submitted = st.form_submit_button("Submit")

if submitted:
    if not keywords_input:
        st.warning("Please enter keywords.")
    elif not notify_email:
        st.warning("Please enter your email.")
    else:
        keywords_list = [k.strip() for k in keywords_input.split(",") if k.strip()]

        resume_bytes = None
        if resume_file:
            resume_bytes = resume_file.read()
        else:
            st.warning("No resume uploaded; the resume field will be empty.")

        conn = get_snowflake_connection()
        success = insert_job_preference(conn, keywords_list, location, job_type, experience_level, salary_range, notify_email, resume_bytes)
        conn.close()

        if success:
            st.success("Your job preferences have been saved successfully!")
