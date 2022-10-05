import React from "react";
import MessageList from "../MessageList";
import MessageStart from "../../molecules/MessageStart";
import MessageCreator from "../../molecules/MessageCreator";
import * as s from "./styles";

type Props = {};

const MessageBoard = (props: Props) => {
  return (
    <s.Container>
      <s.Wrapper>
        <MessageStart />
        <MessageList />
      </s.Wrapper>
      <MessageCreator />
    </s.Container>
  );
};

export default MessageBoard;