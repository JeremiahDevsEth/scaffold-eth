import React, { useState } from "react";
import { Button, Input } from "antd";

const SecretInput = ({ tx, writeContracts, refreshButton }) => {
  const [newSecret, setNewSecret] = useState("");
  const addSecret = async () => {
    await tx(writeContracts.Secrets.add(newSecret));
    setNewSecret("");
    refreshButton();
  };

  return (
    <div style={{ margin: 8 }}>
      <Input
        value={newSecret}
        onKeyUp={async e => {
          if (e.key === "Enter") {
            await addSecret();
          }
        }}
        onChange={e => {
          setNewSecret(e.target.value);
        }}
      />
      <Button
        style={{ marginTop: 8 }}
        onClick={async () => {
          await addSecret();
        }}
      >
        Add new secret!
      </Button>
    </div>
  );
};

export default SecretInput;
