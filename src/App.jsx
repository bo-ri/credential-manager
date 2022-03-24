
import React from "react";
import {
  ChakraProvider,
  SimpleGrid
} from '@chakra-ui/react'
import credentials from "../credentials.json";

const CredentialsTable = () => {
  return (
    <div>
    </div>
  );
}

const JsonField = () => {
  return (
    <div>
    </div>
  );
}

export const App = () => {
  return (
    <ChakraProvider>
      <SimpleGrid columns={2}>
        <CredentialsTable />
        <JsonField />
      </SimpleGrid>
    </ChakraProvider>
  );
}
