import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/style';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: (flag: boolean) => void;
}

const InviteChannelModal: FC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const queryClient = useQueryClient();
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const [newMember, onChangeNewMember, setNewMember] = useInput('');

  const onInviteMember = useCallback((e) => {
    e.preventDefault();
    if (!newMember || !newMember.trim()) return;
    axios.post(`/api/workspaces/${workspace}/channel/${channel}/members`, {
      email: newMember,
    })
    .then(()=>{
      queryClient.refetchQueries(['workspace', workspace, 'channel', channel, 'member']);
      setShowInviteChannelModal(false);
      setNewMember('');
    })
    .catch((error)=>{
      console.dir(error);
      toast.error(error.response?.data, {position:'bottom-center'});
    });
  }, [newMember, queryClient, channel, workspace, setNewMember, setShowInviteChannelModal]);

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form>
        <Label>
          <span>채널 멤버 초대</span>
          <Input id="member" />
        </Label>
        <Button>초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteChannelModal;
