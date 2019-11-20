import React from 'react';
import { Link } from 'react-router-dom';
import { SubmissionStore } from '../../stores/file-submission.store';
import { inject, observer } from 'mobx-react';
import { List, Avatar, Popconfirm, Modal, Input } from 'antd';
import { FileSubmission } from '../../../../electron-app/src/submission/file-submission/interfaces/file-submission.interface';
import SubmissionService from '../../services/submission.service';
import { SubmissionPackage } from '../../../../electron-app/src/submission/interfaces/submission-package.interface';
import SubmissionUtil from '../../utils/submission.util';

interface Props {
  submissionStore?: SubmissionStore;
}

interface State {
  search: string;
}

interface ListItemProps {
  item: SubmissionPackage<FileSubmission>;
}

class ListItem extends React.Component<ListItemProps, any> {
  state: any = {
    previewVisible: false
  };

  handleCancel = () => this.setState({ previewVisible: false });
  handleShow = () => this.setState({ previewVisible: true });

  render() {
    const { item } = this.props;
    return (
      <List.Item
        actions={[
          <Link to={`/edit/submission/${item.submission.id}`}>
            <a key="submission-edit">Edit</a>
          </Link>,
          <Popconfirm
            cancelText="No"
            okText="Yes"
            title="Are you sure you want to delete? This action cannot be undone."
            onConfirm={() => SubmissionService.deleteFileSubmission(item.submission.id)}
          >
            <a key="submission-delete">Delete</a>
          </Popconfirm>
        ]}
      >
        <List.Item.Meta
          avatar={
            <div className="cursor-zoom-in" onClick={this.handleShow}>
              <Avatar src={item.submission.primary.preview} shape="square" />
            </div>
          }
          title={SubmissionUtil.getFileSubmissionTitle(item)}
          description={`Created - ${new Date(item.submission.created).toLocaleString()}`}
        ></List.Item.Meta>
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          <img
            alt="preview"
            style={{ width: '100%' }}
            src={
              item.submission.primary.type === 'IMAGE'
                ? item.submission.primary.location
                : item.submission.primary.preview
            }
          />
        </Modal>
      </List.Item>
    );
  }
}

@inject('submissionStore')
@observer
export class Submissions extends React.Component<Props, State> {
  state: State = {
    search: ''
  };

  handleSearch = search => this.setState({ search: search.toLowerCase() });

  render() {
    const { submissionStore } = this.props;

    const submissions = submissionStore!.all.filter(s =>
      s.submission.title.toLowerCase().includes(this.state.search)
    );
    return (
      <div>
        <Input.Search onSearch={this.handleSearch} style={{ width: 200 }} />
        <div className="submission-list">
          <List
            loading={submissionStore!.isLoading}
            dataSource={submissions}
            renderItem={(item: SubmissionPackage<FileSubmission>) => <ListItem item={item}></ListItem>}
          ></List>
        </div>
      </div>
    );
  }
}
