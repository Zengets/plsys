import { Input, Tooltip, Icon, Select, DatePicker, TreeSelect } from 'antd';
import Highlighter from 'react-highlight-words';
import moment from 'moment';

const { TreeNode } = TreeSelect;
let { Option } = Select;

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.props.onRef(this);
  }

  loop = data =>
    data && data.length > 0
      ? data.map(item => {
          const title = <span>{item.title}</span>;
          if (item.children) {
            return (
              <TreeNode value={item.key} key={item.key} title={title} icon={<Icon type="edit" />}>
                {this.loop(item.children)}
              </TreeNode>
            );
          } else {
            return (
              <TreeNode value={item.key} key={item.key} title={title} icon={<Icon type="edit" />} />
            );
          }
        })
      : [];

  loopname = (data, key) => {
    let name = '';
    let loop = datas =>
      datas.map(item => {
        if (item.key == key) {
          name = item.title;
          return;
        } else if (item.children) {
          loop(item.children);
          return;
        } else {
          return;
        }
      });
    loop(data ? data : []);

    return name;
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input.Search
          allowClear
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`请输入查询内容...`}
          onSearch={val => this.props.handleSearch([val], dataIndex)}
          style={{ width: 188, display: 'block' }}
        />
      </div>
    ),
    filterIcon: filtered => (
      <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Tooltip
          title={
            this.props.postData[dataIndex] ? `查询条件:${this.props.postData[dataIndex]}` : null
          }
        >
          <Icon
            type="search"
            style={{ color: this.props.postData[dataIndex] ? '#68b356' : '#ff2100' }}
          />
        </Tooltip>
      </span>
    ),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.focus());
      }
    },
    render: text => (
      <Highlighter
        title={text ? text.toString() : ''}
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.props.postData[dataIndex]]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ),
  });

  getname = (option, id) => {
    return option && option.length > 0
      ? option.filter(item => {
          return item.dicKey == id;
        })[0].dicName
      : '';
  };

  getColumnSelectProps = (dataIndex, option) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Select
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          allowClear
          ref={node => {
            this.searchSelect = node;
          }}
          placeholder={`请选择...`}
          value={this.props.postData[dataIndex]}
          onChange={val => {
            this.props.handleSearch([val], dataIndex);
          }}
          style={{ width: 288, display: 'block' }}
        >
          {option &&
            option.map((item, i) => {
              return (
                <Option title={item.dicName} value={item.dicKey} key={i}>
                  {item.dicName}
                </Option>
              );
            })}
        </Select>
      </div>
    ),
    filterIcon: filtered => (
      <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Tooltip
          title={
            this.props.postData[dataIndex]
              ? `查询条件:${this.getname(option, this.props.postData[dataIndex])}`
              : null
          }
        >
          <Icon
            type="caret-down"
            theme="filled"
            style={{ color: this.props.postData[dataIndex] ? '#68b356' : '#ff2100' }}
          />
        </Tooltip>
      </span>
    ),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchSelect.focus());
      }
    },
  });

  getColumnTreeSelectProps = (dataIndex, option) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <TreeSelect
          style={{ width: 300 }}
          value={this.props.postData[dataIndex]}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="Please select"
          allowClear
          treeDefaultExpandAll
          placeholder={`请选择...`}
          onChange={val => {
            this.props.handleSearch([val], dataIndex);
          }}
          ref={node => {
            this.searchTreeSelect = node;
          }}
        >
          {option && this.loop(option)}
        </TreeSelect>
      </div>
    ),
    filterIcon: filtered => (
      <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Tooltip
          title={
            this.props.postData[dataIndex]
              ? `查询条件:${this.loopname(option, this.props.postData[dataIndex])}`
              : null
          }
        >
          <Icon
            type="caret-down"
            theme="filled"
            style={{ color: this.props.postData[dataIndex] ? '#68b356' : '#ff2100' }}
          />
        </Tooltip>
      </span>
    ),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchTreeSelect.focus());
      }
    },
  });

  getColumnDateProps = (dataIndex, disableddate) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <DatePicker
          allowClear
          ref={node => {
            this.searchDate = node;
          }}
          disabledDate={disableddate}
          placeholder={`请选择...`}
          value={
            this.props.postData[dataIndex] ? moment(this.props.postData[dataIndex]) : undefined
          }
          onChange={val => {
            this.props.handleSearch(
              [val ? moment(val).format('YYYY-MM-DD') : undefined],
              dataIndex
            );
          }}
          style={{ width: 188, display: 'block' }}
        />
      </div>
    ),
    filterIcon: filtered => (
      <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Tooltip
          title={
            this.props.postData[dataIndex] ? `查询条件:${this.props.postData[dataIndex]}` : null
          }
        >
          <Icon
            type="caret-down"
            theme="filled"
            style={{ color: this.props.postData[dataIndex] ? '#68b356' : '#ff2100' }}
          />
        </Tooltip>
      </span>
    ),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchDate.focus());
      }
    },
  });

  getColumnMonthProps = (dataIndex, disableddate) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <DatePicker.MonthPicker
          allowClear
          ref={node => {
            this.searchDate = node;
          }}
          disabledDate={disableddate}
          placeholder={`请选择...`}
          value={
            this.props.postData[dataIndex] ? moment(this.props.postData[dataIndex]) : undefined
          }
          onChange={val => {
            this.props.handleSearch([val ? moment(val).format('YYYY-MM') : undefined], dataIndex);
          }}
          style={{ width: 188, display: 'block' }}
        />
      </div>
    ),
    filterIcon: filtered => (
      <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Tooltip
          title={
            this.props.postData[dataIndex] ? `查询条件:${this.props.postData[dataIndex]}` : null
          }
        >
          <Icon
            type="caret-down"
            theme="filled"
            style={{ color: this.props.postData[dataIndex] ? '#68b356' : '#ff2100' }}
          />
        </Tooltip>
      </span>
    ),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchDate.focus());
      }
    },
  });

  getColumnRangeProps = (start, end) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <DatePicker.RangePicker
          allowClear
          ref={node => {
            this.searchRange = node;
          }}
          value={
            this.props.postData[start]
              ? [moment(this.props.postData[start]), moment(this.props.postData[end])]
              : undefined
          }
          onChange={val => {
            this.props.handleSearch(
              [
                val[0] ? moment(val[0]).format('YYYY-MM-DD') : undefined,
                val[1] ? moment(val[1]).format('YYYY-MM-DD') : undefined,
              ],
              start,
              end
            );
          }}
          style={{ display: 'block' }}
        />
      </div>
    ),
    filterIcon: filtered => (
      <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Tooltip
          title={
            this.props.postData[start]
              ? `查询条件:从${this.props.postData[start]} - ${this.props.postData[end]}`
              : null
          }
        >
          <Icon
            type="caret-down"
            theme="filled"
            style={{ color: this.props.postData[start] ? '#68b356' : '#ff2100' }}
          />
        </Tooltip>
      </span>
    ),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchRange.focus());
      }
    },
  });

  render() {
    return <></>;
  }
}

export default SearchBox;
