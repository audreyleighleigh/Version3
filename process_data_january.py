import pandas as pd
import numpy as np

def process_january_cpi_data():
    """
    Process January CPI data to calculate total percentage changes since 1984.
    Uses January values only instead of monthly averages.
    """
    print("🔄 Processing January CPI data...")
    print("=" * 50)
    
    # Read the data files
    print("📁 Reading data files...")
    
    # Median income data (already annual)
    income_df = pd.read_csv('medianannualincome.csv')
    income_df['YEAR'] = pd.to_datetime(income_df['observation_date']).dt.year
    income_df = income_df[['YEAR', 'MEHOINUSA646N']].rename(columns={'MEHOINUSA646N': 'MEDIAN_INCOME'})
    
    # CPI data files (monthly data)
    clothing_df = pd.read_csv('clothing.csv')
    food_df = pd.read_csv('food.csv')
    medcare_df = pd.read_csv('medcare.csv')
    energy_df = pd.read_csv('energy.csv')
    housing_df = pd.read_csv('housing.csv')
    education_df = pd.read_csv('tuitionchildcare.csv')
    
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
    
    # Extract January CPI values for each year
    clothing_jan = extract_january_values(clothing_df, 'observation_date', 'CPIAPPSL')
    food_jan = extract_january_values(food_df, 'observation_date', 'CUSR0000SAF11')
    medcare_jan = extract_january_values(medcare_df, 'observation_date', 'CPIMEDSL')
    energy_jan = extract_january_values(energy_df, 'observation_date', 'CPIENGSL')
    housing_jan = extract_january_values(housing_df, 'observation_date', 'CUSR0000SEEB')
    education_jan = extract_january_values(education_df, 'observation_date', 'CUSR0000SEEB')
    
    print("✅ January values extracted")
    print()
    
    print("🧮 Calculating total percentage changes since 1984...")
    
    # Function to calculate total percentage change since 1984
    def calculate_total_percentage_change(df, cpi_col):
        # Get 1984 baseline value
        baseline_1984 = df[df['YEAR'] == 1984][cpi_col].iloc[0]
        
        # Calculate percentage change for each year
        df['TOTAL_PERCENTAGE_CHANGE'] = (
            (df[cpi_col] - baseline_1984) / baseline_1984 * 100
        )
        
        return df[['YEAR', 'TOTAL_PERCENTAGE_CHANGE']]
    
    # Calculate total percentage changes for each category
    clothing_pct = calculate_total_percentage_change(clothing_jan, 'CPIAPPSL')
    food_pct = calculate_total_percentage_change(food_jan, 'CUSR0000SAF11')
    medcare_pct = calculate_total_percentage_change(medcare_jan, 'CPIMEDSL')
    energy_pct = calculate_total_percentage_change(energy_jan, 'CPIENGSL')
    housing_pct = calculate_total_percentage_change(housing_jan, 'CUSR0000SEEB')
    education_pct = calculate_total_percentage_change(education_jan, 'CUSR0000SEEB')
    
    print("✅ Total percentage changes calculated")
    print()
    
    # Show some key results
    print("📈 Key Results (Total % Change since 1984):")
    print("-" * 50)
    
    categories = [
        ('Clothing', clothing_pct, 'CPIAPPSL'),
        ('Housing', housing_pct, 'CUSR0000SEEB'),
        ('Groceries', food_pct, 'CUSR0000SAF11'),
        ('Medical Care', medcare_pct, 'CPIMEDSL'),
        ('Education', education_pct, 'CUSR0000SEEB'),
        ('Energy', energy_pct, 'CPIENGSL')
    ]
    
    for name, data, col in categories:
        if 2023 in data['YEAR'].values:
            value_2023 = data[data['YEAR'] == 2023]['TOTAL_PERCENTAGE_CHANGE'].iloc[0]
            print(f"{name}: {value_2023:.2f}%")
        else:
            print(f"{name}: No 2023 data available")
    
    print()
    
    print("📋 Creating master CSV...")
    
    # Create the master CSV with all categories
    master_data = []
    
    # Get all years from 1984-2023
    all_years = range(1984, 2024)
    
    for year in all_years:
        # Clothing
        clothing_val = clothing_pct[clothing_pct['YEAR'] == year]['TOTAL_PERCENTAGE_CHANGE'].iloc[0] if year in clothing_pct['YEAR'].values else 0
        master_data.append({'YEAR': year, 'CATEGORY': 'clothing', 'SIZE': round(clothing_val, 4)})
        
        # Housing
        housing_val = housing_pct[housing_pct['YEAR'] == year]['TOTAL_PERCENTAGE_CHANGE'].iloc[0] if year in housing_pct['YEAR'].values else 0
        master_data.append({'YEAR': year, 'CATEGORY': 'housing', 'SIZE': round(housing_val, 4)})
        
        # Groceries
        food_val = food_pct[food_pct['YEAR'] == year]['TOTAL_PERCENTAGE_CHANGE'].iloc[0] if year in food_pct['YEAR'].values else 0
        master_data.append({'YEAR': year, 'CATEGORY': 'groceries', 'SIZE': round(food_val, 4)})
        
        # Medical Care
        medcare_val = medcare_pct[medcare_pct['YEAR'] == year]['TOTAL_PERCENTAGE_CHANGE'].iloc[0] if year in medcare_pct['YEAR'].values else 0
        master_data.append({'YEAR': year, 'CATEGORY': 'medical', 'SIZE': round(medcare_val, 4)})
        
        # Education
        education_val = education_pct[education_pct['YEAR'] == year]['TOTAL_PERCENTAGE_CHANGE'].iloc[0] if year in education_pct['YEAR'].values else 0
        master_data.append({'YEAR': year, 'CATEGORY': 'education', 'SIZE': round(education_val, 4)})
        
        # Energy
        energy_val = energy_pct[energy_pct['YEAR'] == year]['TOTAL_PERCENTAGE_CHANGE'].iloc[0] if year in energy_pct['YEAR'].values else 0
        master_data.append({'YEAR': year, 'CATEGORY': 'energy', 'SIZE': round(energy_val, 4)})
    
    # Create DataFrame and save to CSV
    master_df = pd.DataFrame(master_data)
    master_df.to_csv('all_categories_january.csv', index=False)
    
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
        print("🚀 Starting January CPI data processing...")
        result_df = process_january_cpi_data()
        print("\n🎉 Data processing completed successfully!")
        print("📁 Output file: all_categories_january.csv")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

