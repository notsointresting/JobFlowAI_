## https://serper.dev/
import os
from dotenv import load_dotenv
from crewai_tools import SerperDevTool
load_dotenv()
os.environ['SERPER_API_KEY'] = os.getenv('SERPER_API_KEY')

# inititlaize the tool for internet searching capabilities
search_tool = SerperDevTool()

'''@tool('save_search_results')
def save_search_results(response):
    file_paths = [item.strip() for item in response.split(',')]
    content_source = CrewDoclingSource(file_paths=file_paths)
    return content_source'''
