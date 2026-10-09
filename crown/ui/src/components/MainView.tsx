// Copyright (c) 2022 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Container, Grid, Header, Icon, Segment, Divider, List } from 'semantic-ui-react';
import { Party } from '@daml/types';
import { User } from '@daml.js/crown';
import { publicContext, userContext } from './App';
import UserList from './UserList';
import PartyListEdit from './PartyListEdit';
import { contractCatalog, createDefaultRepoTerms } from '../crownContracts';

// USERS_BEGIN
const MainView: React.FC = () => {
  const username = userContext.useParty();
  const myUserResult = userContext.useStreamFetchByKeys(User.User, () => [username], [username]);
  const aliases = publicContext.useStreamQueries(User.Alias, () => [], []);
  const myUser = myUserResult.contracts[0]?.payload;
  const allUsers = userContext.useStreamQueries(User.User).contracts;
// USERS_END

  // Sorted list of users that are following the current user
  const followers = useMemo(() =>
    allUsers
    .map(user => user.payload)
    .filter(user => user.username !== username)
    .sort((x, y) => x.username.localeCompare(y.username)),
    [allUsers, username]);

  // Map to translate party identifiers to aliases.
  const partyToAlias = useMemo(() =>
    new Map<Party, string>(aliases.contracts.map(({payload}) => [payload.username, payload.alias])),
    [aliases]
  );
  const myUserName = aliases.loading ? 'loading ...' : partyToAlias.get(username) ?? username;

  // FOLLOW_BEGIN
  const ledger = userContext.useLedger();

  const follow = async (userToFollow: Party): Promise<boolean> => {
    try {
      await ledger.exerciseByKey(User.User.Follow, username, {userToFollow});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }
  // FOLLOW_END

  return (
    <Container>
      <Grid centered columns={2}>
        <Grid.Row stretched>
          <Grid.Column>
            <Header as='h1' size='huge' color='blue' textAlign='center' style={{padding: '1ex 0em 0ex 0em'}}>
                {myUserName ? `Welcome, ${myUserName}!` : 'Loading...'}
            </Header>

            <Segment>
              <Header as='h2'>
                <Icon name='user' />
                <Header.Content>
                  {myUserName ?? 'Loading...'}
                  <Header.Subheader>Users I'm following</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <PartyListEdit
                parties={myUser?.following ?? []}
                partyToAlias={partyToAlias}
                onAddParty={follow}
              />
            </Segment>
            <Segment>
              <Header as='h2'>
                <Icon name='globe' />
                <Header.Content>
                  The Network
                  <Header.Subheader>My followers and users they are following</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              {/* USERLIST_BEGIN */}
              <UserList
                users={followers}
                partyToAlias={partyToAlias}
                onFollow={follow}
              />
              {/* USERLIST_END */}
            </Segment>

            <Segment>
              <Header as='h2'>
                <Icon name='sitemap' />
                <Header.Content>
                  CROWN contract integration
                  <Header.Subheader>Repo, settlement, lifecycle, and evidence contracts</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <p>
                This application is wired to the Daml contract model used by the repo lifecycle: proposal, agreement, settlement instruction, settlement evidence, maturity, and closure.
              </p>
              <p>
                Default repo terms for the first live contract draft: {JSON.stringify(createDefaultRepoTerms(username))}
              </p>
              <List divided relaxed>
                {contractCatalog.map((contract) => (
                  <List.Item key={`${contract.module}.${contract.template}`}>
                    <List.Icon name='code' size='large' verticalAlign='middle' />
                    <List.Content>
                      <List.Header>{contract.module}.{contract.template}</List.Header>
                      <List.Description>{contract.summary}</List.Description>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default MainView;
