import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import logoImg from '../../assets/github-logo.svg';
import api from '../../services/api';

import { Title, Form, Profiles, Error } from './style';

interface User {
    login: string;
    name: string;
    bio: string;
    avatar_url: string;
}

const Dashboard: React.FC = () => {
    const [newUser, setNewUser] = useState('');
    const [inputError, setInputError] = useState('');

    const [user, setUser] = useState<User[]>(() => {
        const storageUser = localStorage.getItem(
            '@GithubExplorer:repositories',
        );

        if (storageUser) {
            return JSON.parse(storageUser);
        }

        return [];
    });

    useEffect(() => {
        localStorage.setItem(
            '@GithubExplorer:repositories',
            JSON.stringify(user),
        );
    }, [user]);

    async function handAddUser(
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        if (!newUser) {
            setInputError('Digite o nome do usuário Git');
            return;
        }
        try {
            const response = await api.get<User>(`users/${newUser}`);

            const user0 = response.data;

            setUser([...user, user0]);
            setNewUser('');
            setInputError('');
        } catch (err) {
            setInputError('Erro na busca por esse usuário');
        }
    }

    return (
        <>
            <img src={logoImg} alt="Github Explorer" />
            <Title>Explore usuários do Github</Title>

            <Form hasError={!!inputError} onSubmit={handAddUser}>
                <input
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    placeholder="Digite o nome do usuário"
                />
                <button type="submit">Pesquisar</button>
            </Form>

            {inputError && <Error>{inputError}</Error>}

            <Profiles>
                {user.map((user0) => (
                    <Link key={user0.login} to={`/users/${user0.login}`}>
                        <img src={user0.avatar_url} alt={user0.login} />
                        <div>
                            <strong>{user0.name}</strong>
                            <p>{user0.bio}</p>
                        </div>

                        <FiChevronRight size={20} />
                    </Link>
                ))}
            </Profiles>
        </>
    );
};

export default Dashboard;
