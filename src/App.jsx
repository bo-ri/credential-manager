
import React from "react";
import {
  ChakraProvider,
  SimpleGrid,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Checkbox,
  Switch
} from '@chakra-ui/react'
import credentials from "../credentials.json";
import "./styles.css"

const CredentialsTable = ({ credentials }) => {
  return (
    <div>
      <Table variant={"simple"}>
        <Thead>
          <Tr>
            <Th></Th>
            <Th>credential name</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(credentials).map((credential) => {
            return (
              <Tr key={credential}>
              <Td><Checkbox defaultChecked></Checkbox></Td>
              <Td>{credential}</Td>
              <Td>
                <SimpleGrid row={2}>
                  <Switch colorSheme={"gray"} className={"Centering"}></Switch>
                  <span className={"Centering"}>dev/prod</span>
                </SimpleGrid>
              </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
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
        <CredentialsTable credentials={credentials} />
        <JsonField />
      </SimpleGrid>
    </ChakraProvider>
  );
}
