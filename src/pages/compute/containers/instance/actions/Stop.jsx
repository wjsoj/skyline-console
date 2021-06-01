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

import { ConfirmAction } from 'containers/Action';
import { isArray } from 'lodash';
import { isNotLockedOrAdmin, checkStatus } from 'resources/instance';
import globalServerStore from 'stores/nova/instance';

export default class Stop extends ConfirmAction {
  get id() {
    return 'stop';
  }

  get title() {
    return t('Stop Instance');
  }

  get buttonType() {
    return 'danger';
  }

  get buttonText() {
    return t('Stop');
  }

  get actionName() {
    return t('stop instance');
  }

  get passiveAction() {
    return t('be stopped');
  }

  get isAsyncAction() {
    return true;
  }

  policy = 'os_compute_api:servers:stop';

  allowedCheckFunc = (item) => {
    if (!item) {
      return true;
    }
    return isNotLockedOrAdmin(item, this.isAdminPage) && this.isRunning(item);
  };

  performErrorMsg = (failedItems) => {
    const instance = isArray(failedItems) ? failedItems[0] : failedItems;
    let errorMsg = t('You are not allowed to stop instance "{ name }".', {
      name: instance.name,
    });
    if (!this.isRunning(instance)) {
      errorMsg = t(
        'Instance "{ name }" status is not in active or suspended, can not stop it.',
        { name: instance.name }
      );
    } else if (!isNotLockedOrAdmin(instance, this.isAdminPage)) {
      errorMsg = t('Instance "{ name }" is locked, can not stop it.', {
        name: instance.name,
      });
    }
    return errorMsg;
  };

  onSubmit = (item) => {
    const { id } = item || this.item;
    return globalServerStore.stop({ id });
  };

  isRunning(instance) {
    const ableStatus = ['active'];
    return checkStatus(ableStatus, instance);
  }
}
