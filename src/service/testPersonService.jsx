import { addTestPersons as addTestPersonsAPI } from "../apiHandler/testPersonAPIHandler";
import { getTestPersonById } from "../apiHandler/testPersonAPIHandler";

export const addTestPersons = async (testPersons) => {
  if (!Array.isArray(testPersons) || testPersons.length === 0) {
    throw new Error("Test persons data is required");
  }
  try {
    return await addTestPersonsAPI(testPersons);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to add test persons"
    );
  }
};

export const fetchTestPersonById = async (id) => {
  if (!id) throw new Error("TestPerson ID is required");
  try {
    return await getTestPersonById(id);
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch test person by id"
    );
  }
};
