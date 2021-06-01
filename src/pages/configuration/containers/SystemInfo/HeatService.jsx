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

import { observer, inject } from 'mobx-react';
import Base from 'containers/List';
import { serviceState } from 'resources/service';

import globalHeatServiceStore from 'stores/heat/service';

@inject('rootStore')
@observer
export default class HeatService extends Base {
  init() {
    this.store = globalHeatServiceStore;
  }

  get policy() {
    return 'services:index';
  }

  get name() {
    return t('heat services');
  }

  get hasTab() {
    return true;
  }

  getColumns = () => [
    {
      title: t('Name'),
      dataIndex: 'binary',
    },
    {
      title: t('Engine ID'),
      dataIndex: 'engine_id',
      isHideable: true,
    },
    {
      title: t('Host'),
      dataIndex: 'host',
      isHideable: true,
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      render: (value) => serviceState[value] || '-',
    },
    {
      title: t('Last Updated'),
      dataIndex: 'updated_at',
      isHideable: true,
      valueRender: 'sinceTime',
    },
  ];

  get searchFilters() {
    return [
      {
        label: t('Name'),
        name: 'binary',
      },
      {
        label: t('Status'),
        name: 'status',
        options: Object.keys(serviceState).map((key) => ({
          label: serviceState[key],
          key,
        })),
      },
    ];
  }
}
