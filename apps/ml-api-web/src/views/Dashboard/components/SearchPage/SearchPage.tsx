import React, { useState, Dispatch, SetStateAction } from 'react';
import { debounce } from 'lodash';
import { Button, TextField } from '@mui/material';
import { Autocomplete } from '@material-ui/lab';
import TableView from '../../../../components/TableView/TableView';
import { getSearchResult, getAutoCompleteOptions, generateColumns, exportSearchResult } from './SearchPage.service';
import { useNotificationToast } from '../../../../context/NotificationToastContext/NotificationToastContext';
import { StudentSearchData, AutoCompleteOption } from './SearchPage.type';
import SearchButton from '../../../../components/SearchButton/SearchButton';
import { Content, Root, TableContainer, Title } from './SearchPage.style';
import Loader from '../../../../components/Loader/Loader';
import BlankState from '../BlankState/BlankState';
import { useMobile } from '../../../../utils/hooks';

const debouncedAutoSuggest = debounce((keyword: string, setResults: Dispatch<SetStateAction<AutoCompleteOption[]>>, setIsLoading: (value: boolean) => void) => {
    getAutoCompleteOptions(keyword)
        .then(({ data }) => {
            setIsLoading(false);
            setResults(data);
        })
        .catch((err) => {
            setIsLoading(false);
            setResults([]);
        });
}, 1000);

const SearchPage = () => {
    const isMobile = useMobile();
    const { showNotification } = useNotificationToast();
    const [data, setData] = React.useState<StudentSearchData[]>([]);
    const [options, setOptions] = React.useState<AutoCompleteOption[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [hasNoResult, setNoResult] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>('');
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);

    const onTextChange = (event: React.ChangeEvent<{}>, value: string) => {
        const val = value?.trim();
        setKeyword(val);
        event.persist();
        const search = debouncedAutoSuggest;
        if (!val) {
            setNoResult(false);
            debouncedAutoSuggest.cancel();
            setOptions([]);
            setIsLoading(false);
        } else {
            setIsLoading(true);
            search(val, setOptions, setIsLoading);
        }
    };

    const onSearch = () => {
        if (keyword) {
            setIsSearching(true);
            getSearchResult(keyword, 0)
                .then(({ data }) => {
                    setIsSearching(false);
                    setData(data.data);
                    setCount(data.totalCount);
                    setNoResult(!data.data.length);
                })
                .catch(() => {
                    setIsSearching(false);
                    setNoResult(false);
                    setData([]);
                    setCount(0);
                });
        } else {
            setData([]);
            setNoResult(false);
        }
    };
    const onDownload = () => {
        exportSearchResult(keyword)
            .then((response) => {
                const fileName = 'activity.csv';
                const url = window.URL.createObjectURL(
                    new Blob([response.data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    }),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                showNotification({
                    type: 'success',
                    message: 'Downloaded Successfully!',
                });
            })
            .catch(() => {
                showNotification({ type: 'error', message: 'Download failed' });
            });
    };

    const handlePageChange = (page: number) => {
        if (keyword) {
            setIsSearching(true);
            getSearchResult(keyword, page)
                .then(({ data }) => {
                    setIsSearching(false);
                    setData(data.data);
                    setCount(data.totalCount);
                    setNoResult(!data.data.length);
                    setPage(page);
                })
                .catch(() => {
                    setIsSearching(false);
                    setData([]);
                    setCount(0);
                    setNoResult(false);
                });
        }
    };

    return (
        <Root>
            <Title isMobile={isMobile}>Search</Title>
            <Autocomplete
                id="asynchronous-demo"
                style={{ width: 300 }}
                autoComplete
                autoHighlight
                getOptionSelected={(option, value) => option.email === value.email}
                filterOptions={(options, state) => {
                    const text = state?.inputValue?.toLowerCase().trim() || '';
                    return options.filter(
                        (option) =>
                            option.email.toLowerCase().includes(text) || `${option.firstName.toLowerCase()} ${option.lastName.toLowerCase()}`.includes(text),
                    );
                }}
                getOptionLabel={(option) => option.email}
                options={options}
                loading={isLoading}
                freeSolo
                onInputChange={onTextChange}
                renderOption={(option: AutoCompleteOption) => {
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div>
                                {option.firstName} {option.lastName}
                            </div>
                            <div style={{ color: 'gray', fontSize: 12 }}>{option.email}</div>
                        </div>
                    );
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    <SearchButton onClick={onSearch} />
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
            <Content>
                {isSearching && <Loader />}
                {!isSearching && !data.length && !!keyword && hasNoResult && <BlankState />}
                {!isSearching && !!data.length && (
                    <TableContainer>
                        <div className="header">
                            <span className="heading">Results</span>
                            <Button className="export-button" onClick={onDownload} variant="contained" disabled={!data.length || isSearching}>
                                EXPORT RESULTS
                            </Button>
                        </div>
                        <TableView OnPageChange={handlePageChange} rows={data} columns={generateColumns(data[0])} count={count} currentPage={page} />
                    </TableContainer>
                )}
            </Content>
        </Root>
    );
};
export default SearchPage;
