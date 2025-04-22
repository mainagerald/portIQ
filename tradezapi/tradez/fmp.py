import os
import requests
from dotenv import load_dotenv

load_dotenv()

FMP_API_KEY = os.getenv('FMP_KEY')
FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3/'


def get_stock_quote(symbol):
    """
    Fetch stock quote from FMP API by symbol.
    Returns JSON response or raises an exception.
    """
    url = f"{FMP_BASE_URL}quote/{symbol}?apikey={FMP_API_KEY}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()
