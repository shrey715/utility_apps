import requests
from bs4 import BeautifulSoup
import json

url = "https://www.exchangerate-api.com/docs/supported-currencies"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

currency_data = {}

table = soup.find_all("table")[-1]
if table:
    for row in table.find_all("tr")[1:]:  
        cols = row.find_all("td")
        if len(cols) >= 2:
            code = cols[0].text.strip()
            name = cols[1].text.strip()
            currency_data[code] = name

with open("currencies.json", "w") as f:
    json.dump(currency_data, f, indent=4)

print("Currency data saved to currencies.json")
