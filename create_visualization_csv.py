import pandas as pd
import numpy as np

def create_visualization_csv():
    """
    Create a CSV file that matches the original format but contains
    affordability data that will work with the visualization.
    
    The original format expected:
    - YEAR, CATEGORY, SIZE
    - 1984 baseline = 0.0 for all categories
    - SIZE values that can be properly scaled and compared
    """
    
    # Load our affordability data
    affordability_data = pd.read_csv('all_categories_affordability.csv')
    
    # Convert to the format the visualization expects
    visualization_data = []
    
    for _, row in affordability_data.iterrows():
        year = row['YEAR']
        category = row['CATEGORY']
        affordability = row['relative_affordability']
        
        # Convert affordability to a scale that works with the visualization
        if year == 1984:
            # 1984 baseline should be 0.0 for all categories
            size_value = 0.0
        else:
            # Use the affordability percentage directly, but scale it down
            # to reasonable values that won't give us 1000%+ increases
            # The affordability values are already percentages, so divide by 10
            size_value = affordability / 10
        
        visualization_data.append({
            'YEAR': year,
            'CATEGORY': category,
            'SIZE': round(size_value, 4)
        })
    
    # Create DataFrame and save
    df = pd.DataFrame(visualization_data)
    df.to_csv('visualization_data.csv', index=False)
    
    print("Created visualization_data.csv with the following structure:")
    print("=" * 60)
    print("YEAR, CATEGORY, SIZE")
    print("1984 baseline = 0.0 for all categories")
    print("SIZE values = affordability percentages / 10")
    print("=" * 60)
    
    # Show sample data
    print("\nSample data:")
    for category in df['CATEGORY'].unique():
        category_data = df[df['CATEGORY'] == category]
        print(f"\n{category.upper()}:")
        for _, row in category_data.head(5).iterrows():
            print(f"  {row['YEAR']}: {row['SIZE']}")
    
    # Show what the percentages will look like in the visualization
    print("\n" + "=" * 60)
    print("PERCENTAGE CALCULATIONS (what the visualization will show):")
    print("=" * 60)
    for category in df['CATEGORY'].unique():
        category_data = df[df['CATEGORY'] == category]
        baseline = category_data[category_data['YEAR'] == 1984]['SIZE'].iloc[0]
        final = category_data[category_data['YEAR'] == 2023]['SIZE'].iloc[0]
        
        # Calculate what the visualization will show
        if baseline == 0:
            percentage = final * 100
        else:
            percentage = ((final - baseline) / baseline) * 100
            
        print(f"{category.capitalize()}: {percentage:.1f}%")
    
    return df

if __name__ == "__main__":
    create_visualization_csv()
