import yfinance as yf
import matplotlib.pyplot as plt
import mplcursors

ticker_symbols = ["AAPL", "MSFT", "NVDA", "TSLA", "AMZN"]

tickers = []
stock_data = []
lines = []

for x in range(5):
    ticker = yf.Ticker(ticker_symbols[x])
    tickers.append(ticker)
print(tickers)

for x in range(5):
    stock_par_data = tickers[x].history(period="5y")
    stock_data.append(stock_par_data)

print("Stock Data: ")
print(stock_data)

plt.figure(figsize=(15, 4))
# THIS IS FOR ONE SINGLE GRAPH

for x in range(5):
    line = stock_data[x]['Close'].plot(kind='line', label=ticker_symbols[x])
    lines.append(line)

mplcursors.cursor(hover=True)

plt.legend()
plt.show()

# THIS IS FOR SEPERATE GRAPHS

# for x in range(5):
#     stock_data[x]['Close'].plot(kind='line', color='orange')
#     plt.show()
