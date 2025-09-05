// Test data extracted from Google Sheet
const dinersData = [
    {
        first_name: "Lynette",
        last_name: "Carl",
        seniority: "Director",
        city: "Durham",
        state: "North Carolina",
        address: "1 Seaport Lane, Boston, Massachusetts, United States, 02210",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-0967"
    },
    {
        first_name: "Flemming",
        last_name: "Jones",
        seniority: "Vp",
        city: "Los Angeles",
        state: "California",
        address: "4480 Highway 22, Mandeville, Louisiana, United States, 70471-3311",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0968"
    },
    {
        first_name: "Jenifer",
        last_name: "Howe",
        seniority: "Director",
        city: "Phoenix",
        state: "Arizona",
        address: "1510 16th St, Sacramento, California, United States, 95814",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0969"
    },
    {
        first_name: "Margaret",
        last_name: "Renzi",
        seniority: "Director",
        city: "New Orleans",
        state: "Louisiana",
        address: "11380 Lindbergh Blvd, Fort Myers, Florida, United States, 33913",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-0970"
    },
    {
        first_name: "Lauri",
        last_name: "Biggs",
        seniority: "Director",
        city: "Boston",
        state: "Massachusetts",
        address: "3138 Fillmore St, San Francisco, California, United States, 94123",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0971"
    },
    {
        first_name: "Nicholas",
        last_name: "Brown",
        seniority: "Vp",
        city: "Mandeville",
        state: "Louisiana",
        address: "2190 Pimmit Dr, Falls Church, Virginia, United States, 22043-2805",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0972"
    },
    {
        first_name: "Sean",
        last_name: "Ward",
        seniority: "C suite",
        city: "Sacramento",
        state: "California",
        address: "20 Vail Rd, Vail, Colorado, United States, 81657",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-0973"
    },
    {
        first_name: "Racheal",
        last_name: "Miller",
        seniority: "Head",
        city: "Fort Myers",
        state: "Florida",
        address: "111 W Mulberry St, Denton, Texas, United States, 76201",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0974"
    },
    {
        first_name: "McKenzie",
        last_name: "Cofelice",
        seniority: "Vp",
        city: "San Francisco",
        state: "California",
        address: "NE 45th St, Seattle, Washington, United States, 98195",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0975"
    },
    {
        first_name: "Keith",
        last_name: "Shirley",
        seniority: "Director",
        city: "Falls Church",
        state: "Virginia",
        address: "1220 16th St, Miami Beach, Florida, United States, 33139-2309",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-0976"
    }
];

// Sample restaurants for testing
const restaurantsData = [
    {
        name: "The Golden Fork",
        email: "owner@goldenfork.com",
        password_hash: "$2b$10$rQZ8K9mN2pL3oI4uY5vW6eR7tY8uI9oP0aS1dF2gH3jK4lM5nB6cV7xZ8wE9rT0", // "password123"
        city: "Boston",
        state: "Massachusetts"
    },
    {
        name: "Coastal Bistro",
        email: "manager@coastalbistro.com",
        password_hash: "$2b$10$rQZ8K9mN2pL3oI4uY5vW6eR7tY8uI9oP0aS1dF2gH3jK4lM5nB6cV7xZ8wE9rT0", // "password123"
        city: "San Francisco",
        state: "California"
    },
    {
        name: "Downtown Delights",
        email: "chef@downtowndelights.com",
        password_hash: "$2b$10$rQZ8K9mN2pL3oI4uY5vW6eR7tY8uI9oP0aS1dF2gH3jK4lM5nB6cV7xZ8wE9rT0", // "password123"
        city: "New York",
        state: "New York"
    }
];

// Sample campaigns for testing
const campaignsData = [
    {
        restaurant_id: 1,
        name: "Summer Fine Dining Special",
        subject: "Exclusive Summer Menu Launch",
        message: "Join us for our exclusive summer menu featuring fresh, locally-sourced ingredients. Book your table today!",
        campaign_type: "email"
    },
    {
        restaurant_id: 1,
        name: "Weekend Brunch Promotion",
        subject: "Weekend Brunch Special",
        message: "Enjoy our famous weekend brunch with bottomless mimosas and live jazz music every Saturday and Sunday.",
        campaign_type: "email"
    },
    {
        restaurant_id: 2,
        name: "Coastal Seafood Festival",
        subject: "Fresh Seafood Festival This Weekend",
        message: "Don't miss our annual seafood festival featuring the freshest catches from local fishermen.",
        campaign_type: "sms"
    }
];

module.exports = {
    dinersData,
    restaurantsData,
    campaignsData
};
