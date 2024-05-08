import React from 'react';
import EmailAnalysis from '../../../../../svgs/EmailAnalysis.svg';
import { Container, NoDataAvailable } from './gmailReporting.style';

interface ReportDataTypes {
    totalOutgoing?: number | string;
    totalOutgoingChanged?: number | string;
    totalOutgoingSent?: number | string;
    totalReachedToAdult?: number | string;
    totalUnkind?: number | string;
    totalUnkindFlagged?: number | string;
}

interface Props {
    reportData: ReportDataTypes | null;
}

const GmailReporting: React.FC<Props> = ({ reportData }) => {
    return (
        <>
            {' '}
            {reportData ? (
                <Container>
                    <div>
                        <span className="left">
                            <EmailAnalysis />
                        </span>
                        <div className="email-analysis">Email Analysis</div>
                    </div>
                    <div>
                        <span className="left">{reportData?.totalUnkind}</span>
                        <div className="right">
                            Total unkind messages <span className="number">{reportData?.totalUnkindFlagged}</span> flagged by the kid
                        </div>
                    </div>
                    <div>
                        <span className="left">{reportData?.totalReachedToAdult}</span>
                        <div className="right">Instances where kid reached out to their adult</div>
                    </div>
                    <div>
                        <span className="left">{reportData?.totalOutgoing}</span>
                        <div className="right">
                            Outgoing messages flagged <span className="number">{reportData?.totalOutgoingChanged}</span> changed,{' '}
                            <span className="number">{reportData?.totalOutgoingSent}</span> sent
                        </div>
                    </div>
                </Container>
            ) : (
                <NoDataAvailable>No Data Available</NoDataAvailable>
            )}
        </>
    );
};

export default GmailReporting;
