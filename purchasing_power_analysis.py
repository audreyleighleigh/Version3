import pandas as pd
import numpy as np
import os

BASE_YEAR = 1984

def load_income(path="medianannualincome.csv"):
    """Load median annual income data"""
    inc = pd.read_csv(path)
    inc["YEAR"] = pd.to_datetime(inc["observation_date"]).dt.year
    inc = inc[["YEAR", "MEHOINUSA646N"]].rename(columns={"MEHOINUSA646N": "INCOME"})
    return inc

def load_category_cpi(category_name, path=None):
    """Load CPI data for a specific category, extracting January values only"""
    if path is None:
        path = f"{category_name}.csv"
    
    # Read the CSV
    cpi_data = pd.read_csv(path)
    
    # Convert dates and extract year and month
    cpi_data['date'] = pd.to_datetime(cpi_data['observation_date'])
    cpi_data['YEAR'] = cpi_data['date'].dt.year
    cpi_data['MONTH'] = cpi_data['date'].dt.month
    
    # Filter for January only (month = 1)
    january_data = cpi_data[cpi_data['MONTH'] == 1].copy()
    
    # Get the CPI column name (second column)
    cpi_col = cpi_data.columns[1]
    
    # Extract year and January CPI value
    january_data = january_data[['YEAR', cpi_col]].rename(columns={cpi_col: 'CPI'})
    
    return january_data

def calculate_relative_affordability(cpi_data, income_data):
    """
    Calculate relative affordability using the formula:
    ((CPI_jan_current_year / CPI_jan_1984) / (Income_current_year / Income_1984) - 1) × 100
    
    Positive % = costs grew faster than income (less affordable)
    Negative % = income grew faster than costs (more affordable)
    """
    
    # Get base year values
    cpi_base = cpi_data[cpi_data['YEAR'] == BASE_YEAR]['CPI'].iloc[0]
    income_base = income_data[income_data['YEAR'] == BASE_YEAR]['INCOME'].iloc[0]
    
    # Merge CPI and income data
    merged = pd.merge(cpi_data, income_data, on='YEAR', how='inner')
    
    # Calculate relative affordability
    merged['relative_affordability'] = (
        ((merged['CPI'] / cpi_base) / (merged['INCOME'] / income_base)) - 1
    ) * 100
    
    return merged[['YEAR', 'CPI', 'INCOME', 'relative_affordability']]

def main():
    # Load income data
    print("Loading income data...")
    income_data = load_income()
    
    # Define categories and their CSV files
    categories = {
        'housing': 'housing.csv',
        'clothing': 'clothing.csv', 
        'groceries': 'food.csv',
        'medical': 'medcare.csv',
        'education': 'tuitionchildcare.csv',
        'energy': 'energy.csv'
    }
    
    # Calculate relative affordability for each category
    results = {}
    
    print("\nCalculating relative affordability for each category...")
    for category_name, csv_file in categories.items():
        if os.path.exists(csv_file):
            print(f"Processing {category_name}...")
            cpi_data = load_category_cpi(category_name, csv_file)
            affordability = calculate_relative_affordability(cpi_data, income_data)
            results[category_name] = affordability
        else:
            print(f"Warning: {csv_file} not found, skipping {category_name}")
    
    # Display results
    print("\n" + "="*80)
    print("RELATIVE AFFORDABILITY ANALYSIS (1984-2023)")
    print("Formula: ((CPI_jan_current_year / CPI_jan_1984) / (Income_current_year / Income_1984) - 1) × 100")
    print("Positive % = costs grew faster than income (less affordable)")
    print("Negative % = income grew faster than costs (more affordable)")
    print("="*80)
    
    # Show key years for each category
    key_years = [1984, 1990, 2000, 2010, 2020, 2023]
    
    for category_name, data in results.items():
        print(f"\n{category_name.upper()}:")
        print("-" * 50)
        
        for year in key_years:
            if year in data['YEAR'].values:
                row = data[data['YEAR'] == year].iloc[0]
                cpi = row['CPI']
                income = row['INCOME']
                affordability = row['relative_affordability']
                
                print(f"{year}: CPI={cpi:.1f}, Income=${income:,.0f}, Affordability={affordability:+.1f}%")
    
    # Summary statistics
    print("\n" + "="*80)
    print("SUMMARY STATISTICS (1984-2023)")
    print("="*80)
    
    for category_name, data in results.items():
        start_val = data[data['YEAR'] == BASE_YEAR]['relative_affordability'].iloc[0]
        end_val = data[data['YEAR'] == 2023]['relative_affordability'].iloc[0]
        total_change = end_val - start_val
        
        print(f"\n{category_name.capitalize()}:")
        print(f"  1984: {start_val:6.1f}%")
        print(f"  2023: {end_val:6.1f}%")
        print(f"  Total change: {total_change:6.1f}%")
        
        if total_change > 0:
            print(f"  → Became {total_change:.1f}% less affordable over 40 years")
        else:
            print(f"  → Became {abs(total_change):.1f}% more affordable over 40 years")
    
    # Save results
    print("\n" + "="*80)
    print("SAVING RESULTS")
    print("="*80)
    
    # Save individual category results
    for category_name, data in results.items():
        filename = f"affordability_{category_name}.csv"
        data.to_csv(filename, index=False)
        print(f"Saved: {filename}")
    
    # Create combined results
    combined_data = []
    for category_name, data in results.items():
        data_copy = data.copy()
        data_copy['CATEGORY'] = category_name
        combined_data.append(data_copy)
    
    combined_df = pd.concat(combined_data, ignore_index=True)
    combined_df.to_csv("all_categories_affordability.csv", index=False)
    print("Saved: all_categories_affordability.csv")
    
    print(f"\nAll results saved! Check the CSV files for detailed data.")

if __name__ == "__main__":
    main()
