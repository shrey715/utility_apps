import requests
from bs4 import BeautifulSoup
import json

url = "https://www.iban.com/country-codes"

response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

table = soup.find('table')
body = table.find('tbody')
rows = body.find_all('tr')

countries = {}

for row in rows:
    columns = row.find_all('td')
    name = columns[0].text 
    code = columns[1].text
    if name and code:
        countries[name] = code
        
with open('countries.json', 'w') as file:
    json.dump(countries, file, indent=2)

print('Done!')