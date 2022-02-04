import { useRef } from "react";
import AsyncSelect from "react-select/async";
import api from "../client";

const CategorySelect = ({ onChange }) => {
  const fetchTimeoutId = useRef(null);

  const fetchCategories = async (inputValue) => {
    try {
      return await api.categories.search({ query: inputValue });
    } catch (error) {
      throw error;
    }
  };

  const loadCategories = (inputValue, callback) => {
    if (fetchTimeoutId.current !== null) {
      clearTimeout(fetchTimeoutId.current);
    }

    fetchTimeoutId.current = setTimeout(async () => {
      const response = await fetchCategories(inputValue);

      const options = response.results.map((category) => ({
        value: category.id,
        label: category.name,
      }));
      callback(options);
    }, 1000);
  };

  return (
    <AsyncSelect
      loadOptions={loadCategories}
      onChange={(category) => onChange(category.value)}
      defaultOptions
    />
  );
};

export default CategorySelect;
