import styled from 'styled-components';

export const CrisisEngagementSection = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction:row;
    gap: 56px;
    margin: 10px 0;
    .left-section {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
       .info-section {
            margin-bottom: 10px;
            h3 {
                font-weight: bold;
                color: #000000;
                font-family: Merriweather;
                margin:0;
                padding:0;
                margin-bottom: 5px;
            }
            p{
                margin:0;
                padding:0;
                color: #000000;
                font-family: Merriweather;
            }
       }
       .note-section {
            display: flex;
            align-items: center;
            padding: 13px 16px 18px 13px;
            background: #F7274A;
            border-radius: 10px;
            font-family: 'Merriweather';
            font-style: normal;
            font-weight: 900;
            font-size: 14px;
            line-height: 20px;
            color: #FFFFFF;
            max-width: 325px;
            width: auto;
            /* height: 111px; */
            /* width: 271px;
            height: 111px; */
       }
    }
    .right-section {
        box-sizing: border-box;
        height: 200px;
        width: 100%;
        background: #FFFFFF;
        border: 2px solid #000000;
        overflow-y: auto;
        padding: 9px 14px 9px 14px;
        margin-top: 10px;
        overflow-x: hidden;

        .child-record {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 400;
            font-size: 13px;
            line-height: 16px;
            color: #000000;
            margin-bottom: 34px;
            word-wrap: break-word;
            p{
                margin:0;
                width: 100%;
                max-width: 400px;
                a {
                    color: #fa6400;
                    text-decoration: underline;
                }
            }
            div {
                margin:0;
                width: 100%;
                max-width: 400px;
                overflow: hidden;
                height: 60px;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
            }
        }
    }
`;