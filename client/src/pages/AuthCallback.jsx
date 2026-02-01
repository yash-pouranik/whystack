import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            console.log('✅ Token received from OAuth callback');
            api.setToken(token);
            navigate('/projects', { replace: true });
        } else {
            console.error('❌ No token in callback URL');
            navigate('/login', { replace: true });
        }
    }, [searchParams, navigate]);

    return (
        <div className="h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
                <p className="text-zinc-400">Completing login...</p>
            </div>
        </div>
    );
}
