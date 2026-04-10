import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/authContext';

function Login() {
    const { login, register, error, setError } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [inputState, setInputState] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { name, email, password } = inputState;

    const handleInput = (e) => {
        setInputState({ ...inputState, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isRegister) {
            await register(name, email, password);
        } else {
            await login(email, password);
        }
    };

    return (
        <LoginStyled>
            <div className="card">
                <div className="logo">
                    <h1>💰 Budget Wise</h1>
                    <p>Track your expenses smartly</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <p className="error">⚠️ {error}</p>}

                    {isRegister && (
                        <div className="input-control">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={name}
                                onChange={handleInput}
                                required
                            />
                        </div>
                    )}

                    <div className="input-control">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={handleInput}
                            required
                        />
                    </div>

                    <div className="input-control">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleInput}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-btn">
                        {isRegister ? 'Create Account' : 'Sign In'}
                    </button>
                </form>

                <p className="toggle">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                    <span onClick={() => { setIsRegister(!isRegister); setError(null); }}>
                        {isRegister ? ' Sign In' : ' Register'}
                    </span>
                </p>
            </div>
        </LoginStyled>
    );
}

const LoginStyled = styled.div`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

    .card {
        background: rgba(252, 246, 249, 0.95);
        border: 2px solid #fff;
        border-radius: 32px;
        padding: 3rem 2.5rem;
        width: 100%;
        max-width: 420px;
        box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);

        .logo {
            text-align: center;
            margin-bottom: 2rem;
            h1 {
                font-size: 2rem;
                font-weight: 800;
                color: #222260;
            }
            p {
                color: rgba(34, 34, 96, 0.6);
                font-size: 0.95rem;
                margin-top: 0.3rem;
            }
        }

        .error {
            background: #ffe0e0;
            color: red;
            padding: 0.7rem 1rem;
            border-radius: 8px;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            text-align: center;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
        }

        .input-control {
            input {
                width: 100%;
                font-family: inherit;
                font-size: 1rem;
                outline: none;
                border: 2px solid #fff;
                padding: 0.8rem 1rem;
                border-radius: 10px;
                background: transparent;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                color: rgba(34, 34, 96, 0.9);
                box-sizing: border-box;
                &::placeholder {
                    color: rgba(34, 34, 96, 0.4);
                }
                &:focus {
                    border-color: #9b59b6;
                }
            }
        }

        .submit-btn {
            margin-top: 0.5rem;
            padding: 0.9rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: #fff;
            border: none;
            border-radius: 30px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);
            transition: opacity 0.2s;
            &:hover {
                opacity: 0.9;
            }
        }

        .toggle {
            text-align: center;
            margin-top: 1.5rem;
            color: rgba(34, 34, 96, 0.6);
            font-size: 0.9rem;

            span {
                color: #764ba2;
                font-weight: 700;
                cursor: pointer;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
`;

export default Login;