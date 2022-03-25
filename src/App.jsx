
import React, { useState, useMemo } from "react";
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
import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import credentials from "../credentials.json";
import "./styles.css"

const CredentialsTable = ({ credentials }) => {
  return (
    <div className={"OuterTable"}>
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
                  <Switch colorsheme={"gray"} className={"Centering"}></Switch>
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

const JsonField = ({credentials}) => {
  return (
    <div className={"OuterJson"}>
      <SyntaxHighlighter language={"json"} style={dark}>
        {credentials}
      </SyntaxHighlighter>
    </div>
  );
}

export const App = () => {
  // credentialsの初期値 devの値だけ抜き出す
  const initialCredentials = useMemo(() => {
    let initialCreds = {};
    Object.keys(credentials).forEach(key => {
      initialCreds[key] = credentials[key].dev;
    });
    return initialCreds;
  }, [])
  const [getCredentials, setCredentials] = useState(initialCredentials);
  return (
    <ChakraProvider>
      <SimpleGrid columns={2}>
        <CredentialsTable credentials={credentials} />
        <JsonField credentials={JSON.stringify(getCredentials, null, 2)} />
      </SimpleGrid>
    </ChakraProvider>
  );
}
