import React from 'react';
import { LoginDialogProps } from '../interfaces/website.interface';
import { Form, Input, Button, message } from 'antd';
import LoginService from '../../services/login.service';
import BrowserLink from '../../components/BrowserLink';
import { e621AccountData } from '../../../../electron-app/src/websites/e621/e621-account.interface';

interface State extends e621AccountData {
  username: string;
  key: string;
  sending: boolean;
}

export default class E621Login extends React.Component<LoginDialogProps, State> {
  state: State = {
    username: '',
    key: '',
    sending: false
  };

  constructor(props: LoginDialogProps) {
    super(props);
    this.state = {
      ...this.state,
      ...(props.data as State)
    };
  }

  submit() {
    if (this.state.key && this.state.username) {
      this.setState({ sending: true });
      const data: e621AccountData = {
        username: this.state.username,
        key: this.state.key
      };
      LoginService.setAccountData(this.props.account._id, data)
        .then(() => {
          message.success('Login success.');
        })
        .catch(() => {
          message.error('Failed to login to e621 account.');
        })
        .finally(() => this.setState({ sending: false }));
    }
  }

  render() {
    return (
      <div className="container mt-6">
        <Form layout="vertical">
          <Form.Item label="Username" required>
            <Input
              className="w-full"
              value={this.state.username}
              onChange={({ target }) => this.setState({ username: target.value })}
            />
          </Form.Item>
          <Form.Item
            label="API Key"
            required
            extra={
              <div>
                <BrowserLink url="https://e621.net/users/home">
                  You must first get an API Key in your account settings [Manage API Access].
                </BrowserLink>
              </div>
            }
          >
            <Input
              type="password"
              className="w-full"
              value={this.state.key}
              onChange={({ target }) => this.setState({ key: target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Button
              disabled={!(this.state.username && this.state.key)}
              onClick={this.submit.bind(this)}
              loading={this.state.sending}
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}