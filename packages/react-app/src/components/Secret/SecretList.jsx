import React, { useEffect, useState } from "react";
import { Button, Card, List, Spin, Statistic } from "antd";
import SecretLikeButton from "./SecretLikeButton";
import SecretReportButton from "./SecretReportButton";
import SecretInput from "./SecretInput";
import ConfigData from "../../config.json";

const SecretList = ({ tx, address, readContracts, writeContracts }) => {
  const [secretCount, setSecretCount] = useState(0);
  const [secrets, setSecrets] = useState([]);
  const [cursor, setCursor] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isEndOfSecrets, setIsEndOfSecrets] = useState(false);

  async function getSecrets(currentCursor, limit = ConfigData.default_secret_page_limit) {
    return readContracts.Secrets.getPaginatedSecrets(currentCursor, limit);
  }

  async function getCount() {
    const response = await readContracts.Secrets.getCount();
    setSecretCount(response);
  }

  async function getPaginatedSecrets() {
    setIsLoading(true);
    const [response, newCursor, isEnd] = await getSecrets(cursor);
    setCursor(newCursor);
    setSecrets([...secrets, ...response]);
    setIsEndOfSecrets(isEnd);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  async function refreshSecrets() {
    setIsLoading(true);
    const [response, newCursor, isEnd] = await getSecrets(secretCount - 1);
    setCursor(newCursor);
    setSecrets(response);
    setIsEndOfSecrets(isEnd);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  useEffect(() => {
    if (readContracts && secretCount > 0) {
      refreshSecrets();
    }
  }, [readContracts, secretCount]);

  useEffect(() => {
    if (readContracts) {
      getCount();
    }
  }, [readContracts]);

  const loadMore = async () => {
    await getPaginatedSecrets();
  };

  const refreshButton = async () => {
    getCount();
    if (secretCount > 0) {
      await refreshSecrets();
    }
  };

  return (
    <>
      <SecretInput tx={tx} writeContracts={writeContracts} refreshButton={refreshButton} />
      <Button
        style={{ marginTop: 8 }}
        onClick={async () => {
          await refreshButton();
        }}
      >
        Refresh
      </Button>
      <Spin spinning={isLoading}>
        <Statistic title="Total secrets" value={secretCount ? secretCount.toString() : 0} />
        <List
          grid={{ gutter: 10, column: 10 }}
          dataSource={secrets.slice().sort((a, b) => {
            return b.created_at - a.created_at;
          })}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <Card title={item.text}>
                <p>Date: {new Date(item.created_at.toString() * 1000).toLocaleString("en-CA")}</p>
                <SecretLikeButton
                  tx={tx}
                  address={address}
                  readContracts={readContracts}
                  writeContracts={writeContracts}
                  item={item}
                />
                <SecretReportButton
                  tx={tx}
                  address={address}
                  readContracts={readContracts}
                  writeContracts={writeContracts}
                  item={item}
                />
              </Card>
            </List.Item>
          )}
        />
        <Button
          disabled={isEndOfSecrets}
          style={{ marginTop: 8 }}
          onClick={async () => {
            await loadMore();
          }}
        >
          Load More
        </Button>
      </Spin>
    </>
  );
};

export default SecretList;
