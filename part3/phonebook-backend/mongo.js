const mongoose = require('mongoose');
const { program } = require('commander');
const chalk = require('chalk');

const chalkSuccess = chalk.green;
const chalkError = chalk.bold.red;

let args;

program
  .arguments('<password> [name] [number]')
  .action((password, name, number) => {
    args = { password, name, number };
  });
program.parse();

const user = 'fullstack';
const db = 'phonebook';
const url = `mongodb+srv://${user}:${args.password}@cluster0.iiipbke.mongodb.net/${db}?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (args.name && args.number) {
  addPerson({ name: args.name, number: args.number });
} else {
  getPersons();
}

function addPerson(_person) {
  return mongoose
    .connect(url)
    .then((result) => console.log(`connected to ${result.connections[0].host}`))
    .then(() => {
      const person = new Person(_person);
      return person.save();
    })
    .then(() => console.log(chalkSuccess(`saved ${JSON.stringify(_person)}`)))
    .catch((err) => console.error(chalkError(err)))
    .finally(() => mongoose.connection.close());
}

function getPersons() {
  return mongoose
    .connect(url)
    .then((result) => console.log(`connected to ${result.connections[0].host}`))
    .then(() => {
      return Person.find({}).then((persons) => {
        console.log('phonebook:');
        persons.forEach((person) =>
          console.log(`${person.name} ${person.number}`),
        );
      });
    })
    .catch((err) => console.error(chalkError(err)))
    .finally(() => mongoose.connection.close());
}
