import yfinance as yf
import matplotlib.pyplot as plt
import mplcursors


# Lists

ticker_symbols = ["AAPL", "MSFT", "NVDA", "TSLA", "AMZN"]
tickers = []
stock_data = []
lines = []

# Variables and User Input for viewing stocks
print("AAPL, MSFT, NVDA, TSLA, AMZN (0-4)")
stock_preference = int(input(
    "Which Stock would you like to see data for (0,1,2,3,4)? "))
stock_view = input(
    "How would you like to view these stocks? ('head', 'tail', 'describe', 'info') ")
stock_graph = input(
    "How would you like to graph these stocks? ('Close', 'Open', 'High', 'Low', 'Volume', 'Dividends', 'Stock Splits') ")


# Create ticker objects for the ticker symbols.
for x in range(len(ticker_symbols)):
    ticker = yf.Ticker(ticker_symbols[x])
    tickers.append(ticker)
print(tickers)


# Load ticker's history of five year span.

for x in range(len(ticker_symbols)):
    stock_par_data = tickers[x].history(period="5y")
    stock_data.append(stock_par_data)


# Print the retrieved data in a formatted style.
print("Stock Data: ")
if stock_view == "head":
    print(stock_data[stock_preference].head())

elif stock_view == "tail":
    print(stock_data[stock_preference].tail())

elif stock_view == "describe":
    print(stock_data[stock_preference].describe())

elif stock_view == "info":
    print(stock_data[stock_preference].info())

else:
    print("Invalid option")

plt.figure(figsize=(15, 4))

# Single Graph
# This Plots data for all the history shown in the terminal and labels it using mpl cursors hover feature to see exact values of any time in the stocks 5y time
for x in range(len(ticker_symbols)):
    line = stock_data[x][stock_graph].plot(
        kind='line', label=ticker_symbols[x])
    lines.append(line)

mplcursors.cursor(lines, hover=True)

# Show plot and legend for the graph
plt.legend()
plt.show()


# Multiple Graphs
# Shows all 5 stocks in diffrent graphs
# for x in range(len(ticker_symbols)):
#     stock_data[x]['Close'].plot(kind='line', color='orange')
#     plt.show()
