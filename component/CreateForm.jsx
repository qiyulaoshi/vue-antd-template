import React, { useImperativeHandle, useState } from 'react';
import request from 'umi-request';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Modal } from 'antd';
import QS from 'qs'

const CreateForm = ({ cRef, setshowregister }) => {
    const columns = [
        {
            title: '商户号',
            width: 200,
            dataIndex: 'mchId',
            key: 'mchId',
            copyable: true,
        },
        {
            title: '商户名称',
            key: 'name',
            ellipsis: true,
            copyable: true,
            width: 220,
            dataIndex: 'name',
        },
        {
            title: '商户邮箱',
            width: 220,
            dataIndex: 'email',
            copyable: true,
            key: 'email',
        },
        {
            title: '商户简称',
            width: 180,
            search: false,
            dataIndex: 'shortName',
            key: 'shortName',
        },
        {
            title: '实名状态',
            width: 180,
            dataIndex: 'realStatus',
            key: 'realStatus',
            valueEnum: {
                0: {
                    text: '未实名',
                    status: 'Default',
                },
                1: {
                    text: '审核中',
                    status: 'Processing',
                },
                2: {
                    text: '审核通过',
                    status: 'Success',
                },
                3: {
                    text: '审核驳回',
                    status: 'Error',
                },
            },
        },
        {
            title: '风险提示',
            width: 150,
            key: 'riskInfo',
            dataIndex: 'riskInfo',
            search: false,
        },
        {
            title: '操作',
            width: 150,
            key: 'option',
            fixed: "right",
            dataIndex: 'option',
            search: false,
            render: (text, row) => [
                <a onClick={() => {
                    setshowregister(row)
                }}
                >选择</a>,
            ],
        },
    ]
    const [selectMantVisible, selectMant] = useState(false);//模态框
    const getMchList = async function (params) {  //查询列表
        params.currentPage = params.current
        delete params.current
        params = QS.stringify(params)
        console.log(params);
        return request('/mch/common/getMerchantList.do', {
            method: 'POST',
            data: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
    }
    useImperativeHandle(cRef, () => ({
        // setModal 就是暴露给父组件的方法
        setModal: () => {
            selectMant(true);
        }
    }));
    return (
        <Modal
            destroyOnClose
            title="选择商户"
            visible={selectMantVisible}
            onCancel={() => selectMant(false)}
            footer={null}
            width={1000}
        >
            <ProTable
                search={{
                    labelWidth: 80,
                    collapsed: false,
                    collapseRender: () => false,
                }}
                scroll={{ y: 400 }}
                toolBarRender={false}
                request={async (params) => {
                    console.log(params)
                    const response = await getMchList({
                        ...params
                    })
                    return Promise.resolve(
                        {
                            data: response.result,
                            total: response.paginator.totalCount || 0,
                            success: true,
                            pageSize: response.paginator.pageSize,
                            current: parseInt(`${params.currentPage}`, 10) || 1,
                        }
                    )
                }}
                rowKey={row=>row.mchId}
                columns={columns}
            />
        </Modal>
    );
};

export default CreateForm;
