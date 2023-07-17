from google.oauth2 import service_account
import gspread
import csv

# Define the output file path
output_file = 'fetched_routine.csv'
# Set up credentials and authenticate
scopes = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
credentials = service_account.Credentials.from_service_account_file('credentials.json', scopes=scopes)
client = gspread.authorize(credentials)

# Access the specific spreadsheet and sheet
spreadsheet_id = '1NRd3pMD9S2sEnt1mhqBAj_07z-dwRGbFANMsD4ReFL0'
sheet_name = 'classes'
sheet = client.open_by_key(spreadsheet_id).worksheet(sheet_name)

# Retrieve the table data
table_range = 'A1:M98'  # Example range, adjust as per your table size
table_data = sheet.get(table_range)

# Process the retrieved data
# Process the retrieved data
# for row in table_data:
#     formatted_row = []
#     for item in row:
#         formatted_item = str(item).ljust(15)  # Adjust the width as needed
#         formatted_row.append(formatted_item)
#     print(' | '.join(formatted_row))
# Process the retrieved data and format the rows
formatted_data = []
for row in table_data:
    formatted_row = []
    for item in row:
        formatted_item = str(item).ljust(15)  # Adjust the width as needed
        formatted_row.append(formatted_item)
    formatted_data.append(formatted_row)

# Export the formatted data to CSV
with open(output_file, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerows(formatted_data)

print(f"Fetched Routine data exported to {output_file} successfully.")

