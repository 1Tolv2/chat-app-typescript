import React, { useEffect, useState, useContext } from "react";
import * as s from "./styles";
import MemberList from "../../molecules/MemberList";
import { ActivityData } from "../../../global/types";
import {getServerUsers} from '../../../global/api'
import {ModalContext} from "../../Layout";



type Props = {};

const MemberSidebar = (props: Props) => {
const { modalVisible } = useContext(ModalContext);
  const [members, setMembers] = useState<ActivityData[]>([]);

  const fetchData = async () => {
    console.log("Fetching users")
    if (!modalVisible){
    const data = await getServerUsers('1')
    setMembers([data])}
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <s.MembersContainer>
      {members.map((list, index) => {
        return <MemberList key={index} data={list} />;
      })}
    </s.MembersContainer>
  );
};

export default MemberSidebar;
