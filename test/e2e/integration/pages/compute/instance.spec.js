// Copyright 2021 99cloud
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { instanceListUrl } from '../../../support/constants';

describe('The Instance Page', () => {
  const listUrl = instanceListUrl;
  const uuid = Cypress._.random(0, 1e6);
  const name = `e2e-instance-${uuid}`;
  const newname = `${name}-1`;
  const password = 'passw0rd_1';
  const volumeName = `e2e-instance-attach-volume-${uuid}`;
  const networkName = `e2e-network-for-instance-${uuid}`;
  const routerName = `e2e-router-for-instance-${uuid}`;

  beforeEach(() => {
    cy.login(listUrl);
  });

  it('successfully prepair resource', () => {
    cy.createNetwork({ name: networkName });
    cy.createRouter({ name: routerName, network: networkName });
    cy.createFip();
    cy.createVolume(volumeName);
  });

  it('successfully create', () => {
    cy.clickHeaderButton(1)
      .url()
      .should('include', `${listUrl}/create`)
      .wait(5000)
      .formTableSelect('flavor')
      .formTableSelect('image')
      .formSelect('systemDisk')
      .formAddSelectAdd('dataDisk')
      .formSelect('dataDisk')
      .wait(2000)
      .clickStepActionNextButton()
      .wait(5000)
      .formTableSelectBySearch('networkSelect', networkName, 5000)
      .formTableSelectBySearch('securityGroup', 'default', 5000)
      .wait(2000)
      .clickStepActionNextButton()
      .formInput('name', name)
      .formRadioChoose('loginType', 1)
      .formInput('password', password)
      .formInput('confirmPassword', password)
      .wait(2000)
      .clickStepActionNextButton()
      .wait(2000)
      .clickStepActionNextButton()
      .waitFormLoading()
      .url()
      .should('include', listUrl)
      .closeNotice()
      .waitStatusActiveByRefresh();
  });

  it('successfully detail', () => {
    cy.tableSearchText(name).checkTableFirstRow(name).goToDetail();
    cy.checkDetailName(name);
    cy.clickDetailTab('Volume', 'volumes')
      .clickDetailTab('Interface', 'interface')
      .clickDetailTab('Floating IPs', 'floatingIps')
      .clickDetailTab('Security Group', 'securityGroup');
    cy.goBackToList(listUrl);
  });

  it('successfully lock', () => {
    cy.tableSearchText(name)
      .clickConfirmActionInMoreSub('Lock', 'Instance Status')
      .wait(10000);
    cy.tableSearchText(name)
      .selectFirst()
      .clickHeaderButtonByTitle('Start')
      .checkDisableAction(2000)
      .clickHeaderButtonByTitle('Stop')
      .checkDisableAction(2000)
      .clickHeaderButtonByTitle('Reboot')
      .checkDisableAction(2000);
  });

  it('successfully unlock', () => {
    cy.tableSearchText(name)
      .clickConfirmActionInMoreSub('Unlock', 'Instance Status')
      .wait(10000);
  });

  it('successfully stop', () => {
    cy.tableSearchText(name)
      .clickConfirmActionInMoreSub('Stop', 'Instance Status')
      .wait(10000)
      .tableSearchText(name)
      .checkColumnValue(6, 'Shutoff')
      .selectFirst()
      .clickHeaderButtonByTitle('Stop')
      .checkDisableAction(2000);
  });

  it('successfully start', () => {
    cy.tableSearchText(name)
      .clickConfirmActionInMoreSub('Start', 'Instance Status')
      .waitStatusActive()
      .checkColumnValue(6, 'Active')
      .selectFirst()
      .clickHeaderButtonByTitle('Start')
      .checkDisableAction(2000);
  });

  it('successfully suspend', () => {
    cy.tableSearchText(name)
      .clickConfirmActionInMoreSub('Suspend', 'Instance Status')
      .wait(10000)
      .tableSearchText(name)
      .checkColumnValue(6, 'Suspended');
  });

  it('successfully resume', () => {
    cy.tableSearchText(name)
      .clickConfirmActionInMoreSub('Resume', 'Instance Status')
      .waitStatusActiveByRefresh();
  });

  it('successfully pause', () => {
    cy.tableSearchText(name)
      .clickConfirmActionInMoreSub('Pause', 'Instance Status')
      .wait(10000)
      .tableSearchText(name)
      .checkColumnValue(6, 'Paused');
  });

  it('successfully unpause', () => {
    cy.tableSearchText(name)
      .clickConfirmActionInMoreSub('Unpause', 'Instance Status')
      .waitStatusActiveByRefresh();
  });

  it('successfully shelve', () => {
    cy.tableSearchText(name)
      .clickConfirmActionInMoreSub('Shelve', 'Instance Status')
      .wait(20000);
  });

  it('successfully unshelve', () => {
    cy.tableSearchText(name)
      .clickConfirmActionInMoreSub('Unshelve', 'Instance Status')
      .waitStatusActiveByRefresh();
  });

  it('successfully reboot', () => {
    cy.tableSearchText(name)
      .clickConfirmActionInMoreSub('Reboot', 'Instance Status')
      .tableSearchText(name)
      .waitStatusActiveByRefresh();
  });

  it('successfully soft reboot', () => {
    cy.tableSearchText(name)
      .clickConfirmActionInMoreSub('Soft Reboot', 'Instance Status')
      .wait(5000)
      .tableSearchText(name)
      .waitStatusActiveByRefresh();
  });

  it('successfully attach interface', () => {
    cy.tableSearchText(name)
      .clickActionInMoreSub('Attach Interface', 'Related Resources')
      .wait(5000)
      .formTableSelect('network')
      .clickModalActionSubmitButton();
  });

  it('successfully detach interface', () => {
    cy.tableSearchText(name)
      .clickActionInMoreSub('Detach Interface', 'Related Resources')
      .wait(5000)
      .formTableSelect('interfaces')
      .clickModalActionSubmitButton();
  });

  it('successfully attach volume', () => {
    // prepair volume
    cy.visitPage(listUrl)
      .tableSearchText(name)
      .clickActionInMoreSub('Attach Volume', 'Related Resources')
      .wait(5000)
      .formTableSelectBySearch('volume', volumeName)
      .clickModalActionSubmitButton()
      .wait(5000);

    // check attach successful
    cy.tableSearchText(name)
      .goToDetail()
      .clickDetailTab('Volume')
      .tableSearchText(volumeName)
      .checkColumnValue(2, 'In-use');
  });

  it('successfully detach volume', () => {
    cy.tableSearchText(name)
      .clickActionInMoreSub('Detach Volume', 'Related Resources')
      .wait(5000)
      .formTableSelectBySearch('volumes', volumeName)
      .clickModalActionSubmitButton();

    // delete volume
    cy.deleteAll('volume', volumeName);
  });

  it('successfully associate floating IP', () => {
    cy.tableSearchText(name)
      .clickActionInMoreSub('Associate Floating IP', 'Related Resources')
      .wait(5000)
      .formTableSelect('fixed_ip')
      .wait(5000)
      .formTableSelect('fip')
      .clickModalActionSubmitButton();
  });

  it('successfully disassociate floating ip', () => {
    cy.tableSearchText(name)
      .clickActionInMoreSub('Disassociate Floating Ip', 'Related Resources')
      .wait(5000)
      .formSelect('address')
      .clickModalActionSubmitButton();
  });

  it('successfully manage security group with cancel', () => {
    cy.tableSearchText(name)
      .clickActionInMoreSub('Manage Security Group', 'Related Resources')
      .wait(5000)
      .formTableSelect('port')
      .wait(5000)
      .clickModalActionCancelButton();
  });

  it('successfully extend root volume', () => {
    cy.tableSearchText(name)
      .clickActionInMoreSub('Extend Root Volume', 'Configuration Update')
      .wait(5000)
      .clickModalActionSubmitButton()
      .wait(30000);
  });

  it('successfully change password', () => {
    const passowrdNew = `${password}_1`;
    cy.tableSearchText(name)
      .clickActionInMoreSub('Change Password', 'Configuration Update')
      .formInput('password', passowrdNew)
      .formInput('confirmPassword', passowrdNew)
      .clickModalActionSubmitButton();
  });

  it('successfully rebuild instance', () => {
    cy.tableSearchText(name)
      .clickActionInMoreSub('Rebuild Instance', 'Configuration Update')
      .wait(5000)
      .formTableSelect('image')
      .clickModalActionSubmitButton()
      .waitStatusActiveByRefresh();
  });

  it('successfully resize', () => {
    cy.tableSearchText(name)
      .clickActionInMoreSub('Resize', 'Configuration Update')
      .wait(5000)
      .formTableSelect('newFlavor')
      .formCheckboxClick('option')
      .clickModalActionSubmitButton()
      .waitStatusActiveByRefresh();
  });

  it('successfully edit', () => {
    cy.tableSearchText(name)
      .clickActionInMore('Edit')
      .formInput('name', newname)
      .clickModalActionSubmitButton()
      .wait(2000);
  });

  it('successfully delete', () => {
    cy.deleteInstance(newname);
  });

  it('successfully delete related resources', () => {
    cy.deleteAll('fip');
    cy.deleteRouter(routerName, networkName);
    cy.deleteAll('network', networkName);
    cy.deleteAll('volume', volumeName);
    cy.deleteAllAvailableVolume();
  });
});
