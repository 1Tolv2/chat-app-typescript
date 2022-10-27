import React, { useEffect, useState } from "react";
import { addMemberToServer, getAllUsers } from "../../../global/api";
import Avatar from "../../atoms/Avatar";
import Button from "../../atoms/Button";
import InputField from "../../atoms/InputField";
import * as s from "./styles";

type Props = {
  serverId: number | null;
};

const FriendSearch = ({serverId}: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [memberList, setMemberList] = useState<any[]>([]);
  const [unfilteredMemberList, setUnfilteredMemberList] = useState<any[]>([]);

  const fetchMembers = async () => {
    const data = await getAllUsers()
    setUnfilteredMemberList(data)
    setMemberList(data);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const searchMember = (value: any) => {
    setSearchTerm(value);
    setMemberList(unfilteredMemberList.filter((member) => new RegExp(value, "i").test(member.username)))
  }

  const firstLetterToUpperCase = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  const handleOnInvite = async (e: any) => {
    console.log("User: ", e.target.id)
    console.log("Server: ", serverId)
    await addMemberToServer(serverId || 0, e.target.id);
  }

  return (
    <s.Container>
      <s.InputContainer>
        <InputField
          placeholder="Search for members"
          type="text"
          id="search"
          value={searchTerm}
          setValue={searchMember}
          bgColor="darkestGrey"
        />
      </s.InputContainer>
      <s.MemberList>
        {memberList &&
          memberList.map((member: any) => {
            return (
              <s.MemberItem key={member.id}>
                <Avatar size="30px" />
                <h4>{firstLetterToUpperCase(member.username)}</h4>
                <Button
                  id={member.id}
                  type="outlined"
                  fontSize="14px"
                  bgColor="green"
                  width="72px"
                  height="32px"
                  onClick={handleOnInvite}
                >
                  Invite
                </Button>
              </s.MemberItem>
            );
          })}
      </s.MemberList>
    </s.Container>
  );
};

export default FriendSearch;