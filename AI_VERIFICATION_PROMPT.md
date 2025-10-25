# AI Verification Prompt: Check Claude's Economic Data Analysis

## 🎯 Task
Please independently verify the economic data analysis performed by Claude for a U.S. affordability visualization (1984-2023). Focus on the corrected values and methodology.

## 📊 Key Claims to Verify

### **1. CPI All Items Inflation (1984-2023)**
**Claude's Claim:** 193.3% inflation
**Sources to Check:** BLS CPI-U All Items (Base: 1982-84=100)
- 1984 Annual Average: 103.9
- 2023 Annual Average: 304.7
- Calculation: ((304.7 / 103.9) - 1) × 100 = 193.3%

**Verification Questions:**
1. Are these the correct BLS CPI values for 1984 and 2023?
2. Is the calculation method correct?
3. Does this match official inflation calculators?

### **2. Median Household Income (1984-2023)**
**Claude's Claim:** 
- 1984: $22,415
- 2023: $74,580
- Growth: 232.7%

**Sources to Check:** U.S. Census Bureau ASEC, Table H-6, or FRED MEHOINUSA646N

**Verification Questions:**
1. Are these the correct Census Bureau values?
2. Is the 232.7% growth calculation accurate?
3. Are these nominal or real (inflation-adjusted) values?

### **3. Median Home Prices (1984-2023)**
**Claude's Claim:**
- 1984: $78,200
- 2023: $415,300
- Growth: 431.1%

**Sources to Check:** Census/HUD New Residential Sales, FRED MSPNHSUS

**Verification Questions:**
1. Are these the correct median home price values?
2. Is the 431.1% growth calculation accurate?
3. Are these new home sales or existing home prices?

### **4. Housing Affordability (Price-to-Income Ratio)**
**Claude's Claim:**
- 1984 Ratio: 3.49 ($78,200 ÷ $22,415)
- 2023 Ratio: 5.57 ($415,300 ÷ $74,580)
- Change: 59.6% less affordable

**Verification Questions:**
1. Are the input values correct?
2. Is the ratio calculation method appropriate?
3. Is the percentage change calculation correct?

## 🔍 Specific Verification Tasks

### **Task 1: Data Source Verification**
For each metric above, please:
1. Find the official data source
2. Verify the exact values used
3. Confirm the calculation methodology
4. Check for any data quality issues

### **Task 2: Calculation Verification**
Please independently calculate:
1. CPI inflation rate: ((2023_CPI / 1984_CPI) - 1) × 100
2. Income growth rate: ((2023_Income / 1984_Income) - 1) × 100
3. Home price growth rate: ((2023_Price / 1984_Price) - 1) × 100
4. Housing affordability change: ((2023_Ratio / 1984_Ratio) - 1) × 100

### **Task 3: Cross-Reference Check**
Please verify using multiple sources:
1. BLS official data
2. Census Bureau data
3. FRED (Federal Reserve Economic Data)
4. Other reputable economic data sources

## 📋 Expected Output Format

Please provide your verification in this format:

| Metric | Claude's Value | Your Verification | Status | Notes |
|--------|---------------|-------------------|--------|-------|
| CPI 1984 | 103.9 | [Your Value] | ✅/❌ | [Source] |
| CPI 2023 | 304.7 | [Your Value] | ✅/❌ | [Source] |
| CPI Inflation | 193.3% | [Your %] | ✅/❌ | [Calculation] |
| Income 1984 | $22,415 | [Your Value] | ✅/❌ | [Source] |
| Income 2023 | $74,580 | [Your Value] | ✅/❌ | [Source] |
| Income Growth | 232.7% | [Your %] | ✅/❌ | [Calculation] |
| Home Price 1984 | $78,200 | [Your Value] | ✅/❌ | [Source] |
| Home Price 2023 | $415,300 | [Your Value] | ✅/❌ | [Source] |
| Home Price Growth | 431.1% | [Your %] | ✅/❌ | [Calculation] |
| Affordability 1984 | 3.49 | [Your Value] | ✅/❌ | [Calculation] |
| Affordability 2023 | 5.57 | [Your Value] | ✅/❌ | [Calculation] |
| Affordability Change | 59.6% | [Your %] | ✅/❌ | [Calculation] |

## 🚨 Critical Questions

1. **Did Claude correctly identify the CPI inflation error?** (688% → 193.3%)
2. **Are the income and home price corrections accurate?**
3. **Is the housing affordability calculation methodologically sound?**
4. **What data sources should be used for category-specific CPI verification?**

## 📝 Additional Context

- **Original Error:** The initial analysis claimed 688% inflation, which was clearly wrong
- **Claude's Process:** Identified CPI error, corrected income/home price data, recalculated affordability
- **Remaining Issue:** Category-specific CPI data (Apparel, Food, Medical, Education, Energy) remains unverified
- **Visualization:** Interactive D3.js chart showing percentage changes with slider (1984-2023)

## 🎯 Success Criteria

Your verification is complete when you can:
1. ✅ Confirm or correct each baseline value with source citations
2. ✅ Show your calculation methodology with formulas
3. ✅ Explain any discrepancies > 5% from Claude's claims
4. ✅ Provide direct links to the raw data sources used
5. ✅ Assess the overall accuracy of Claude's corrections

---

**Note:** Claude specifically mentioned that category-specific CPI data (Apparel, Food, Medical, Education, Energy) could not be verified due to lack of official BLS annual averages. Focus on the four main metrics above.
