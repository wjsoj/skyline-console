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

import { neutronBase } from 'utils/constants';
import { action, observable } from 'mobx';
import globalRouterStore from 'stores/neutron/router';
import globalServerStore from 'stores/nova/instance';
import globalLbaasStore from 'stores/octavia/loadbalancer';
import Base from '../base';

export class FloatingIpStore extends Base {
  get module() {
    return 'floatingips';
  }

  get apiVersion() {
    return neutronBase();
  }

  get responseKey() {
    return 'floatingip';
  }

  get listFilterByProject() {
    return true;
  }

  updateParamsSortPage = (params, sortKey, sortOrder) => {
    if (sortKey && sortOrder) {
      params.sort_key = sortKey;
      params.sort_dir = sortOrder === 'descend' ? 'desc' : 'asc';
    }
  };

  @observable
  addInfo = {
    network_name: '',
    router_name: '',
  };

  @action
  async fetchListWithResourceName({
    limit,
    page,
    sortKey,
    sortOrder,
    conditions,
    timeFilter,
    ...filters
  } = {}) {
    const allData = await this.fetchListByPage({
      limit,
      page,
      sortKey,
      sortOrder,
      conditions,
      timeFilter,
      ...filters,
    });
    const promises = [];
    allData.forEach((data) => {
      if (
        data.port_details &&
        data.port_details.device_owner === 'network:router_gateway'
      ) {
        promises.push(
          globalRouterStore.fetchDetail({ id: data.port_details.device_id })
        );
      } else if (
        data.port_details &&
        data.port_details.device_owner === 'compute:nova'
      ) {
        promises.push(
          globalServerStore.fetchDetailWithoutExpiration({
            id: data.port_details.device_id,
          })
        );
      } else if (
        data.port_details &&
        data.port_details.device_owner === 'Octavia'
      ) {
        promises.push(
          globalLbaasStore.fetchDetail({
            id: data.port_details.device_id.replace('lb-', ''),
          })
        );
      } else if (data.port_details && data.port_details.device_owner === '') {
        promises.push(
          Promise.resolve({
            name: data.port_details.name,
          })
        );
      } else {
        promises.push(Promise.resolve({}));
      }
    });
    const results = await Promise.all(promises);
    results.forEach((result, index) => {
      let resource_name = '';
      if (
        allData[index].port_details &&
        allData[index].port_details.device_owner === 'compute:nova'
      ) {
        resource_name = `${result.name}: ${allData[index].fixed_ip_address}`;
      } else if (
        allData[index].port_details &&
        (allData[index].port_details.device_owner ===
          'network:router_gateway' ||
          allData[index].port_details.device_owner === '')
      ) {
        resource_name = `${result.name}: ${allData[index].fixed_ip_address}`;
      } else if (
        allData[index].port_details &&
        allData[index].port_details.device_owner === 'Octavia'
      ) {
        resource_name = `${result.name}: ${allData[index].fixed_ip_address}`;
      }
      allData[index].resource_name = resource_name;
    });
    this.list.update({
      data: allData,
    });

    return allData;
  }

  @action
  disassociateFip({ id }) {
    const body = {
      floatingip: {
        port_id: null,
      },
    };
    return this.submitting(request.put(`${this.getDetailUrl({ id })}`, body));
  }

  @action
  associateFip({ id, port_id, fixed_ip_address = '' }) {
    const body = {
      floatingip: {
        port_id,
      },
    };
    if (fixed_ip_address !== '') {
      body.floatingip.fixed_ip_address = fixed_ip_address;
    }
    return this.submitting(request.put(`${this.getDetailUrl({ id })}`, body));
  }

  @action
  async getAddInfo({ router_id }) {
    this.isLoading = true;
    const ret = await globalRouterStore.fetchDetail({ id: router_id });
    this.addInfo = ret;
    this.isLoading = false;
    return this.addInfo;
  }
}

const globalFloatingIpsStore = new FloatingIpStore();
export default globalFloatingIpsStore;
