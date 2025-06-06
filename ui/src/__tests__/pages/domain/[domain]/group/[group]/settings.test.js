/*
 * Copyright The Athenz Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import GroupSettingsPage from '../../../../../../pages/domain/[domain]/group/[group]/settings';
import MockApi from '../../../../../../mock/MockApi';
import {
    mockAllDomainDataApiCalls,
    renderWithRedux,
} from '../../../../../../tests_utils/ComponentsTestUtils';
import { listUserDomains_response } from '../../../../../../mock/MockData';

afterEach(() => {
    MockApi.cleanMockApi();
});

describe('GroupSettingPage', () => {
    it('should render', async () => {
        let group = 'groupName';
        let query = {
            domain: 'dom',
        };
        let domainDetails = {
            modified: '2020-02-12T21:44:37.792Z',
        };
        let groupDetails = {
            groupName: 'group1',
            modified: '2020-02-12T21:44:37.792Z',
            memberExpiryDays: '60',
            serviceExpiryDays: '50',
        };
        let headerDetails = {
            headerLinks: [
                {
                    title: 'Website',
                    url: 'http://www.athenz.io',
                    target: '_blank',
                },
            ],
            userData: {
                userLink: {
                    title: 'User Link',
                    url: '',
                    target: '_blank',
                },
            },
        };

        const mockApi = {
            ...mockAllDomainDataApiCalls(domainDetails, headerDetails),
            getPendingDomainMembersList: jest.fn().mockReturnValue(
                new Promise((resolve, reject) => {
                    resolve([]);
                })
            ),
            listUserDomains: jest.fn().mockReturnValue(
                new Promise((resolve, reject) => {
                    resolve(listUserDomains_response);
                })
            ),
            getGroup: jest.fn().mockReturnValue(
                new Promise((resolve, reject) => {
                    resolve(groupDetails);
                })
            ),
            getGroups: jest.fn().mockReturnValue(
                new Promise((resolve, reject) => {
                    resolve([]);
                })
            ),
            getDomainRoleMembers: jest.fn().mockReturnValue(
                new Promise((resolve, reject) => {
                    resolve([]);
                })
            ),
        };
        MockApi.setMockApi(mockApi);

        const { getByTestId } = renderWithRedux(
            <GroupSettingsPage
                req='req'
                userId='userid'
                query={query}
                groupName={group}
                reload={false}
                domainName='dom'
            />
        );

        await waitFor(() => {
            expect(getByTestId('group-settings')).toBeInTheDocument();
        });

        const groupSettingsPage = getByTestId('group-settings');
        expect(groupSettingsPage).toMatchSnapshot();
    });
});
