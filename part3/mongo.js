const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4] ? process.argv[4] : "";

const url = `mongodb+srv://fullstack:${password}@cluster0.pywwops.mongodb.net/phonebook?appName=Cluster0`;

mongoose.set("strictQuery", false);

/* 👇 1. Schema y model PRIMERO */
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

/* 👇 2. Luego la conexión */
mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");

    if (process.argv.length === 3) {
      Person.find({}).then((persons) => {
        console.log("phonebook:");
        persons.forEach((person) => {
          console.log(person.name, person.number);
        });
        mongoose.connection.close();
      });
    } else {
      const person = new Person({ name, number });

      person.save().then(() => {
        console.log(
          `added ${person.name} ${
            person.number.length > 0
              ? `number ${person.number}`
              : "without number"
          } to phonebook`
        );
        mongoose.connection.close();
      });
    }
  })
  .catch((error) => {
    console.error("error connecting to MongoDB:", error.message);
  });
