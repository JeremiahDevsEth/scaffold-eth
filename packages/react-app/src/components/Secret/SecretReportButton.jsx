import React, { useEffect, useState } from "react";
import { Button } from "antd";

const SecretReportButton = ({ tx, address, readContracts, writeContracts, item }) => {
  const [isUserReported, setIsUserReported] = useState(false);

  async function getUserReport() {
    const response = await readContracts.Secrets.getUserReport(address, item.entity_id);
    setIsUserReported(response);
  }

  async function reportSecret() {
    await tx(writeContracts.Secrets.report(item.entity_id));
  }

  useEffect(() => {
    getUserReport();
  }, [address, item]);

  return (
    <Button
      style={{ marginTop: 8 }}
      onClick={async () => {
        await reportSecret();
        setIsUserReported(!isUserReported);
      }}
    >
      {isUserReported ? "Delete Report" : "Report Abuse"}
    </Button>
  );
};

export default SecretReportButton;
