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
import Create from './Create';

@inject('rootStore')
@observer
export default class Edit extends Create {
  static id = 'edit-template';

  static title = t('Update Template');

  static path = (item, containerProp) => {
    const { isAdminPage } = containerProp;
    const prefix = isAdminPage
      ? '/heat/stack-admin/edit/'
      : '/heat/stack/edit/';
    return `${prefix}${item.id}/${item.stack_name}`;
  };

  get listUrl() {
    return this.getUrl('/heat/stack');
  }

  get name() {
    return t('Update Template');
  }

  static policy = 'stacks:update';

  static allowed() {
    return Promise.resolve(true);
  }
}
