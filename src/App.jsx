
import React, { useState, useMemo, useCallback } from "react";
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

const CredentialsTable = ({ credentials, setCredentials, getCredentials }) => {
  // switchが押された時の挙動
  // on  -> prodでjsonを上書き
  // off -> devでjsonを上書き
  const handleOnChange = useCallback((event) => {
    const credentialName = event.target.id;
    const isProd = event.target.checked ? "prod" : "dev";
    const targetCred = credentials[credentialName][isProd]
    setCredentials({
      ...getCredentials,
      [credentialName]: targetCred
    })
  }, [])

  // checkboxが押されてるかどうかを保持するstate
  // trueのkeyの場合選択されたvalueがjsonに出力される
  const checkListInitialState = useMemo(() => {
    let initialState = {};
    Object.keys(credentials).map((credential) => {
      initialState[credential] = true
    });
    return initialState;
  }, [])
  const [getCheckList, setCheckList] = useState(checkListInitialState);

  // checkboxが押された時の挙動
  // on  -> rowを
  // off -> rowを
  const handleOnCheck = useCallback((event) => {
    const key = event.target.id;
    const isChecked = event.target.checked;
    setCheckList({
      ...getCheckList,
      [key]: isChecked
    })
  }, []);
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
            // dev or prod しかないフラグ
            const hasOtherCred = credentials[credential].hasOwnProperty("dev") && credentials[credential].hasOwnProperty("prod");
            return (
              <Tr key={credential}>
              <Td><Checkbox defaultChecked onChange={handleOnCheck} id={credential}></Checkbox></Td>
              <Td>{credential}</Td>
              <Td>
                <SimpleGrid row={2}>
                  {/**
                    devかprod片方しかない場合はswitchをdisableにしておく
                    prodしかない場合は初期値をprodにする
                   */}
                  {getCheckList[credential] ? <Switch
                   colorsheme={"gray"}
                   className={"Centering"}
                   id={credential}
                   isDisabled={!hasOtherCred}
                   isChecked={credentials[credential].dev ? undefined : true}
                   onChange={handleOnChange}
                  ></Switch>: <span className={"EmptySpace"}></span>}
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
  // devがない場合はprod
  const initialCredentials = useMemo(() => {
    let initialCreds = {};
    Object.keys(credentials).forEach(key => {
      initialCreds[key] = credentials[key].dev ?? credentials[key].prod;
    });
    return initialCreds;
  }, [])
  const [getCredentials, setCredentials] = useState(initialCredentials);
  return (
    <ChakraProvider>
      <SimpleGrid columns={2}>
        <CredentialsTable credentials={credentials} setCredentials={setCredentials} getCredentials={getCredentials} />
        <JsonField credentials={JSON.stringify(getCredentials, null, 2)} />
      </SimpleGrid>
    </ChakraProvider>
  );
}
