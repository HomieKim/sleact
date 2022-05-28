import React, { useCallback } from 'react';
import { Container, Header } from './styles';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import fetcher from '@utils/fetcher';
import { useInfiniteQuery, useQuery } from 'react-query';
import useInput from '@hooks/useInput';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import axios from 'axios';
import { IDM } from '@typings/db';
const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useQuery(['workspace', workspace, 'users', id], () =>
    fetcher({ queryKey: `/api/workspaces/${workspace}/users/${id}` }),
  );
  const { data: myData } = useQuery('user', () => fetcher({ queryKey: '/api/users' }));
  const [chat, onChangeChat, setChat] = useInput('');

  const {
    data: chatData,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<IDM[]>(
    ['workspace', workspace, 'dm', id, 'chat'],
    ({ pageParam=0 }) =>
      fetcher({ queryKey: `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${pageParam + 1}` }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) return;
        return pages.length;
      },
    },
  );

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            setChat('');
          })
          .catch(console.error);
      }
    },
    [chat],
  );
  if (!userData || !myData) {
    return null;
  }
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};
export default DirectMessage;
