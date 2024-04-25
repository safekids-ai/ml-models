import React from 'react';
import { addResponseInterceptor, removeResponseInterceptor } from '../utils/api';
import { pathOr } from 'ramda';
import { logError } from '../utils/helpers';

export class ErrorBoundary extends React.Component<any, { hasError: boolean; id: number; message?: string }> {
    constructor(props: {}) {
        super(props);
        this.state = { hasError: false, id: 0 };
    }

    componentDidMount() {
        const id = addResponseInterceptor(
            (response) => {
                return response;
            },
            (error) => {
                const responseStatus = pathOr<number>(0, ['response', 'status'], error);
                if (responseStatus === 0)
                    this.setState({
                        hasError: true,
                        message: "Couldn't connect to server",
                    });
                return Promise.reject(error);
            },
        );
        this.setState({ id });
    }
    componentWillUnmount() {
        removeResponseInterceptor(this.state.id);
    }
    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return { hasError: false };
    }

    componentDidCatch(error: any, errorInfo: any) {
        // You can also log the error to an error reporting service
        logError('Error in React:', error, errorInfo);
    }

    render() {
        const { hasError, message = 'Something went wrong.' } = this.state;
        if (hasError) {
            // You can render any custom fallback UI
            return <h1>{message}</h1>;
        }

        return this.props.children;
    }
}
