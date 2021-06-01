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

import { inject, observer } from 'mobx-react';
import { SnapshotStore } from 'stores/cinder/snapshot';
import Base from 'containers/TabDetail';
import { volumeStatus } from 'resources/volume';
import BaseDetail from './BaseDetail';
import actionConfigs from '../actions';

@inject('rootStore')
@observer
export default class Detail extends Base {
  get name() {
    return t('snapshot');
  }

  get policy() {
    return 'volume:get_snapshot';
  }

  get listUrl() {
    return this.getUrl('/storage/snapshot');
  }

  get actionConfigs() {
    return this.isAdminPage
      ? actionConfigs.adminConfigs
      : actionConfigs.actionConfigs;
  }

  get detailInfos() {
    return [
      {
        title: t('Name'),
        dataIndex: 'name',
      },
      {
        title: t('Description'),
        dataIndex: 'description',
        valueRender: 'noValue',
      },
      {
        title: t('Status'),
        dataIndex: 'status',
        render: (data) => volumeStatus[data] || '-',
      },
      {
        title: t('Size'),
        dataIndex: 'size',
        render: (data) => `${data} GB`,
      },
      {
        title: t('Created At'),
        dataIndex: 'created_at',
        valueRender: 'toLocalTime',
      },
    ];
  }

  get tabs() {
    const tabs = [
      {
        title: t('Detail'),
        key: 'base',
        component: BaseDetail,
      },
    ];
    return tabs;
  }

  init() {
    this.store = new SnapshotStore();
  }
}
