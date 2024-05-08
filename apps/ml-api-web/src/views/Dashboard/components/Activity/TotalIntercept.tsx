import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    root: {
        width: '100%',
        margin: '20px 0 20px 0',
        height: '95%',
        borderRadius: 10,
        backgroundColor: 'white',
        padding: '25px 0px 25px 30px',
        '& span': {
            color: 'black',
            fontFamily: 'Merriweather',
            fontWeight: 'bold',
            fontSize: 13,
        },
        '& .small-span': {
            color: 'black',
            fontFamily: 'Merriweather',
            fontSize: 13,
            fontWeight: 'normal',
        },
    },
    loader: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 'calc(50vh - 190px)',
    },
    instancesContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingBottom: '20px',
        '& .count': {
            fontSize: 35,
            fontFamily: 'Lato',
        },
    },
    topIntercept: {
        margin: '20px 10px 20px 0px',
        '& thead': {
            textAlign: 'left',
        },
        '& table td:first-child': {
            width: '100%',
        },
    },
    weeklyChangeContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 20,
        alignSelf: 'start',
        width: '-webkit-fill-available',
        '& .percentagesContainer': {
            marginTop: 5,
            display: 'flex',
            flexDirection: 'row',
            '& .percentages': {
                display: 'flex',
                flexDirection: 'column',
                width: 100,
                '& .percentage': {
                    display: 'flex',
                    fontSize: 35,
                    fontFamily: 'Lato',
                    paddingRight: 10,
                    color: 'grey',
                },
            },
        },
    },
});

interface Props {
    topCategories: CategoryIntercept[];
    totalCountCategory: number;
    topUrl: UrlIntercept[];
}
type CategoryIntercept = {
    category: string;
    count: number;
};
type UrlIntercept = {
    url: string;
    count: number;
};

const TotalIntercept = ({ topCategories, totalCountCategory, topUrl }: Props) => {
    const classes = useStyles({});

    return (
        <div
            className={classes.root}
            style={{
                border: `2px solid #000000`,
            }}
        >
            <div className={classes.instancesContainer}>
                <span>Total Intercepts</span>
                <span className="count" id="instance-count">
                    {totalCountCategory}
                </span>
                <span className="small-span">number of instances for the top five categories</span>
            </div>
            <div className={classes.topIntercept}>
                {topCategories?.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Top 5 Categories</th>
                                <th>#</th>
                            </tr>
                        </thead>
                        {topCategories?.map((category: CategoryIntercept) => (
                            <tbody key={category.category}>
                                <tr key={category.category}>
                                    <td>{category.category}</td>
                                    <td>{category.count}</td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                ) : (
                    <span> No Intercept Exist For Category!</span>
                )}
            </div>
            {topCategories?.length > 0 && <hr />}
            <div className={classes.topIntercept}>
                {topUrl?.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Top 5 Sites</th>
                                <th>#</th>
                            </tr>
                        </thead>
                        {topUrl.map((url: UrlIntercept) => (
                            <tbody key={url.url}>
                                <tr key={url.url}>
                                    <td>{url.url}</td>
                                    <td>{url.count}</td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                ) : (
                    <span> No Intercept Exist For Sites!</span>
                )}
            </div>
        </div>
    );
};
export default TotalIntercept;
