import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = async () => axios.get(baseUrl).then((response) => response.data);
const create = async (person) =>
  axios.post(baseUrl, person).then((response) => response.data);
/** delete is a js reserved keyword 🤷 */
const remove = async (id) =>
  axios.delete(`${baseUrl}/${id}`).then((response) => response.data);

const personService = {
  getAll,
  create,
  remove,
};

export default personService;
