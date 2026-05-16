import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api"

def verify_submission():
    print("🚀 Starting Issue Submission Verification...")
    
    # 1. Create a test issue
    issue_data = {
        "title": "Automatic Test Issue",
        "description": "This is an automated test to verify data persistence.",
        "latitude": 31.5204,
        "longitude": 74.3587,
        "category": "road"
    }
    
    print(f"Creating issue: {issue_data['title']}...")
    try:
        response = requests.post(f"{BASE_URL}/issues/", data=issue_data)
        if response.status_code == 201:
            issue_id = response.json().get('id')
            print(f"✅ Issue created successfully! ID: {issue_id}")
        else:
            print(f"❌ Failed to create issue. Status: {response.status_code}")
            print(response.text)
            return
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        print("Make sure the backend server is running at http://127.0.0.1:8000")
        return

    # 2. Verify persistence (fetch the list)
    print("Verifying persistence in the list...")
    try:
        response = requests.get(f"{BASE_URL}/issues/")
        issues = response.json()
        found = any(i.get('title') == "Automatic Test Issue" for i in issues)
        
        if found:
            print("✅ 'Automatic Test Issue' found in the list!")
        else:
            print("❌ Issue not found in the list.")
    except Exception as e:
        print(f"❌ Verification Error: {e}")

if __name__ == "__main__":
    verify_submission()
