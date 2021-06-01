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

import CreatAction from './Create';
import EditAction from './Edit';
import DeleteAction from './Delete';
// import CreateInstance from 'pages/compute/containers/Instance/actions/StepCreate';
import CreateInstance from './CreateInstance';
import CreateIronic from './CreateIronic';
import CreateVolume from './CreateVolume';
import ManageMetadata from './ManageMetadata';
import ManageAccess from './ManageAccess';

const actionConfigs = {
  rowActions: {
    firstAction: EditAction,
    moreActions: [
      {
        action: CreateInstance,
      },
      {
        action: CreateIronic,
      },
      {
        action: CreateVolume,
      },
      {
        action: DeleteAction,
      },
    ],
  },
  batchActions: [DeleteAction],
  primaryActions: [CreatAction],
};

const actionConfigsAdmin = {
  rowActions: {
    firstAction: EditAction,
    moreActions: [
      {
        action: DeleteAction,
      },
      {
        action: ManageAccess,
      },
      {
        action: ManageMetadata,
      },
    ],
  },
  batchActions: [DeleteAction],
  primaryActions: [CreatAction],
};

export default { actionConfigs, actionConfigsAdmin };
