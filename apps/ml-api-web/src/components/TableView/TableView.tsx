import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import { Root } from './TableView.style';

interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'right' | 'inherit' | 'left' | 'center' | 'justify' | undefined;
    format?: ((value: number | string) => string) | undefined;
}

type TableViewProps = {
    rows: any[];
    columns: Column[];
    OnPageChange: (page: number) => void;
    rowsPerPage?: number;
    count?: number;
    currentPage?: number;
};

const TableView = ({ rows = [], columns, OnPageChange, rowsPerPage = 15, count = 15, currentPage = 0 }: TableViewProps) => {
    const [page, setPage] = useState(currentPage);
    const [data, setData] = useState(rows || []);

    useEffect(() => {
        setData(rows);
    }, [rows]);

    useEffect(() => {
        setPage(currentPage);
    }, [currentPage]);

    const handleChangePage = (event: any, newPage: number) => {
        OnPageChange(newPage);
    };
    return (
        <Root style={{ width: '100%', overflow: 'auto' }}>
            <TableContainer className="table-container">
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[rowsPerPage]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                labelDisplayedRows={() => {
                    return `Page ${page + 1} of ${Math.ceil(count / rowsPerPage)}`;
                }}
            />
        </Root>
    );
};

export default TableView;
