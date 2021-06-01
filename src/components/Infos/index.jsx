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
import { Descriptions, Skeleton } from 'antd';
import PropTypes from 'prop-types';
import { generateId } from 'utils/index';
import styles from './index.less';

const Infos = ({ title, descriptions, loading }) => {
  const descItems = descriptions.map((it) => {
    if (typeof it.content === 'number') {
      it.content = it.content.toString();
    }
    return (
      <Descriptions.Item
        label={it.label}
        className={styles.item}
        key={`label-${generateId()}`}
      >
        {it.content}
      </Descriptions.Item>
    );
  });
  return (
    <Skeleton loading={loading}>
      <Descriptions colon={false} title={title}>
        {descItems}
      </Descriptions>
    </Skeleton>
  );
};

const detailProps = PropTypes.shape({
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  content: PropTypes.any,
});

Infos.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  descriptions: PropTypes.arrayOf(detailProps),
  loading: PropTypes.bool,
};

export default Infos;
