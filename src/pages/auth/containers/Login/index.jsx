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

import React, { Component } from 'react';
import { Input, Button, Select, Row, Col } from 'antd';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { InfoCircleFilled } from '@ant-design/icons';
import SimpleForm from 'components/SimpleForm';
import globalSkylineStore from 'stores/skyline/skyline';
import i18n from 'core/i18n';
import { isEmpty } from 'lodash';
import pkuLogo from 'asset/image/pku-logo.png';
import styles from './index.less';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.init();
    this.state = {
      error: false,
      message: '',
      loading: false,
      loginTypeOption: this.enableSSO
        ? this.SSOOptions[0]
        : this.passwordOption,
    };
  }

  componentDidMount() {
    this.getRegions();
    this.getSSO();
  }

  async getRegions() {
    await this.store.fetchRegionList();
    this.updateDefaultValue();
  }

  async getSSO() {
    try {
      this.store.fetchSSO();
    } catch (e) {
      console.log(e);
    }
  }

  get rootStore() {
    return this.props.rootStore;
  }

  get info() {
    const { info = {} } = this.rootStore;
    return info || {};
  }

  get productName() {
    const { product_name = { zh: t('CLab 实验平台'), en: 'CLab' } } = this.info;
    const { getLocaleShortName } = i18n;
    const language = getLocaleShortName();
    const name =
      product_name[language] || t('Cloud Platform') || 'Cloud Platform';
    return t('Welcome, {name}', { name });
  }

  get regions() {
    return (this.store.regions || []).map((it) => ({
      label: it,
      value: it,
    }));
  }

  get domains() {
    return [];
  }

  get nextPage() {
    const { location = {} } = this.props;
    const { search } = location;
    if (search) {
      return search.split('=')[1];
    }
    return '/base/overview';
  }

  get enableSSO() {
    const { sso: { enable_sso = false } = {} } = this.store;
    return enable_sso;
  }

  get ssoProtocols() {
    return {
      openid: t('PKU IAAA Login'),
    };
  }

  get SSOOptions() {
    if (!this.enableSSO) {
      return [];
    }
    const { sso: { protocols = [] } = {} } = this.store;
    return protocols.map((it) => {
      const { protocol, url } = it;
      return {
        label: this.ssoProtocols[protocol] || protocol,
        value: url,
        ...it,
      };
    });
  }

  get passwordOption() {
    return {
      label: t('Keystone Credentials'),
      value: 'password',
    };
  }

  get loginTypeOptions() {
    if (!this.enableSSO) {
      return [];
    }
    return [...this.SSOOptions, this.passwordOption];
  }

  onLoginTypeChange = (value, option) => {
    this.setState({ loginTypeOption: option });
  };

  get currentLoginType() {
    const { loginTypeOption: { value } = {} } = this.state;
    if (value === 'password') {
      return 'password';
    }
    return 'sso';
  }

  get currentSSOLink() {
    const { loginTypeOption: { value } = {} } = this.state;
    return value;
  }

  get defaultValue() {
    const data = {
      loginType: this.enableSSO ? this.SSOOptions[0].value : 'password',
    };
    if (this.regions.length === 1) {
      data.region = this.regions[0].value;
    }
    return data;
  }

  get formItems() {
    const { error, loading } = this.state;
    // eslint-disable-next-line no-unused-vars
    const buttonProps = {
      block: true,
      type: 'primary',
    };
    const loginType = this.currentLoginType;
    const errorItem = {
      name: 'error',
      hidden: !error,
      render: () => (
        <div className={styles['login-error']}>
          <InfoCircleFilled />
          {this.getErrorMessage()}
        </div>
      ),
    };
    const regionItem = {
      name: 'region',
      required: true,
      message: t('Please select your Region!'),
      render: () => (
        <Select placeholder={t('Select a region')} options={this.regions} />
      ),
    };
    const domainItem = {
      name: 'domain',
      required: true,
      render: () => (
        <Input placeholder={t('<username> or <username>@<domain>')} />
      ),
      extra: t('Tips: without domain means "Default" domain.'),
      rules: [{ required: true, validator: this.usernameDomainValidator }],
    };
    const usernameItem = {
      name: 'username',
      required: false,
      message: t('Please input your Username!'),
      render: () => <Input placeholder={t('Username')} />,
      hidden: true,
    };
    const passwordItem = {
      name: 'password',
      required: true,
      message: t('Please input your Password!'),
      render: () => <Input.Password placeholder={t('Password')} />,
    };
    const extraItem = {
      name: 'extra',
      hidden: true,
      render: () => (
        <Row gutter={8}>
          <Col span={12}>
            <Link to="password">{t('Forgot your password?')}</Link>
          </Col>
          <Col span={12}>
            <Link to="register" className={styles.register}>
              {t('Sign up')}
            </Link>
          </Col>
        </Row>
      ),
    };
    const submitItem = {
      name: 'submit',
      render: () => (
        <Row gutter={8}>
          <Col span={12}>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {t('Log in')}
            </Button>
          </Col>
        </Row>
      ),
    };
    const namePasswordItems = [
      errorItem,
      regionItem,
      domainItem,
      usernameItem,
      passwordItem,
      extraItem,
    ];
    const typeItem = {
      name: 'loginType',
      required: true,
      message: t('Please select login type!'),
      extra: t(
        'Please login using IAAA unless otherwise instructed by the administrator.'
      ),
      render: () => (
        <Select
          placeholder={t('Select a login type')}
          options={this.loginTypeOptions}
          onChange={this.onLoginTypeChange}
        />
      ),
    };
    if (this.enableSSO) {
      if (loginType === 'password') {
        return [typeItem, ...namePasswordItems, submitItem];
      }

      return [typeItem, submitItem];
    }
    return [...namePasswordItems, submitItem];
  }

  getUserId = (str) => str.split(':')[1].trim().split('.')[0];

  onLoginFailed = (error, values) => {
    this.setState({
      loading: false,
    });
    const {
      data: { detail = '' },
    } = error.response;
    const message = detail || '';
    if (
      message.includes(
        'The password is expired and needs to be changed for user'
      )
    ) {
      this.dealWithChangePassword(message, values);
    } else {
      this.setState({
        error: true,
        message,
      });
    }
  };

  onLoginSuccess = () => {
    this.setState({
      loading: false,
      error: false,
    });
    if (this.rootStore.user && !isEmpty(this.rootStore.user)) {
      this.rootStore.routing.push(this.nextPage);
    }
  };

  onFinish = (values) => {
    if (this.currentLoginType === 'sso') {
      document.location.href = this.currentSSOLink;
      return;
    }
    this.setState({
      loading: true,
      message: '',
      error: false,
    });
    const { password, region, domain } = values;
    const usernameDomain = this.getUsernameAndDomain({
      usernameDomain: domain,
    });
    const body = { password, region, ...usernameDomain };
    this.rootStore.login(body).then(
      () => {
        this.onLoginSuccess();
      },
      (error) => {
        this.onLoginFailed(error, values);
      }
    );
  };

  getErrorMessage() {
    const { message } = this.state;
    if (message.includes('The account is locked for user')) {
      return t(
        'Frequent login failure will cause the account to be temporarily locked, please operate after 5 minutes'
      );
    }
    if (message.includes('The account is disabled for user')) {
      return t('The user has been disabled, please contact the administrator');
    }
    if (
      message.includes('You are not authorized for any projects or domains')
    ) {
      return t(
        'If you are not authorized to access any project, or if the project you are involved in has been deleted or disabled, contact the platform administrator to reassign the project'
      );
    }
    return t('Username or password is incorrect');
  }

  getUsernameAndDomain = (values) => {
    const { usernameDomain } = values;
    const tmp = usernameDomain.trim().split('@');
    return {
      username: tmp[0],
      domain: tmp[1] || 'Default',
    };
  };

  usernameDomainValidator = (rule, value) => {
    if (!value || !value.trim()) {
      return Promise.reject(
        t('Please input <username> or <username>@<domain name>!')
      );
    }
    const tmp = value.trim().split('@');
    const message = t(
      'Please input the correct format:  <username> or <username>@<domain name>.'
    );
    if (tmp.length > 2) {
      return Promise.reject(new Error(message));
    }
    const { username, domain } = this.getUsernameAndDomain({
      usernameDomain: value,
    });
    if (!username || !domain) {
      return Promise.reject(new Error(message));
    }
    return Promise.resolve();
  };

  dealWithChangePassword = (detail, values) => {
    const userId = this.getUserId(detail);
    const data = {
      region: values.region,
      oldPassword: values.password,
      userId,
    };
    this.rootStore.setPasswordInfo(data);
    this.rootStore.routing.push('/auth/change-password');
  };

  updateDefaultValue = () => {
    this.formRef.current.resetFields();
    if (this.formRef.current && this.formRef.current.resetFields) {
      this.formRef.current.resetFields();
    }
  };

  init() {
    this.store = globalSkylineStore;
    this.formRef = React.createRef();
  }

  renderExtra() {
    // Modified can add something on the login page
    return (
      <div
        style={{
          position: 'absolute',
          bottom: '15px',
          left: '20px',
        }}
      >
        <img src={pkuLogo} width="100px" alt="logo" />
      </div>
    );
  }

  render() {
    return (
      <>
        <h1 className={styles.welcome}>{this.productName}</h1>
        <SimpleForm
          formItems={this.formItems}
          name="normal_login"
          className={styles['login-form']}
          initialValues={this.defaultValue}
          onFinish={this.onFinish}
          formref={this.formRef}
          size="large"
        />
        {this.renderExtra()}
      </>
    );
  }
}

export default inject('rootStore')(observer(Login));
