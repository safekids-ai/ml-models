import React from 'react';
import { v4 as uuid } from 'uuid';

export const FamilyIcon = ({ width = 24, height = 24, color = '#C1C7D0' }) => {
    const id1 = uuid();
    const id2 = uuid();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={width} height={height} viewBox="0 0 24 24">
            <defs>
                <path
                    id={id1}
                    d="M15.408 6.001l.187.012c1.391.173 2.428 1.367 2.405 2.769V10c-.002.95-.51 1.825-1.333 2.297v.585c0 .272.166.517.419.618l2.495 1c.253.1.419.346.419.618V18c0 .368-.298.667-.667.667h-4.789c.079-.214.12-.44.123-.667v-1.548c.002-.82-.498-1.556-1.26-1.858l-.607-.243c.044-.03.088-.063.133-.092.478-.35.848-.827 1.067-1.377v-.585c-.823-.472-1.331-1.348-1.333-2.297V8.667c0-.753.318-1.47.876-1.976s1.303-.752 2.052-.678zm-8.042 1.67c.84-.477 1.87-.469 2.7.021.82.485 1.307 1.382 1.267 2.334.085.814.417 1.583.953 2.202.113.14.164.32.141.497-.023.179-.117.34-.262.447-.65.419-1.394.674-2.165.743v.3c0 .273.167.517.42.618l2.494 1c.253.101.42.346.42.619V18c0 .368-.3.667-.667.667h-8C4.298 18.667 4 18.368 4 18v-1.548c0-.272.167-.517.42-.618l2.494-1c.253-.1.42-.346.42-.618v-.301c-.772-.07-1.515-.324-2.166-.743-.144-.107-.24-.268-.262-.446-.023-.178.028-.358.141-.498.543-.625.876-1.404.953-2.228.006-.965.527-1.853 1.366-2.33z"
                />
            </defs>
            <g fill="none" fillRule="evenodd">
                <g>
                    <mask id={id2} fill="#fff">
                        <use xlinkHref={'#' + id1} />
                    </mask>
                    <g fill={color} mask={`url(#${id2})`}>
                        <path d="M0 0H24V24H0z" />
                    </g>
                </g>
            </g>
        </svg>
    );
};
export const FamilyIconOutlined = ({ width = 24, height = 24, color }) => {
    const id1 = uuid();
    const id2 = uuid();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={width} height={height} viewBox="0 0 24 24">
            <defs>
                <path
                    id={id1}
                    d="M16.348 5.42c.923.532 1.508 1.495 1.561 2.552l.004.16v1.391c-.002 1.008-.491 1.946-1.3 2.527l-.091.06v.419c0 .121.064.232.165.295l.054.027 2.603 1.043c.365.146.615.484.651.871l.005.098v3.355h-3.478v-.696h2.782v-2.659c0-.122-.063-.233-.165-.296l-.054-.027-2.603-1.043c-.365-.146-.614-.483-.651-.87l-.005-.097v-.813l.175-.1c.707-.405 1.159-1.137 1.211-1.943l.005-.152V8.131c0-.87-.463-1.674-1.217-2.109-.709-.41-1.573-.434-2.3-.072l-.135.072-.301.174-.348-.603.301-.174c.97-.559 2.163-.559 3.131 0zm-7.13.276c1.728 0 3.13 1.402 3.13 3.13 0 .528.237 1.12.637 1.72.144.217.299.418.453.598l.052.06.12.132.206.206-.115.225c-.118.233-.407.544-.926.84-.432.244-.966.438-1.614.566l-.205.037v.014c0 .122.065.233.166.296l.054.027 2.602 1.043c.397.158.657.542.657.969v2.659H4v-2.66c.001-.426.26-.809.656-.966l2.603-1.044c.133-.053.22-.18.22-.323v-.015l-.206-.037c-.566-.112-1.046-.274-1.446-.477l-.167-.09c-.52-.295-.808-.606-.927-.839l-.114-.225.179-.179.06-.062.139-.157c.154-.18.309-.381.453-.597.4-.6.637-1.193.637-1.72 0-1.73 1.401-3.13 3.13-3.13zm0 .696c-1.345 0-2.435 1.09-2.435 2.435L6.777 9c-.043.635-.318 1.287-.748 1.933-.16.24-.332.463-.504.664l-.03.034.056.054c.085.076.196.16.34.25l.113.066c.459.261 1.074.46 1.868.566l.302.04v.619c0 .426-.26.81-.656.968l-2.604 1.043c-.131.053-.218.18-.218.322v1.963h9.043V15.56c0-.122-.064-.233-.165-.296l-.054-.027-2.603-1.044c-.395-.157-.655-.54-.656-.967v-.618l.302-.04c.794-.106 1.409-.305 1.868-.566.2-.113.347-.221.453-.316l.056-.054-.03-.034c-.129-.15-.258-.314-.382-.487l-.122-.177c-.47-.704-.754-1.416-.754-2.106l-.003-.134c-.07-1.282-1.132-2.301-2.432-2.301z"
                />
            </defs>
            <g fill="none" fillRule="evenodd">
                <g>
                    <mask id={id2} fill="#fff">
                        <use xlinkHref={'#' + id1} />
                    </mask>
                    <g fill={color || 'currentColor'} mask={`url(#${id2}`}>
                        <path d="M0 0H24V24H0z" />
                    </g>
                </g>
            </g>
        </svg>
    );
};

export const CalendarIcon = ({ width = 24, height = 24, color = '#B1B1B1' }) => {
    const id1 = uuid();
    const id2 = uuid();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={width} height={height} viewBox="0 0 24 24">
            <defs>
                <path
                    id={id1}
                    d="M9.174 4l-.001 2.086h5.957V4h1v2.086l3.87.001v13.217H4V6.087l4.173-.001V4h1zm10.13 5.869H4.695v8.74h14.61l-.001-8.74zM8.87 15.13v1.392H6.783V15.13H8.87zm4.173 0v1.392h-2.086V15.13h2.086zM8.87 11.652v1.391H6.783v-1.39H8.87zm4.173 0v1.391h-2.086v-1.39h2.086zm4.174 0v1.391H15.13v-1.39h2.087zm2.087-4.87H4.696L4.695 8.87h14.609V6.783z"
                />
            </defs>
            <g fill="none" fillRule="evenodd">
                <g>
                    <mask id={id2} fill="#fff">
                        <use xlinkHref={`#${id1}`} />
                    </mask>
                    <g fill={color} mask={`url(#${id2})`}>
                        <path d="M0 0H24V24H0z" />
                    </g>
                </g>
            </g>
        </svg>
    );
};
export const AddIcon = ({ width = '24px', height = '24px', color = '#b1b1b1' }) => {
    const id1 = uuid();
    const id2 = uuid();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={width} height={height} viewBox="0 0 24 24">
            <defs>
                <path
                    id={id1}
                    d="M12 4c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8c-.013-4.413-3.587-7.987-8-8zm4 8.667h-3.333V16h-1.334v-3.333H8v-1.334h3.333V8h1.334v3.333H16v1.334z"
                />
            </defs>
            <g fill="none" fillRule="evenodd">
                <g>
                    <mask id={id2} fill="#fff">
                        <use xlinkHref={`#${id1}`} />
                    </mask>
                    {/* <use fill="#000" fillRule="nonzero" xlinkHref="#47mhfjyhaa" /> */}

                    <g fill={color} mask={`url(#${id2})`}>
                        <path d="M0 0H24V24H0z" />
                    </g>
                </g>
            </g>
        </svg>
    );
};
export const EditIcon = ({ width = 24, height = 24, color = '#b1b1b1' }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={width} height={height} viewBox="0 0 24 24">
            <defs>
                <path
                    id="t8j5l0azxa"
                    d="M20 20.158v1H4v-1h16zM15.048 4l3.586 3.586L9.14 17.08l-4.483.897.897-4.483L15.048 4zm-2.286 3.363l-6.506 6.506-.628 3.136 3.137-.627 6.505-6.507-2.508-2.508zm2.286-2.286L13.3 6.824l2.509 2.509 1.748-1.747-2.51-2.509z"
                />
            </defs>
            <g fill="none" fillRule="evenodd">
                <g>
                    <mask id="3f8qp7yqab" fill="#fff">
                        <use xlinkHref="#t8j5l0azxa" />
                    </mask>
                    {/* <use fill="#000" fillRule="nonzero" xlinkHref="#t8j5l0azxa" /> */}
                    <g fill={color} mask="url(#3f8qp7yqab)">
                        <path d="M0 0H24V24H0z" />
                    </g>
                </g>
            </g>
        </svg>
    );
};
export const DeleteIcon = ({ width = 24, height = 24, color = '#b1b1b1' }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={width} height={height} viewBox="0 0 24 24">
            <defs>
                <path
                    id="q1r5m04eba"
                    d="M6.783 9.565v8.696c0 .542.413.988.943 1.039l.1.004h8.348c.542 0 .988-.413 1.039-.943l.004-.1V9.565h.696v8.696c0 .922-.718 1.676-1.625 1.735l-.114.004H7.826c-.922 0-1.676-.718-1.735-1.625l-.004-.114V9.565h.696zm5.87 2.087v4.87h-1v-4.87h1zm-2.783 0v4.87h-1v-4.87h1zm5.565 0v4.87h-1v-4.87h1zM15.13 4v2.782H20v1H4v-1h4.869V4h6.261zm-.695.696h-4.87v2.086h4.869V4.696z"
                />
            </defs>
            <g fill="none" fillRule="evenodd">
                <g>
                    <mask id="r1l02hdlpb" fill="#fff">
                        <use xlinkHref="#q1r5m04eba" />
                    </mask>
                    {/* <use fill="#000" fillRule="nonzero" xlinkHref="#q1r5m04eba" /> */}
                    <g fill={color} mask="url(#r1l02hdlpb)">
                        <path d="M0 0H24V24H0z" />
                    </g>
                </g>
            </g>
        </svg>
    );
};
export const KidIcon = ({ width = 24, height = 24, color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={width} height={height} viewBox="0 0 24 24">
            <defs>
                <path
                    id="lhiubdi76a"
                    d="M12.851 5C16.8 5 20 8.2 20 12.149c0 3.948-3.2 7.149-7.149 7.149-3.948 0-7.149-3.2-7.149-7.15 0-.717.106-1.41.303-2.063H4v-1h2.39C7.538 6.67 10 5 12.851 5zm6.132 5.085H6.719c-.218.648-.336 1.342-.336 2.064 0 3.572 2.896 6.468 6.468 6.468s6.468-2.896 6.468-6.468c0-.722-.118-1.416-.336-2.064zm-7.834 4.106c0 .94.762 1.703 1.702 1.703.903 0 1.64-.703 1.699-1.59l.003-.113h.681c0 1.317-1.067 2.383-2.383 2.383-1.272 0-2.312-.996-2.38-2.252l-.003-.13h.68zm-1.362-3.404c.564 0 1.022.457 1.022 1.022 0 .564-.458 1.02-1.022 1.02-.564 0-1.021-.456-1.021-1.02 0-.565.457-1.022 1.021-1.022zm6.128 0c.564 0 1.021.457 1.021 1.022 0 .564-.457 1.02-1.021 1.02-.564 0-1.021-.456-1.021-1.02 0-.565.457-1.022 1.02-1.022zM12.85 5.681c-2.464 0-4.606 1.377-5.698 3.404H18.55c-1.092-2.027-3.234-3.404-5.698-3.404z"
                />
            </defs>
            <g fill="none" fillRule="evenodd">
                <g>
                    <mask id="0o6yt0x4tb" fill="#fff">
                        <use xlinkHref="#lhiubdi76a" />
                    </mask>
                    <g fill={color || 'currentColor'} mask="url(#0o6yt0x4tb)">
                        <path d="M0 0H24V24H0z" />
                    </g>
                </g>
            </g>
        </svg>
    );
};
export const DeviceIcon = ({ width = 24, height = 24, color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={width} height={height} viewBox="0 0 24 24">
            <defs>
                <path
                    id="mpglrumd7a"
                    d="M19.333 5H4.667C4.298 5 4 5.298 4 5.667v10.666c0 .369.298.667.667.667h6v1.333H7.333v1.334h9.334v-1.334h-3.334V17h6c.369 0 .667-.298.667-.667V5.667c0-.369-.298-.667-.667-.667zm-.666 10.667H5.333V6.333h13.334v9.334z"
                />
            </defs>
            <g fill="none" fillRule="evenodd">
                <g>
                    <mask id="2re0gk2xib" fill="#fff">
                        <use xlinkHref="#mpglrumd7a" />
                    </mask>
                    {/* <use fill="#000" fillRule="nonzero" xlink:href="#mpglrumd7a" /> */}{' '}
                    <g fill={color || 'currentColor'} mask="url(#2re0gk2xib)">
                        <path d="M0 0H24V24H0z" />
                    </g>
                </g>
            </g>
        </svg>
    );
};
export const DoneIcon = ({ width = 24, height = 24, color = '' }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={width} height={height} viewBox="0 0 24 24">
            <defs>
                <path id="0qmdkkdfia" d="M19.41 5L20 5.459 9.048 19.54 4 14.493 4.528 13.964 8.977 18.413z" />
            </defs>
            <g fill="none" fillRule="evenodd">
                <g>
                    <mask id="jxm6c3mokb" fill="#fff">
                        <use xlinkHref="#0qmdkkdfia" />
                    </mask>
                    <g fill={color || 'currentColor'} mask="url(#jxm6c3mokb)">
                        <path d="M0 0H24V24H0z" />
                    </g>
                </g>
            </g>
        </svg>
    );
};
