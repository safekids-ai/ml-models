import React, { useEffect } from 'react';
import { Props } from './OUITree.types';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRight from '@mui/icons-material/ChevronRight';
import styled from 'styled-components';

const TreeItemContainer = styled.div`
    & .MuiTreeItem-content {
        height: 40px;
        padding-left: 10px;
    }
    & .MuiTreeItem-label {
        display: flex;
        height: 100%;
        align-items: center;
    }
    & div {
        font-family: 'Lato';
        font-style: normal;
        font-weight: 400;
        font-size: 13px;
        line-height: 16px;
        color: #000;
    }
`;

const OUITree = ({ data, setOU }: Props) => {
    const accountType: string | null = localStorage.getItem('account_type');
    const renderTree = (nodes: any) => (
        <TreeItemContainer>
            <TreeItem onClick={() => setOU?.(nodes)} key={nodes.id} nodeId={nodes.id} label={nodes.name}>
                {Array.isArray(nodes.children) ? nodes.children.map((node: any) => renderTree(node)) : null}
            </TreeItem>
        </TreeItemContainer>
    );
    useEffect(() => {
        if (accountType !== 'SCHOOL') {
            setOU?.(data[0]);
        }
    }, [accountType, data, setOU]);
    return (
        <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
            expanded={accountType === 'SCHOOL' ? undefined : [data[0]?.id.toString()]}
            defaultSelected={accountType === 'SCHOOL' ? undefined : [data[0]?.id.toString()]}
        >
            {data.map((node: any) => renderTree(node))}
        </TreeView>
    );
};

export default OUITree;
