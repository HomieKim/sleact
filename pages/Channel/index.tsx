import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import { IChannel } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router';
import { Container, Header } from './styles';
const Channel = () => {
  const queryClient = useQueryClient();
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: myData } = useQuery('user', () => fetcher({ queryKey: '/api/users' }));
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: channelData } = useQuery<IChannel>(['workspace', workspace, 'channel', channel, 'chat'], () =>
    fetcher({ queryKey: `/api/workspaces/${workspace}/channels/${channel}` }),
  );
  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      console.log(chat);
    },
    [chat],
  );

  if (!myData || !channelData) {
    return null;
  }

  return (
    <Container>
      <Header>채널</Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};
export default Channel;
