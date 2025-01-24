def calculate_emissions(distance, vehicle_details):
    """
    Calculate emissions based on distance and detailed vehicle information.
    
    :param distance: Distance in kilometers
    :param vehicle_details: Dictionary containing vehicle information
    :return: Dictionary with emissions data and recommendations
    """
    # Base emission factors in kg CO₂/km
    base_emission_factors = {
        "car": {
            "gasoline": 0.21,
            "diesel": 0.25,
            "electric": 0.05,
            "hybrid": 0.12
        },
        "truck": {
            "gasoline": 0.5,
            "diesel": 0.6,
            "electric": 0.15,
            "hybrid": 0.3
        },
        "bike": {
            "manual": 0.08
        },
        "ev": {
            "electric": 0.05
        },
        "hybrid": {
            "hybrid": 0.12
        }
    }

    vehicle_type = vehicle_details.get('type', 'car')
    fuel_type = vehicle_details.get('fuelType', 'gasoline')
    efficiency = vehicle_details.get('efficiency', None)
    year = vehicle_details.get('year', 2020)

    # Get base emission factor
    emission_factor = base_emission_factors.get(vehicle_type, {}).get(fuel_type, 0.21)

    # Adjust for vehicle efficiency if provided
    if efficiency:
        if fuel_type == 'electric':
            # For electric vehicles, lower kWh/100mi means better efficiency
            emission_factor *= (35 / efficiency) if efficiency > 0 else 1
        else:
            # For ICE vehicles, higher MPG means better efficiency
            emission_factor *= (25 / efficiency) if efficiency > 0 else 1

    # Adjust for vehicle age
    current_year = 2024
    age_factor = 1 + (0.01 * max(0, current_year - year))
    emission_factor *= age_factor

    # Calculate total emissions
    emissions = round(distance * emission_factor, 2)

    # Calculate potential savings
    ev_emissions = round(distance * base_emission_factors['ev']['electric'], 2)
    hybrid_emissions = round(distance * base_emission_factors['hybrid']['hybrid'], 2)

    return {
        "emissions": emissions,
        "unit": "kg CO₂",
        "potential_savings": {
            "electric": round(emissions - ev_emissions, 2),
            "hybrid": round(emissions - hybrid_emissions, 2)
        },
        "recommendations": get_recommendations(vehicle_type, fuel_type, efficiency, emissions)
    }

def get_recommendations(vehicle_type, fuel_type, efficiency, emissions):
    """
    Generate eco-friendly recommendations based on vehicle details.
    
    :param vehicle_type: Type of vehicle
    :param fuel_type: Type of fuel
    :param efficiency: Vehicle efficiency
    :param emissions: Calculated emissions
    :return: List of recommendations
    """
    recommendations = []
    
    if fuel_type in ['gasoline', 'diesel']:
        recommendations.append("Consider switching to an electric or hybrid vehicle to reduce emissions")
    
    if efficiency and fuel_type != 'electric':
        if efficiency < 25:
            recommendations.append("Your vehicle's fuel efficiency is below average. Consider a more fuel-efficient model")
    
    if emissions > 10:
        recommendations.append("Consider carpooling or combining trips to reduce overall emissions")
    
    return recommendations