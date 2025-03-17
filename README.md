# Strategy_Optimizing

🚀 **Automated Trading Strategy Tester for Keltner Channel (KC) and Moving Averages (MA)**

This script is designed to automate the testing of different configurations for a trading strategy using the **Keltner Channel (KC)** and **Moving Averages (MA)** on a trading platform. It systematically tests various combinations of KC lengths, Fast MA, and Slow MA values to find the most profitable configurations. Perfect for traders and developers looking to optimize their strategies!

---

## ✨ **Features**

- **Automated Testing**: Automates the process of testing different KC lengths and MA crossover configurations.
- **Performance Metrics**: Collects key performance metrics such as **profit**, **drawdown**, **percent profitable**, and **profit factor**.
- **Results Export**: Saves the test results to a **JSON file** for further analysis.
- **User Interaction Simulation**: Simulates user interactions to set input values and trigger updates in the trading platform UI.
- **Completion Notification**: Plays a sound notification when the testing process is complete.

---

## ⚙️ **Configuration**

The script uses the following configuration constants:

| **Parameter**         | **Description**                                                                 |
|------------------------|---------------------------------------------------------------------------------|
| `initialFastMARange`   | Range of values for the **Fast MA** (e.g., `[5, 10, 15, 20, 25, 30]`).          |
| `initialSlowMARange`   | Range of values for the **Slow MA** (e.g., `[20, 30, 40, 50, 60, 70, 80, 90, 100]`). |
| `maTypes`              | Types of Moving Averages to test (e.g., `["SMA"]` for Simple Moving Average).   |
| `kcLengthRange`        | Range of values for the **KC length** (e.g., `[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]`). |
| `inputBoxIndices`      | Indices for Fast MA and Slow MA input fields in the UI.                         |
| `kcInputIndex`         | Index for the KC input field in the UI.                                         |
| `maxWaitTime`          | Maximum wait time (in milliseconds) for price updates after changing inputs.    |

---

## 🛠️ **Usage**

### **Step 1: Setup**
- Ensure that the trading platform UI is open and the necessary elements are accessible.
- Make sure the script has access to the required DOM elements (e.g., input fields, buttons, and profit display).

### **Step 2: Run the Script**
Execute the `startTesting()` function to begin the testing process.

```javascript
// Start the testing process
startTesting();
```

### **Step 3: Review Results**
- The script will save the results to a **JSON file** (e.g., `BTC_SMA_results.json`).
- The top 10 configurations will be displayed in the console for quick review.

---

## 📂 **Output**

The script generates a **JSON file** containing the test results, sorted by **profit factor**. The file is named according to the coin and MA type (e.g., `BTC_SMA_results.json`).

Example output:

```json
[
  {
    "kcLength": 10,
    "fastMA": 5,
    "slowMA": 20,
    "profit": 150.25,
    "drawdown": 5.3,
    "percentProfitable": 60.5,
    "profitFactor": 2.1
  },
  {
    "kcLength": 12,
    "fastMA": 10,
    "slowMA": 30,
    "profit": 140.75,
    "drawdown": 6.1,
    "percentProfitable": 58.7,
    "profitFactor": 1.9
  }
]
```

---

## 📜 **Functions**

| **Function**                          | **Description**                                                                 |
|---------------------------------------|---------------------------------------------------------------------------------|
| `setRealInputValue(element, value)`   | Sets the value of an input field and simulates user interaction.                |
| `getProfitValue()`                    | Retrieves the current profit value from the UI.                                |
| `getMetrics()`                        | Collects performance metrics from the UI.                                      |
| `waitForProfitChange(previousProfit)` | Waits for the profit value to update after changing inputs.                    |
| `getCoinName()`                       | Extracts the coin name from the UI.                                            |
| `setMAType(maType, inputFields)`      | Sets the MA type in the dropdown.                                              |
| `toggleKCChannel(checked)`            | Toggles the KC channel checkbox.                                               |
| `playCompletionSound()`               | Plays a sound when testing is complete.                                        |
| `runTests(...)`                       | Runs tests for all combinations of KC lengths and MA crossovers.               |
| `saveResults(filename, data)`         | Saves the test results to a file.                                              |
| `startTesting()`                      | Main function to start the testing process.                                    |

---

## 🎯 **Example**

```javascript
// Start the testing process
startTesting();
```


---

## 🎉 **Completion Sound**

When the testing process is complete, the script will play a **bell sound** to notify you. Make sure your browser allows audio playback for the best experience!

---

## 📝 **Notes**

- Ensure that the trading platform UI is stable and the elements are correctly identified by the script.
- Adjust the configuration constants as needed to fit your specific testing requirements.
- This script is designed for educational and personal use only. Unauthorized distribution or use is prohibited.

---

Happy testing! 🚀
