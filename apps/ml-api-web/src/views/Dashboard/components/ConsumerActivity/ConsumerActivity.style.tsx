import styled from 'styled-components';

export const KidContainer = styled.div`
    
    .header {
        display: flex;
        align-items: center;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;

        .title {
            marginleft: 80px;
        }

        .week-selector {
            marginleft: 20;
            & button: {
                padding: 15;
                border-radius: 7;
                border: 1px solid #e4e4e4;
                font-size: 13;
                width: 260;
                background-color: white;
                cursor: pointer;
                & svg {
                    display: none;
                }
            }

            .select-week {
                display: flex;
                color: black;
                width: 200px;
                background: white;
                padding: 0 0 10px;
                & svg {
                    display: flex;
                    marginTop: 3px;
                },
            }
        }
    }

    .card-row {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 10px;
        flex-direction: row;
        @media screen and (max-width: 991px) {
            flex-direction: column;
        }  
    }
      
      .card-col {
        width: 49%;
        height: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        @media screen and (max-width: 991px) {
            width: 100%;
        }
      }
`;
