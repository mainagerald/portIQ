import smtplib
import os
from dotenv import load_dotenv

load_dotenv()

# Get email settings from environment variables
email_host = os.getenv('EMAIL_HOST')
email_port = int(os.getenv('EMAIL_PORT', 587))
email_user = os.getenv('EMAIL_HOST_USER')
email_password = os.getenv('EMAIL_HOST_PASSWORD')

print(f"Testing connection to {email_host}:{email_port} with user {email_user}")

try:
    # Attempt to connect to the SMTP server
    server = smtplib.SMTP(email_host, email_port)
    server.set_debuglevel(1)  # Enable verbose debug output
    
    # Identify ourselves to the server
    server.ehlo()
    
    # If we use TLS, put the connection in TLS mode
    server.starttls()
    server.ehlo()  # Re-identify ourselves over TLS connection
    
    # Login to server
    server.login(email_user, email_password)
    
    print("\nSUCCESS: Connected to SMTP server and authenticated!")
    
    # Close connection
    server.quit()
    
except Exception as e:
    print(f"\nERROR: {e}")
    print("\nTroubleshooting tips:")
    print("1. Check if your email/password are correct")
    print("2. For Gmail, use an App Password instead of your regular password")
    print("3. Check if your firewall is blocking outgoing connections to port 587")
    print("4. Try a different network connection")
