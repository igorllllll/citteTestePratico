import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronRight, FiChevronsLeft } from 'react-icons/fi';
import api from '../../services/api';

import logoImg from '../../assets/github-logo.svg';
import { Header, Issues, RepositoryInfor } from './styles';

// interface RepositoryParams {
//     user: string;
// }

interface User {
    name: string;
    avatar_url: string;
    company: string;
    location: string;
    bio: string;
    public_repos: number;
    login: string;
}

interface Repository {
    full_name: string;
    description: string;
    html_url: string;
    language: string;
    created_at: Date;
    updated_at: Date;
}

const Repository: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [repository, setRepository] = useState<Repository[]>([]);

    const { params } = useRouteMatch();

    const str = JSON.stringify(params);

    const str1 = str.substring(10, str.length - 2);

    useEffect(() => {
        api.get(`users/${str1}`).then((response) => {
            setUser(response.data);
        });

        api.get(`users/${str1}/repos`).then((response) => {
            setRepository(response.data);
        });
    }, [str1]);

    return (
        <>
            <Header>
                <img src={logoImg} alt="Github Explorer" />
                <Link to="/">
                    <FiChevronsLeft size={16} />
                    Voltar
                </Link>
            </Header>

            {user && (
                <RepositoryInfor>
                    <header>
                        <img src={user.avatar_url} alt={user.login} />
                        <div>
                            <strong>{user.name}</strong>
                            <p>{user.bio}</p>
                        </div>
                    </header>

                    <ul>
                        <li>
                            <strong>{user.location}</strong>
                            <span>Localização</span>
                        </li>
                        <li>
                            <strong>{user.public_repos}</strong>
                            <span>Número de repositórios</span>
                        </li>
                        <li>
                            <strong>{user.company}</strong>
                            <span>Empresa</span>
                        </li>
                    </ul>
                </RepositoryInfor>
            )}

            <Issues>
                {repository.map((i) => (
                    <a key={i.full_name} href={i.html_url}>
                        <div>
                            <strong>Repositório: {i.full_name}</strong>
                            <p>Descrição: {i.description}</p>
                            <p>Linguagem: {i.language}</p>
                            <p>Data de criação: {i.created_at}</p>
                            <p>Data da última atualização: {i.updated_at}</p>
                            <p>Link: {i.html_url}</p>
                        </div>

                        <FiChevronRight size={20} />
                    </a>
                ))}
            </Issues>
        </>
    );
};

export default Repository;
