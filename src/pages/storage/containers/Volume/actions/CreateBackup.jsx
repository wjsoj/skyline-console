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
import { ModalAction } from 'containers/Action';
import globalBackupStore from 'stores/cinder/backup';
import { isAvailableOrInUse, isInUse } from 'resources/volume';
import { createTip, backupModeList, modeTip } from 'resources/backup';

@inject('rootStore')
@observer
export default class CreateBackup extends ModalAction {
  static id = 'create-backup';

  static title = t('Create Backup');

  get name() {
    return t('Create backup');
  }

  get tips() {
    return createTip;
  }

  get defaultValue() {
    const { name, id, volume_type, size } = this.item;
    const value = {
      volume: `${name || id}(${volume_type} | ${size}GB)`,
      incremental: false,
    };
    return value;
  }

  static policy = 'backup:create';

  static allowed = (item) => Promise.resolve(isAvailableOrInUse(item));

  get formItems() {
    return [
      {
        name: 'volume',
        label: t('Volume'),
        type: 'label',
        iconType: 'volume',
      },
      {
        name: 'name',
        label: t('Backup Name'),
        type: 'input-name',
        required: true,
      },
      {
        name: 'incremental',
        label: t('Backup Mode'),
        type: 'radio',
        options: backupModeList,
        tip: modeTip,
      },
    ];
  }

  init() {
    this.store = globalBackupStore;
  }

  onSubmit = (values) => {
    const { id } = this.item;
    const { volume, ...rest } = values;
    const force = isInUse(this.item);
    const body = {
      ...rest,
      volume_id: id,
      force,
    };
    return this.store.create(body);
  };
}
