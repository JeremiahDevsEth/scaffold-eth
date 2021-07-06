import React, { useEffect, useState } from "react";
import { Button } from "antd";

const SecretLikeButton = ({ tx, address, readContracts, writeContracts, item }) => {
  const [isUserLiked, setIsUserLiked] = useState(false);
  const [likeCounter, setLikeCounter] = useState(item.likes.toNumber());

  async function getUserLike() {
    const response = await readContracts.Secrets.getUserLike(address, item.entity_id);
    setIsUserLiked(response);
  }

  async function likeSecret() {
    await tx(writeContracts.Secrets.like(item.entity_id));
    setLikeCounter(isUserLiked ? likeCounter - 1 : likeCounter + 1);
    setIsUserLiked(!isUserLiked);
  }

  useEffect(() => {
    getUserLike();
  }, [address, item]);

  return (
    <>
      <div>Likes : {likeCounter.toString()}</div>
      <Button
        style={{ marginTop: 8 }}
        onClick={async () => {
          await likeSecret();
        }}
      >
        {isUserLiked ? "Unlike" : "Like"}
      </Button>
    </>
  );
};

export default SecretLikeButton;
