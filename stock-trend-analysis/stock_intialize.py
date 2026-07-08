import yfinance as yf
import matplotlib.pyplot as plt
ticker_symbol = "AAPL"

ticker = yf.Ticker(ticker_symbol)

stock_data = ticker.history(period="5y")
print("Apple Stock Data: ")
print(stock_data)

stock_data['Close'].plot(kind='line', color='orange')
plt.show()
