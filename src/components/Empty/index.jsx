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
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.less';

export default class Empty extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    img: PropTypes.string,
    desc: PropTypes.string,
  };

  static defaultProps = {
    img: '/asset/image/empty-card.svg',
    desc: 'No relevant data',
  };

  render() {
    const { className, img, desc } = this.props;

    return (
      <div className={classnames(styles.wrapper, className)}>
        <img src={img} alt="No data" />
        {desc && <div className={styles.content}>{t(desc)}</div>}
      </div>
    );
  }
}
