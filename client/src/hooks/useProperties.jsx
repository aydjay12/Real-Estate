import React from 'react'
import { useQuery } from 'react-query'
import { getAllProperties } from '../utils/api.js'

const useProperties = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "allProperties",
    getAllProperties,
    { refetchOnWindowFocus: false }
  );

  return { data, isError, isLoading, refetch }; // Return an object
};

export default useProperties