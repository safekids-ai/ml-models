import React from 'react';

export const InstallIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41">
            <g fill="none" fillRule="evenodd">
                <g fill="#000" fillRule="nonzero">
                    <g>
                        <path
                            d="M41 0v41H0V29.574h.672v10.754h39.656V.672H.672v10.754H0V0h41zM17.811 11.96l8.541 8.54-.475.475v.189l-.188-.001-7.878 7.878-.475-.475 7.402-7.403H.336v-1h24.728l-7.728-7.729.475-.475z"
                            transform="translate(-1107 -304) translate(1107 304)"
                        />
                    </g>
                </g>
            </g>
        </svg>
    );
};
export const LoginIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="55" height="41" viewBox="0 0 55 41">
            <g fill="none" fillRule="evenodd">
                <g fill="#4A4A4A" fillRule="nonzero">
                    <g>
                        <path
                            d="M20.639 30.744v3.617H34.36v-3.617H55v9.788H0v-9.788h20.639zm-.746.745H.745v8.297h53.51V31.49H35.105v3.618H19.894v-3.618zM49.575 0v26.064h-.746V.745H6.17v25.32h-.746V0h44.15zM29.68 6.33v1.1H25.32v-1.1h4.362z"
                            transform="translate(-755 -304) translate(755 304)"
                        />
                    </g>
                </g>
            </g>
        </svg>
    );
};
export const DownloadInstallerIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="37" viewBox="0 0 45 37">
            <g fill="none" fillRule="evenodd">
                <g fill="#4A4A4A" fillRule="nonzero">
                    <g>
                        <path
                            d="M13 0v1H1v35h43V1H32V0h13v37H0V0h13zm10 .5v24.791l9.5-9.498.707.707L22.5 27.207 11.793 16.5l.707-.707 9.5 9.5V.5h1z"
                            transform="translate(-415 -323) translate(415 323)"
                        />
                    </g>
                </g>
            </g>
        </svg>
    );
};
export const LaptopIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="19" viewBox="0 0 22 19">
            <g fill="none" fillRule="evenodd">
                <g fill="currentColor" fillRule="nonzero">
                    <g>
                        <g>
                            <g>
                                <path
                                    d="M22 13.484v.355c0 2.155-1.748 3.903-3.903 3.903H3.903c-1.035 0-2.028-.411-2.76-1.143C.411 15.867 0 14.874 0 13.839v-.355h22zm-.73.71H.73l.02.147c.096.606.365 1.174.779 1.633l.116.123c.599.599 1.411.935 2.258.935h14.194c1.612 0 2.946-1.195 3.162-2.748l.01-.09zM17.387 0c1.326 0 2.41 1.04 2.48 2.348l.004.136v8.87h-.71v-8.87c0-.94-.732-1.71-1.657-1.77L17.387.71H4.613c-.94 0-1.71.732-1.77 1.657l-.004.117v8.87h-.71v-8.87c0-1.326 1.04-2.41 2.348-2.48L4.613 0h12.774zM11 2.484c.392 0 .71.318.71.71 0 .391-.318.71-.71.71-.392 0-.71-.319-.71-.71 0-.392.318-.71.71-.71z"
                                    transform="translate(-328 -231) translate(300 201) translate(20 20) translate(8 10)"
                                />
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};
export const RefreshIcon = () => {
    const uuid = (Math.random() * 1000).toString();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
            <defs>
                <path
                    id={'4a3o4r4h4a' + uuid}
                    d="M18.433 13.377l.71.144c-.715 3.52-3.822 6.087-7.456 6.087-1.745 0-3.398-.59-4.727-1.645L4.924 20 4 14.458l5.542.923-2.065 2.066c1.19.922 2.66 1.437 4.21 1.437 3.221 0 5.984-2.23 6.704-5.313l.042-.194zM18.45 4l.924 5.542-5.543-.923 2.066-2.066c-1.19-.922-2.66-1.437-4.21-1.437-3.222 0-5.985 2.23-6.704 5.313l-.042.194-.71-.144c.714-3.52 3.82-6.087 7.456-6.087 1.745 0 3.397.59 4.726 1.645L18.45 4z"
                />
            </defs>
            <g fill="none" fillRule="evenodd">
                <g>
                    <mask id={'8m414n3lcb' + uuid} fill="#fff">
                        <use xlinkHref={'#4a3o4r4h4a' + uuid} />
                    </mask>
                    <use fill="#000" fillRule="nonzero" xlinkHref={'#4a3o4r4h4a' + uuid} />
                    <g fill="currentColor" mask={`url(#8m414n3lcb${uuid})`}>
                        <path d="M0 0H24V24H0z" />
                    </g>
                </g>
            </g>
        </svg>
    );
};
export const ExpandIcon = () => {
    const uuid = Math.random() * 1000;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
            <defs>
                <path
                    id={'en0sef3gia' + uuid}
                    d="M7.146 9.146c.174-.173.443-.192.638-.057l.07.057L12 13.293l4.146-4.147c.174-.173.443-.192.638-.057l.07.057c.173.174.192.443.057.638l-.057.07-4.5 4.5c-.174.173-.443.192-.638.057l-.07-.057-4.5-4.5c-.195-.196-.195-.512 0-.708z"
                />
            </defs>
            <g fill="none" fillRule="evenodd">
                <g>
                    <g>
                        <g transform="translate(-956 -570) translate(300 495) matrix(0 -1 1 0 656 99)">
                            <mask id={'y2rl6gy00b' + uuid} fill="#fff">
                                <use xlinkHref={'#en0sef3gia' + uuid} />
                            </mask>
                            <use fill="#000" fillRule="nonzero" xlinkHref={'#en0sef3gia' + uuid} />
                            <g fill="#F7274A" mask={`url(#y2rl6gy00b${uuid})`}>
                                <path d="M0 0H24V24H0z" />
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};
export const CollapseIcon = () => {
    const uuid = (Math.random() * 1000).toString();
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
            <defs>
                <path
                    id={'gt4gdtq39a' + uuid}
                    d="M7.146 9.146c.174-.173.443-.192.638-.057l.07.057L12 13.293l4.146-4.147c.174-.173.443-.192.638-.057l.07.057c.173.174.192.443.057.638l-.057.07-4.5 4.5c-.174.173-.443.192-.638.057l-.07-.057-4.5-4.5c-.195-.196-.195-.512 0-.708z"
                />
            </defs>
            <g fill="none" fillRule="evenodd">
                <g>
                    <g transform="translate(-956 -290) translate(956 290)">
                        <mask id={'reyuf8n5tb' + uuid} fill="#fff">
                            <use xlinkHref={'#gt4gdtq39a' + uuid} />
                        </mask>
                        <use fill="#000" fillRule="nonzero" xlinkHref={'#gt4gdtq39a' + uuid} />
                        <g fill="#F7274A" mask={`url(#reyuf8n5tb${uuid})`}>
                            <path d="M0 0H24V24H0z" />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};

export const BrowserIcon = () => {
    return (
        <svg width={36} height={36} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <title>{'\uD83D\uDEA8sk/icons/Internet'}</title>
            <defs>
                <path
                    d="M12 4a8 8 0 110 16 8 8 0 010-16zm-7.296 8.352a7.308 7.308 0 005.868 6.813c-1.906-1.495-3.006-3.939-3.089-6.812zm14.592 0h-2.78c-.082 2.874-1.182 5.317-3.087 6.814a7.31 7.31 0 005.867-6.814zm-7.644 0H8.179c.092 2.985 1.345 5.434 3.473 6.715v-6.715zm4.169 0h-3.469l.001 6.713c2.125-1.283 3.376-3.73 3.468-6.712zm3.475-.7a7.308 7.308 0 00-5.868-6.817c1.907 1.496 3.007 3.942 3.089 6.817zm-8.725-6.818l-.214.047a7.308 7.308 0 00-5.653 6.772h2.78c.081-2.876 1.18-5.32 3.087-6.819zm-2.392 6.818h3.473v-6.72c-2.13 1.283-3.383 3.733-3.473 6.72zm4.174-6.716l-.001 6.716h3.469c-.09-2.984-1.342-5.433-3.468-6.716z"
                    id="prefix__a"
                />
            </defs>
            <g fill="none" fillRule="evenodd">
                <mask id="prefix__b" fill="#fff">
                    <use xlinkHref="#prefix__a" />
                </mask>
                <use fill="#212121" fillRule="nonzero" xlinkHref="#prefix__a" />
                <g mask="url(#prefix__b)" fill="#B1B1B1">
                    <path d="M0 0h24v24H0z" />
                </g>
            </g>
        </svg>
    );
};
