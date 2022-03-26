
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
  Switch,
  Button,
  Flex
} from '@chakra-ui/react'
import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CopyToClipboard } from "react-copy-to-clipboard";
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
    setCredentials((state) => ({
      ...state,
      [credentialName]: targetCred
    }))
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
    // checkされてるかどうかのstate更新
    setCheckList((state) => ({
      ...state,
      [key]: isChecked
    }))
    const target = isChecked ? credentials[key].dev ?? credentials[key].prod : undefined;
    // jsonに出力するstateの更新
    setCredentials((state) => ({
      ...state,
      [key]: target
    }))
  }, []);

  // Switchの下に表示するテキストを返す
  const switchText = useCallback((key) => {
    if (credentials[key].dev && credentials[key].prod) {
      return "dev/prod"
    } else if (credentials[key].dev && !credentials[key].prod) {
      return "only dev"
    } else if (!credentials[key].dev && credentials[key].prod) {
      return "only prod";
    }
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
                  <span className={`Centering ${getCheckList[credential] ? "" : "DisableColor"}`}>{switchText(credential)}</span>
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
  // アウトプットの json/文字列 を持つstate
  const [isJson, setIsJson] = useState(true);

  // アウトプットの形式変更ボタンが押された時の挙動
  const handleOnClick = useCallback(() => {
    setIsJson((state) => !state);
  }, []);

  // アウトプットの形式変更ボタンのテキスト
  const ButtonText = useMemo(() => {
    return isJson ? "toString" : "toJson"
  }, [isJson]);

  // アウトプットの形式を変更する
  // JSON or JSON文字列
  const jsonCredentials = useMemo(() => {
    if (isJson) {
      return JSON.stringify(credentials, null, 2)
    }
    return `'${JSON.stringify(credentials)}'`;
  }, [isJson, credentials]);
  return (
    <div className={"OuterJson"}>
      <SyntaxHighlighter language={"json"} style={dark}>
        {jsonCredentials}
      </SyntaxHighlighter>
      <div className={"CopyButton"}>
        <CopyToClipboard text={jsonCredentials}>
          <Button colorScheme='blue' size={"xs"}>COPY</Button>
        </CopyToClipboard>
        <span className={"ChangeButton"}><Button colorScheme='blue' size={"xs"} onClick={handleOnClick}>{ButtonText}</Button></span>
      </div>
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
        <JsonField credentials={getCredentials} />
      </SimpleGrid>
    </ChakraProvider>
  );
}
