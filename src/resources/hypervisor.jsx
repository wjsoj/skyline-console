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

import React from 'react';
import Progress from 'components/Progress';

export const hypervisorColumns = [
  {
    title: t('Hostname'),
    dataIndex: 'hypervisor_hostname',
  },
  {
    title: t('Type'),
    dataIndex: 'hypervisor_type',
  },
  {
    title: t('VCPU (Core)'),
    dataIndex: 'vcpus_used_percent',
    render: (value, record) => (
      <Progress
        value={value}
        label={`${record.vcpus_used} / ${record.vcpus}`}
      />
    ),
    width: 180,
    stringify: (value, record) =>
      `${value}% (${t('Used')}: ${record.vcpus_used} / ${t('Total')}: ${
        record.vcpus
      })`,
  },
  {
    title: t('Configured Memory (GB)'),
    dataIndex: 'memory_mb_percent',
    render: (value, record) => (
      <Progress
        value={value}
        label={`${record.memory_mb_used_gb} / ${record.memory_mb_gb}`}
      />
    ),
    width: 180,
    stringify: (value, record) =>
      `${value}% (${t('Used')}: ${record.memory_mb_used_gb} / ${t('Total')}: ${
        record.memory_mb_gb
      })`,
  },
  // {
  //   title: t('Used Local Storage (GB)'),
  //   dataIndex: 'storage_percent',
  //   render: (value, record) => <Progress value={value} label={`${record.local_gb_used || '-'} / ${record.local_gb || '-'}`} />,
  //   width: 180,
  // },
  {
    title: t('Instances'),
    dataIndex: 'running_vms',
  },
];

export const hypervisorFilters = [
  {
    label: t('Hostname'),
    name: 'hypervisor_hostname',
  },
  {
    label: t('Type'),
    name: 'hypervisor_type',
  },
];
