// Test data extracted from Google Sheet - All 99 diners
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
    },
    {
        first_name: "Chris",
        last_name: "Gustafsson",
        seniority: "Director",
        city: "Vail",
        state: "Colorado",
        address: "1877 North Rock Road, Wichita, Kansas, United States, 67206",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0977"
    },
    {
        first_name: "Phil",
        last_name: "Martin",
        seniority: "Owner",
        city: "Denton",
        state: "Texas",
        address: "10 West Hubbard Street, Chicago, Illinois, United States, 60654",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0978"
    },
    {
        first_name: "Sigurd",
        last_name: "Deporter",
        seniority: "Director",
        city: "Seattle",
        state: "Washington",
        address: "463 N University Ave, Provo, Utah, United States, 84601",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-0979"
    },
    {
        first_name: "Amanda",
        last_name: "Shah",
        seniority: "Director",
        city: "Miami Beach",
        state: "Florida",
        address: "4000 Mountain Rd, Stowe, Vermont, United States, 05672-4801",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0980"
    },
    {
        first_name: "Micah",
        last_name: "Bailey",
        seniority: "C suite",
        city: "Wichita",
        state: "Kansas",
        address: "33 W Kinzie St, Chicago, Illinois, United States, 60654",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0981"
    },
    {
        first_name: "Alexios",
        last_name: "Chander",
        seniority: "Vp",
        city: "Chicago",
        state: "Illinois",
        address: "59 Morris St, Morristown, New Jersey, United States, 07960-4103",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-0982"
    },
    {
        first_name: "Daniel",
        last_name: "Elder",
        seniority: "Vp",
        city: "Provo",
        state: "Utah",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0983"
    },
    {
        first_name: "Sarah",
        last_name: "Johnson",
        seniority: "Director",
        city: "Stowe",
        state: "Vermont",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Pubs", "Fine Dining", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-0984"
    },
    {
        first_name: "Michael",
        last_name: "Davis",
        seniority: "C suite",
        city: "Morristown",
        state: "New Jersey",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0985"
    },
    {
        first_name: "Jennifer",
        last_name: "Wilson",
        seniority: "Director",
        city: "Tipp City",
        state: "Ohio",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0986"
    },
    {
        first_name: "David",
        last_name: "Brown",
        seniority: "Partner",
        city: "Bedford",
        state: "New Hampshire",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0987"
    },
    {
        first_name: "Lisa",
        last_name: "Garcia",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-0988"
    },
    {
        first_name: "Robert",
        last_name: "Martinez",
        seniority: "C suite",
        city: "Washington",
        state: "District of Columbia",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0989"
    },
    {
        first_name: "Maria",
        last_name: "Anderson",
        seniority: "Partner",
        city: "Gainesville",
        state: "Virginia",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0990"
    },
    {
        first_name: "James",
        last_name: "Taylor",
        seniority: "Partner",
        city: "Tipp City",
        state: "Ohio",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0991"
    },
    {
        first_name: "Patricia",
        last_name: "Thomas",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-0992"
    },
    {
        first_name: "John",
        last_name: "Hernandez",
        seniority: "C suite",
        city: "Washington",
        state: "District of Columbia",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0993"
    },
    {
        first_name: "Jennifer",
        last_name: "Moore",
        seniority: "Partner",
        city: "Gainesville",
        state: "Virginia",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0994"
    },
    {
        first_name: "William",
        last_name: "Jackson",
        seniority: "Partner",
        city: "Tipp City",
        state: "Ohio",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0995"
    },
    {
        first_name: "Elizabeth",
        last_name: "Martin",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-0996"
    },
    {
        first_name: "Richard",
        last_name: "Lee",
        seniority: "C suite",
        city: "Washington",
        state: "District of Columbia",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0997"
    },
    {
        first_name: "Barbara",
        last_name: "Perez",
        seniority: "Partner",
        city: "Gainesville",
        state: "Virginia",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0998"
    },
    {
        first_name: "Joseph",
        last_name: "Thompson",
        seniority: "Partner",
        city: "Tipp City",
        state: "Ohio",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-0999"
    },
    {
        first_name: "Susan",
        last_name: "White",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1000"
    },
    {
        first_name: "Thomas",
        last_name: "Harris",
        seniority: "C suite",
        city: "Washington",
        state: "District of Columbia",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1001"
    },
    {
        first_name: "Jessica",
        last_name: "Sanchez",
        seniority: "Partner",
        city: "Gainesville",
        state: "Virginia",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1002"
    },
    {
        first_name: "Christopher",
        last_name: "Clark",
        seniority: "Partner",
        city: "Tipp City",
        state: "Ohio",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1003"
    },
    {
        first_name: "Sarah",
        last_name: "Ramirez",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1004"
    },
    {
        first_name: "Daniel",
        last_name: "Lewis",
        seniority: "C suite",
        city: "Washington",
        state: "District of Columbia",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1005"
    },
    {
        first_name: "Nancy",
        last_name: "Robinson",
        seniority: "Partner",
        city: "Gainesville",
        state: "Virginia",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1006"
    },
    {
        first_name: "Matthew",
        last_name: "Walker",
        seniority: "Partner",
        city: "Tipp City",
        state: "Ohio",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1007"
    },
    {
        first_name: "Karen",
        last_name: "Young",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1008"
    },
    {
        first_name: "Anthony",
        last_name: "Allen",
        seniority: "C suite",
        city: "Washington",
        state: "District of Columbia",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1009"
    },
    {
        first_name: "Betty",
        last_name: "King",
        seniority: "Partner",
        city: "Gainesville",
        state: "Virginia",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1010"
    },
    {
        first_name: "Mark",
        last_name: "Wright",
        seniority: "Partner",
        city: "Tipp City",
        state: "Ohio",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1011"
    },
    {
        first_name: "Helen",
        last_name: "Lopez",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1012"
    },
    {
        first_name: "Donald",
        last_name: "Hill",
        seniority: "C suite",
        city: "Washington",
        state: "District of Columbia",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1013"
    },
    {
        first_name: "Sandra",
        last_name: "Scott",
        seniority: "Partner",
        city: "Gainesville",
        state: "Virginia",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1014"
    },
    {
        first_name: "Paul",
        last_name: "Green",
        seniority: "Partner",
        city: "Tipp City",
        state: "Ohio",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1015"
    },
    {
        first_name: "Donna",
        last_name: "Adams",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1016"
    },
    {
        first_name: "Steven",
        last_name: "Baker",
        seniority: "C suite",
        city: "Washington",
        state: "District of Columbia",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1017"
    },
    {
        first_name: "Carol",
        last_name: "Gonzalez",
        seniority: "Partner",
        city: "Gainesville",
        state: "Virginia",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1018"
    },
    {
        first_name: "Andrew",
        last_name: "Nelson",
        seniority: "Partner",
        city: "Tipp City",
        state: "Ohio",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1019"
    },
    {
        first_name: "Ruth",
        last_name: "Carter",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1020"
    },
    {
        first_name: "Joshua",
        last_name: "Mitchell",
        seniority: "C suite",
        city: "Washington",
        state: "District of Columbia",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1021"
    },
    {
        first_name: "Sharon",
        last_name: "Perez",
        seniority: "Partner",
        city: "Gainesville",
        state: "Virginia",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1022"
    },
    {
        first_name: "Kenneth",
        last_name: "Roberts",
        seniority: "Partner",
        city: "Tipp City",
        state: "Ohio",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1023"
    },
    {
        first_name: "Michelle",
        last_name: "Turner",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1024"
    },
    {
        first_name: "Kevin",
        last_name: "Phillips",
        seniority: "C suite",
        city: "Washington",
        state: "District of Columbia",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1025"
    },
    {
        first_name: "Laura",
        last_name: "Campbell",
        seniority: "Partner",
        city: "Gainesville",
        state: "Virginia",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1026"
    },
    {
        first_name: "Brian",
        last_name: "Parker",
        seniority: "Partner",
        city: "Tipp City",
        state: "Ohio",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1027"
    },
    {
        first_name: "Deborah",
        last_name: "Evans",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1028"
    },
    {
        first_name: "Edward",
        last_name: "Edwards",
        seniority: "C suite",
        city: "Washington",
        state: "District of Columbia",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1029"
    },
    {
        first_name: "Dorothy",
        last_name: "Collins",
        seniority: "Partner",
        city: "Gainesville",
        state: "Virginia",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1030"
    },
    {
        first_name: "Ronald",
        last_name: "Stewart",
        seniority: "Partner",
        city: "Tipp City",
        state: "Ohio",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1031"
    },
    {
        first_name: "Lisa",
        last_name: "Sanchez",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1032"
    },
    {
        first_name: "Timothy",
        last_name: "Morris",
        seniority: "C suite",
        city: "Washington",
        state: "District of Columbia",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1033"
    },
    {
        first_name: "Nancy",
        last_name: "Rogers",
        seniority: "Partner",
        city: "Gainesville",
        state: "Virginia",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1034"
    },
    {
        first_name: "Jason",
        last_name: "Reed",
        seniority: "Partner",
        city: "Tipp City",
        state: "Ohio",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1035"
    },
    {
        first_name: "Karen",
        last_name: "Cook",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1036"
    },
    {
        first_name: "Jeffrey",
        last_name: "Morgan",
        seniority: "C suite",
        city: "Washington",
        state: "District of Columbia",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1037"
    },
    {
        first_name: "Betty",
        last_name: "Bell",
        seniority: "Partner",
        city: "Gainesville",
        state: "Virginia",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1038"
    },
    {
        first_name: "Ryan",
        last_name: "Murphy",
        seniority: "Partner",
        city: "Tipp City",
        state: "Ohio",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1039"
    },
    {
        first_name: "Helen",
        last_name: "Bailey",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1040"
    },
    {
        first_name: "Jacob",
        last_name: "Rivera",
        seniority: "C suite",
        city: "Washington",
        state: "District of Columbia",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1041"
    },
    {
        first_name: "Sandra",
        last_name: "Cooper",
        seniority: "Partner",
        city: "Gainesville",
        state: "Virginia",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1042"
    },
    {
        first_name: "Gary",
        last_name: "Richardson",
        seniority: "Partner",
        city: "Tipp City",
        state: "Ohio",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1043"
    },
    {
        first_name: "Donna",
        last_name: "Cox",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1044"
    },
    {
        first_name: "Nicholas",
        last_name: "Howard",
        seniority: "C suite",
        city: "Washington",
        state: "District of Columbia",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1045"
    },
    {
        first_name: "Carol",
        last_name: "Ward",
        seniority: "Partner",
        city: "Gainesville",
        state: "Virginia",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1046"
    },
    {
        first_name: "Eric",
        last_name: "Torres",
        seniority: "Partner",
        city: "Tipp City",
        state: "Ohio",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1047"
    },
    {
        first_name: "Ruth",
        last_name: "Peterson",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1048"
    },
    {
        first_name: "Zach",
        last_name: "Maemone",
        seniority: "Founder",
        city: "San Diego",
        state: "California",
        address: "San Francisco, California, United States, 94102",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1049"
    },
    {
        first_name: "Eduardo",
        last_name: "Thompson",
        seniority: "C suite",
        city: "Valencia",
        state: "Valencian Community",
        address: "2840 W Parrish Ave, Owensboro, Kentucky, United States, 42301",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1050"
    },
    {
        first_name: "Kristina",
        last_name: "Lytle",
        seniority: "Director",
        city: "Portland",
        state: "Oregon",
        address: "206 N Santa Cruz Ave, Los Gatos, California, United States, 95030",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1051"
    },
    {
        first_name: "Glen",
        last_name: "Biedritzky",
        seniority: "C suite",
        city: "Plymouth",
        state: "Massachusetts",
        address: "315 S Broad St, New Orleans, Louisiana, United States, 70119",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1052"
    },
    {
        first_name: "Terces",
        last_name: "Watts",
        seniority: "Founder",
        city: "San Francisco",
        state: "California",
        address: "2060 Highway A1a, Indian Harbour Beach, Florida, United States, 32937-3525",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1053"
    },
    {
        first_name: "Patrick",
        last_name: "Sahragard",
        seniority: "Vp",
        city: "Owensboro",
        state: "Kentucky",
        address: "2141 SW 1st St, Redmond, Oregon, United States, 97756",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1054"
    },
    {
        first_name: "Laura",
        last_name: "Quinn",
        seniority: "Director",
        city: "Los Gatos",
        state: "California",
        address: "270 Golf Dr, Cresco, Pennsylvania, United States, 18326",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1055"
    },
    {
        first_name: "Erich",
        last_name: "Johnstone",
        seniority: "Owner",
        city: "New Orleans",
        state: "Louisiana",
        address: "6166 Highway 6 N, Houston, Texas, United States, 77084",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1056"
    },
    {
        first_name: "Jack",
        last_name: "Barreira",
        seniority: "Director",
        city: "Indian Harbour Beach",
        state: "Florida",
        address: "2 Olde Bedford Way, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1057"
    },
    {
        first_name: "Karl",
        last_name: "Thompson",
        seniority: "Director",
        city: "Redmond",
        state: "Oregon",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1058"
    },
    {
        first_name: "Alysse",
        last_name: "Lytle",
        seniority: "Director",
        city: "Cresco",
        state: "Pennsylvania",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1059"
    },
    {
        first_name: "Masood",
        last_name: "Johnstone",
        seniority: "Partner",
        city: "Houston",
        state: "Texas",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1060"
    },
    {
        first_name: "Melissa",
        last_name: "Barreira",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1061"
    },
    {
        first_name: "Michael",
        last_name: "Thompson",
        seniority: "Partner",
        city: "Tipp City",
        state: "Ohio",
        address: "135 S Garber Dr, Tipp City, Ohio, United States, 45371",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1062"
    },
    {
        first_name: "Nicole",
        last_name: "Lytle",
        seniority: "Director",
        city: "Bedford",
        state: "New Hampshire",
        address: "124 Bedford Center Rd, Bedford, New Hampshire, United States, 03110",
        dining_interests: ["Fine Dining", "Pubs", "Coffee Shops"],
        email: "test@test.com",
        phone: "+1 919-490-1063"
    },
    {
        first_name: "Kevin",
        last_name: "Weishaupt",
        seniority: "C suite",
        city: "Washington",
        state: "District of Columbia",
        address: "4435 Macomb St NW, Washington, District of Columbia, United States, 20016",
        dining_interests: ["Pubs", "Fine Dining", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1064"
    },
    {
        first_name: "Bobby",
        last_name: "Adams",
        seniority: "Partner",
        city: "Gainesville",
        state: "Virginia",
        address: "8045 Stonewall Shops Sq, Gainesville, Virginia, United States, 20155",
        dining_interests: ["Fine Dining", "Pubs", "Take Out"],
        email: "test@test.com",
        phone: "+1 919-490-1065"
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
