def calculate_emissions(distance, vehicle_type):
    """
    Calculate the emissions based on distance and vehicle type.

    :param distance: Distance in kilometers
    :param vehicle_type: Type of vehicle (car, bike, truck)
    :return: Emissions in kg CO₂
    """
    # Emission factors in kg CO₂/km
    emission_factors = {
        "car": 0.21,
        "bike": 0.08,
        "truck": 0.5
    }

    # Default to car emission factor if vehicle type is not found
    emission_factor = emission_factors.get(vehicle_type, 0.21)
    emissions = round(distance * emission_factor, 2)
    return emissions