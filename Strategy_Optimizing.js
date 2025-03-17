// Configuration constants
const initialFastMARange = [5, 10, 15, 20, 25, 30];
const initialSlowMARange = [20, 30, 40, 50, 60, 70, 80, 90, 100];
const maTypes = ["SMA"]; // SMA and EMA are used
const kcLengthRange = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // KC lengths to test
const inputBoxIndices = [1, 2]; // Indices for Fast MA and Slow MA inputs
const kcInputIndex = 0; // KC input index
const maxWaitTime = 2000; // 15 seconds for price updates

// Utility function to set input values and simulate user interaction
function setRealInputValue(element, value) {
    let lastValue = element.value;
    element.value = value;
    let event = new Event("input", { bubbles: true });
    let tracker = element._valueTracker;
    if (tracker) tracker.setValue(lastValue);
    element.dispatchEvent(event);
    element.dispatchEvent(new Event("change", { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    element.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", bubbles: true }));
    element.blur();
}

// Get the current profit value from the UI
function getProfitValue() {
    let profitElement = document.querySelector(".highlightedValue-LVMgafTl");
    if (profitElement) {
        let profitText = profitElement.textContent.trim().replace(/−/g, "-");
        let profit = parseFloat(profitText.replace(/[^0-9.-]+/g, ""));
        return isNaN(profit) ? null : profit;
    }
    return null;
}

// Collect performance metrics (profit, drawdown, etc.)
function getMetrics() {
    let metricElements = document.querySelectorAll(".containerCell-hwB8aI49");
    if (metricElements.length < 5) return null;
    let drawdownText = metricElements[1].querySelector(".change-LVMgafTl")?.textContent || "0%";
    return {
        profit: getProfitValue(),
        drawdown: parseFloat(drawdownText.replace(/[^0-9.-]+/g, "")),
        percentProfitable: parseFloat(metricElements[3].querySelector(".value-LVMgafTl")?.textContent || "0"),
        profitFactor: parseFloat(metricElements[4].querySelector(".value-LVMgafTl")?.textContent || "0")
    };
}

// Wait for profit value to update after changing inputs
async function waitForProfitChange(previousProfit) {
    let startTime = Date.now();
    while (Date.now() - startTime < maxWaitTime) {
        let newProfit = getProfitValue();
        if (newProfit !== null && newProfit !== previousProfit) return newProfit;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return null;
}

// Extract coin name from the UI
function getCoinName() {
    let button = document.querySelector(".title-l31H9iuA");
    if (!button) return "Unknown";
    let text = button.textContent.trim();
    let match = text.match(/^(\w+)USDT/);
    return match ? match[1] : "Unknown";
}

// Set the MA type in the dropdown
async function setMAType(maType, inputFields) {
    let maButton = document.querySelector("#in_3");
    if (!maButton) {
        console.log("⚠️ MA dropdown button not found!");
        return false;
    }
    maButton.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    let dropdownItems = document.querySelectorAll(".menuBox-Kq3ruQo8 .item-jFqVJoPk");
    for (let item of dropdownItems) {
        let label = item.querySelector(".label-jFqVJoPk");
        if (label && label.textContent.trim().toUpperCase() === maType.toUpperCase()) {
            item.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            let fastInputField = inputFields[inputBoxIndices[0]];
            fastInputField.focus();
            setRealInputValue(fastInputField, fastInputField.value || "5");
            return true;
        }
    }
    console.log(`⚠️ MA type "${maType}" not found in dropdown!`);
    return false;
}

// Toggle the KC channel checkbox (activate/deactivate)
function toggleKCChannel(checked) {
    const labels = document.querySelectorAll('label');
    for (let label of labels) {
        if (label.innerText.includes("Use KC Momentum")) {
            const checkbox = label.querySelector('input[type="checkbox"]');
            if (!checkbox) {
                console.log("⚠️ KC channel checkbox input not found!");
                return false;
            }
            if (checkbox.checked !== checked) {
                checkbox.click();
                console.log("KC channel toggled. Current state:", checkbox.checked);
            } else {
                console.log("KC channel already in desired state:", checkbox.checked);
            }
            return true;
        }
    }
    console.log("⚠️ KC channel checkbox not found!");
    return false;
}

// Play a sound when testing is complete
function playCompletionSound() {
    const audio = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"); // Example sound URL
    audio.play()
        .then(() => console.log("🔔 Played completion sound!"))
        .catch((error) => console.log("⚠️ Failed to play sound:", error));
}

// Run tests for KC lengths and MA crossovers
async function runTests(kcLengthRange, initialFastMARange, initialSlowMARange, maType, coinName, inputFields) {
    let results = [];
    for (let kcLength of kcLengthRange) {
        console.log(`🌟 Testing KC Length: ${kcLength}`);
        let kcInputField = inputFields[kcInputIndex];
        kcInputField.focus();
        setRealInputValue(kcInputField, kcLength);
        await new Promise(resolve => setTimeout(resolve, 500));

        for (let fastMA of initialFastMARange) {
            for (let slowMA of initialSlowMARange) {
                // Ensure Slow MA > Fast MA (at least 1 step difference)
                if (slowMA <= fastMA) continue;

                let fastInputField = inputFields[inputBoxIndices[0]];
                let slowInputField = inputFields[inputBoxIndices[1]];
                fastInputField.focus();
                setRealInputValue(fastInputField, fastMA);
                slowInputField.focus();
                setRealInputValue(slowInputField, slowMA);
                await new Promise(resolve => setTimeout(resolve, 500));
                let previousProfit = getProfitValue();
                let newProfit = await waitForProfitChange(previousProfit);
                if (newProfit !== null) {
                    let metrics = getMetrics();
                    if (metrics) {
                        results.push({
                            kcLength,
                            fastMA,
                            slowMA,
                            profit: newProfit,
                            drawdown: metrics.drawdown,
                            percentProfitable: metrics.percentProfitable,
                            profitFactor: metrics.profitFactor
                        });
                    }
                } else {
                    console.log(`⚠️ Error: No profit update for KC Length: ${kcLength}, Fast MA: ${fastMA}, Slow MA: ${slowMA} after 15 seconds`);
                }
            }
        }
    }
    return results;
}

// Save results to a file
function saveResults(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    console.log(`✅ Results saved to ${filename}`);
}

// Main testing function
async function startTesting() {
    // Start the timer
    const startTime = Date.now();
    console.log("⏱️ Starting testing...");

    // Ensure the KC channel is active
    console.log("Activating KC channel...");
    if (!toggleKCChannel(true)) {
        console.log("⚠️ Failed to activate KC channel. Exiting.");
        return;
    }

    // Collect all input fields
    let inputFields = document.querySelectorAll(".input-RUSovanF");
    if (inputFields.length === 0 || inputBoxIndices.some(i => i >= inputFields.length) || kcInputIndex >= inputFields.length) {
        console.log("⚠️ Input fields not found or indices out of range!");
        return;
    }

    let coinName = getCoinName();

    // Loop through each MA type (SMA and EMA)
    for (let maType of maTypes) {
        console.log(`🌟 Testing MA type: ${maType}`);
        if (await setMAType(maType, inputFields)) {
            // Run tests for all combinations of KC Length, Fast MA, and Slow MA
            let results = await runTests(kcLengthRange, initialFastMARange, initialSlowMARange, maType, coinName, inputFields);
            if (results.length > 0) {
                // Sort results by profit factor
                results.sort((a, b) => b.profitFactor - a.profitFactor);

                // Calculate total time taken in minutes
                const endTime = Date.now();
                const totalTimeMinutes = ((endTime - startTime) / 1000 / 60).toFixed(2);
                console.log(`⏱️ Total time taken: ${totalTimeMinutes} minutes`);

                // Add total time to results
                results.unshift({ totalTimeMinutes });

                // Save results to a file
                const filename = `${coinName}_${maType}_results.json`;
                saveResults(filename, results);
                console.table(results.slice(0, 10)); // Display top 10 results
            } else {
                console.log(`⚠️ No valid results for ${maType}`);
            }
        }
    }

    // Play completion sound
    playCompletionSound();
    console.log("✅ Testing completed!");
}

// Start the testing process
startTesting();