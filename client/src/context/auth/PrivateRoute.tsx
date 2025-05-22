import { type PropsWithChildren } from "react";
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider.tsx';

const PrivateRoute = ({ children }: PropsWithChildren) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
