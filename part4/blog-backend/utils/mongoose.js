const { NODE_ENV } = require('#@/utils/config');
const { connect } = require('#@/utils/mongoose/proddb');

const toJSON = {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
};

module.exports = {
  toJSON,
  connect,
  ...(NODE_ENV === 'test' && require('#@/utils/mongoose/testdb')),
};
