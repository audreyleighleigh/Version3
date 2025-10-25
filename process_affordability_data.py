import pandas as pd
import numpy as np

def process_affordability_data():
    """
    Process data to calculate housing affordability using price-to-income ratios.
    This measures how housing costs changed relative to income, not general inflation.
    """
    print("🔄 Processing affordability data...")
    print("=" * 50)
    
    # Read the data files
    print("📁 Reading data files...")
    
    # Median income data (already annual)
    income_df = pd.read_csv('medianannualincome.csv')
    income_df['YEAR'] = pd.to_datetime(income_df['observation_date']).dt.year
    income_df = income_df[['YEAR', 'MEHOINUSA646N']].rename(columns={'MEHOINUSA646N': 'MEDIAN_INCOME'})
    
    # CPI data files (monthly data) - for non-housing categories
    clothing_df = pd.read_csv('clothing.csv')
    food_df = pd.read_csv('food.csv')
    medcare_df = pd.read_csv('medcare.csv')
    energy_df = pd.read_csv('energy.csv')
    education_df = pd.read_csv('tuitionchildcare.csv')
    
    # Housing data (dollar amounts, not CPI)
    housing_df = pd.read_csv('housing.csv')
    
    print("✅ Data files loaded")
    print()
    
    print("📊 Extracting January values for each year...")
    
    # Function to extract January values for each year
    def extract_january_values(df, date_col, value_col):
        df['YEAR'] = pd.to_datetime(df[date_col]).dt.year
        df['MONTH'] = pd.to_datetime(df[date_col]).dt.month
        # Filter for January (month = 1) only
        january_data = df[df['MONTH'] == 1][['YEAR', value_col]]
        return january_data
    
    # Extract January values for CPI categories
    clothing_jan = extract_january_values(clothing_df, 'observation_date', 'CPIAPPSL')
    food_jan = extract_january_values(food_df, 'observation_date', 'CUSR0000SAF11')
    medcare_jan = extract_january_values(medcare_df, 'observation_date', 'CPIMEDSL')
    energy_jan = extract_january_values(energy_df, 'observation_date', 'CPIENGSL')
    education_jan = extract_january_values(education_df, 'observation_date', 'CUSR0000SEEB')
    
    # Extract January values for housing (dollar amounts)
    housing_jan = extract_january_values(housing_df, 'observation_date', 'MSPUS')
    
    print("✅ January values extracted")
    print()
    
    print("🧮 Calculating affordability metrics...")
    
    # Function to calculate CPI percentage change for non-housing categories
    def calculate_cpi_percentage_change(df, cpi_col):
        # Get 1984 baseline value
        baseline_1984 = df[df['YEAR'] == 1984][cpi_col].iloc[0]
        
        # Calculate percentage change for each year
        df['PERCENTAGE_CHANGE'] = (
            (df[cpi_col] - baseline_1984) / baseline_1984 * 100
        )
        
        return df[['YEAR', 'PERCENTAGE_CHANGE']]
    
    # Function to calculate housing affordability (price-to-income ratio)
    def calculate_housing_affordability(housing_df, income_df):
        # Merge housing and income data
        merged = housing_df.merge(income_df, on='YEAR', how='inner')
        
        # Calculate price-to-income ratios
        merged['PRICE_TO_INCOME'] = merged['MSPUS'] / merged['MEDIAN_INCOME']
        
        # Get 1984 baseline ratio
        baseline_1984 = merged[merged['YEAR'] == 1984]['PRICE_TO_INCOME'].iloc[0]
        
        # Calculate percentage change in affordability
        merged['AFFORDABILITY_CHANGE'] = (
            (merged['PRICE_TO_INCOME'] / baseline_1984 - 1) * 100
        )
        
        return merged[['YEAR', 'AFFORDABILITY_CHANGE']]
    
    # Calculate percentage changes for CPI categories
    clothing_pct = calculate_cpi_percentage_change(clothing_jan, 'CPIAPPSL')
    food_pct = calculate_cpi_percentage_change(food_jan, 'CUSR0000SAF11')
    medcare_pct = calculate_cpi_percentage_change(medcare_jan, 'CPIMEDSL')
    energy_pct = calculate_cpi_percentage_change(energy_jan, 'CPIENGSL')
    education_pct = calculate_cpi_percentage_change(education_jan, 'CUSR0000SEEB')
    
    # Calculate housing affordability
    housing_affordability = calculate_housing_affordability(housing_jan, income_df)
    
    print("✅ Affordability metrics calculated")
    print()
    
    # Show some key results
    print("📈 Key Results (2023):")
    print("-" * 50)
    
    # Housing affordability
    if 2023 in housing_affordability['YEAR'].values:
        housing_2023 = housing_affordability[housing_affordability['YEAR'] == 2023]['AFFORDABILITY_CHANGE'].iloc[0]
        print(f"Housing Affordability: {housing_2023:.2f}% (price-to-income ratio change)")
    
    # CPI categories
    categories = [
        ('Clothing', clothing_pct),
        ('Groceries', food_pct),
        ('Medical Care', medcare_pct),
        ('Energy', energy_pct),
        ('Education', education_pct)
    ]
    
    for name, data in categories:
        if 2023 in data['YEAR'].values:
            value_2023 = data[data['YEAR'] == 2023]['PERCENTAGE_CHANGE'].iloc[0]
            print(f"{name}: {value_2023:.2f}% (CPI change)")
    
    print()
    
    print("📋 Creating master CSV...")
    
    # Create the master CSV with all categories
    master_data = []
    
    # Get all years from 1984-2023
    all_years = range(1984, 2024)
    
    for year in all_years:
        # Clothing
        clothing_val = clothing_pct[clothing_pct['YEAR'] == year]['PERCENTAGE_CHANGE'].iloc[0] if year in clothing_pct['YEAR'].values else 0
        master_data.append({'YEAR': year, 'CATEGORY': 'clothing', 'SIZE': round(clothing_val, 4)})
        
        # Housing (affordability)
        housing_val = housing_affordability[housing_affordability['YEAR'] == year]['AFFORDABILITY_CHANGE'].iloc[0] if year in housing_affordability['YEAR'].values else 0
        master_data.append({'YEAR': year, 'CATEGORY': 'housing', 'SIZE': round(housing_val, 4)})
        
        # Groceries
        food_val = food_pct[food_pct['YEAR'] == year]['PERCENTAGE_CHANGE'].iloc[0] if year in food_pct['YEAR'].values else 0
        master_data.append({'YEAR': year, 'CATEGORY': 'groceries', 'SIZE': round(food_val, 4)})
        
        # Medical Care
        medcare_val = medcare_pct[medcare_pct['YEAR'] == year]['PERCENTAGE_CHANGE'].iloc[0] if year in medcare_pct['YEAR'].values else 0
        master_data.append({'YEAR': year, 'CATEGORY': 'medical', 'SIZE': round(medcare_val, 4)})
        
        # Education
        education_val = education_pct[education_pct['YEAR'] == year]['PERCENTAGE_CHANGE'].iloc[0] if year in education_pct['YEAR'].values else 0
        master_data.append({'YEAR': year, 'CATEGORY': 'education', 'SIZE': round(education_val, 4)})
        
        # Energy
        energy_val = energy_pct[energy_pct['YEAR'] == year]['PERCENTAGE_CHANGE'].iloc[0] if year in energy_pct['YEAR'].values else 0
        master_data.append({'YEAR': year, 'CATEGORY': 'energy', 'SIZE': round(energy_val, 4)})
    
    # Create DataFrame and save to CSV
    master_df = pd.DataFrame(master_data)
    master_df.to_csv('all_categories_affordability.csv', index=False)
    
    print("✅ Master CSV created successfully!")
    print(f"📊 Total rows: {len(master_df)}")
    print(f"📅 Years covered: {master_df['YEAR'].min()} - {master_df['YEAR'].max()}")
    print(f"🏷️  Categories: {', '.join(master_df['CATEGORY'].unique())}")
    
    # Show sample data
    print("\n📋 Sample data:")
    print(master_df.head(20))
    
    return master_df

if __name__ == "__main__":
    try:
        print("🚀 Starting affordability data processing...")
        result_df = process_affordability_data()
        print("\n🎉 Data processing completed successfully!")
        print("📁 Output file: all_categories_affordability.csv")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
