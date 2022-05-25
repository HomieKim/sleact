import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Redirect, Route, Switch } from 'react-router';
import gravatar from 'gravatar';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';
import loadable from '@loadable/component';
import Menu from '@components/Menu';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: FC = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const queryClient = useQueryClient();
  const { data: userData } = useQuery<IUser | false>('user', () => fetcher({ queryKey: '/api/users' }), {});

  const onLogout = useCallback(() => {
    axios
      .post('/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        queryClient.setQueryData('user', () => null);
      });
  }, [queryClient]);

  if (!userData) {
    return <Redirect to="/login" />;
  }

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
            {showUserMenu && (
              <Menu style={{ top: 38, right: 0 }} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.nickname, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그 아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>MenuScorll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/channel" component={Channel} />
            <Route path="/workspace/dm" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      {children}
    </div>
  );
};

export default Workspace;
