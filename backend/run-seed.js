const devData = require('./data/development-data/index.js');
const seed = require('./seed.js');
const db = require('./connection.js');

const runSeed = () => {
    return seed(devData).then(() => {
        console.log("Database seeded successfully!");
        return db.pool.end();
    });
};

runSeed().catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
});
