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

import { action, observable } from 'mobx';
import { skylineBase } from 'utils/constants';
import Base from '../base';

export class SkylineStore extends Base {
  @observable
  domains = [];

  @observable
  regions = [];

  get module() {
    return 'contrib';
  }

  get apiVersion() {
    return skylineBase();
  }

  @action
  async fetchDomainList() {
    const url = `${this.getListUrl()}/domains`;
    const result = await request.get(url);
    this.domains = result;
  }

  @action
  async fetchRegionList() {
    const url = `${this.getListUrl()}/regions`;
    const result = await request.get(url);
    this.regions = result;
  }
}

const globalSkylineStore = new SkylineStore();
export default globalSkylineStore;
