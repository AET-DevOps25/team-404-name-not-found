import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthProvider';
import {
    TextInput,
    PasswordInput,
    Button,
    Paper,
    Title,
    Container,
    Alert,
    Stack,
    Box,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password);
            navigate('/home');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={(theme: any) => ({
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:
                    theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
            })}
        >
            <Container size={420}>
                <Title align="center" mb="xl">
                    Welcome back!
                </Title>

                <Paper withBorder shadow="md" p={30} radius="md" component="form" onSubmit={handleSubmit}>
                    <Stack>
                        {error && (
                            <Alert icon={<IconAlertCircle size={16} />} title="Authentication error" color="red" radius="md">
                                {error}
                            </Alert>
                        )}

                        <TextInput
                            label="Email"
                            placeholder="your@email.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                            type="email"
                        />

                        <PasswordInput
                            label="Password"
                            placeholder="Your password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                        />

                        <Button type="submit" fullWidth loading={loading}>
                            Login
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
