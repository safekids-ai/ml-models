import styled from 'styled-components';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export const CustomTable = styled(Table)``;
export const CustomTableHead = styled(TableHead)`
    tr:first-child {
        th {
            border-bottom: none;
        }
        td {
            border-bottom: none;
        }
    }
`;
export const CustomTableBody = styled(TableBody)`
    tr:last-child {
        th {
            border-bottom: none;
        }
        td {
            border-bottom: none;
        }
    }
`;
export const CustomTableRow = styled(TableRow)`
    th:first-child {
        padding-left: 16px;
    }
    th:last-child {
        padding-right: 0;
        border-bottom: 1px solid #979797;
    }
    td:last-child {
        padding-right: 0;
    }
    th,
    td {
        border-bottom: 1px solid #979797;
    }
    .name {
        width: 320px;
    }
`;
export const CustomTableCell = styled(TableCell)`
    .title-container {
        font-style: bold;
        .highlight {
            font-size: 14px;
            font-weight: 900;
            text-align: center;
            color: #fa6400;
        }
        .text {
            font-size: 14px;
            font-weight: 900;
            text-align: center;
        }
    }
`;
export const CustomTableContainer = styled(TableContainer)``;

export const TableCellHeading = styled.div`
    min-width: 110px;
    max-width: 200px;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    letter-spacing: -0.1875px;
    color: #4a4a4a;
    display: flex;
    flex-direction: column;
    .bold {
        font-weight: 700;
    }
`;

export const TableTh = styled.span`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: -0.1875px;
    color: #4a4a4a;
`;

export const FreePlanCategories = styled.div`
    display: flex;
    background-color: #e8e8e8;

    .info-icon {
        height: 18px;
    }
`;

export const UpgradeDiviver = styled.div`
    display: flex;

    .hr-container {
        width: 100%;
        margin: auto;
        margin-right: 14px;
    }

    .subscribe-container {
        flex-direction: column;
        display: flex;
        align-items: end;
        width: 30%;

        .btn {
            letter-spacing: 1px;
            height: 50px;
            margin-right: 20px;
        }
    }
`;
export const TitleContainer = styled.div`
    width: 80%;
    margin: auto;
    font-style: bold;
    padding-left: 16px;

    .highlight {
        font-size: 14px;
        font-weight: 900;
        text-align: center;
        color: #fa6400;
    }
    .text {
        font-size: 14px;
        font-weight: 900;
        text-align: center;
    }
`;
