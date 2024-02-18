import { Link } from '@remix-run/react';
import * as styles from './styles.css';
import { UserIcon } from '@heroicons/react/24/solid';

export default function Index() {
    return (
        <div>
            <header className={styles.header}>
                <h1>Bienvenue</h1>
                <UserIcon className={styles.icon} />
            </header>
            <section className={styles.section}>
                <Link to="/games/create" className={styles.button}>
                    Jouer
                </Link>
                <div>OU</div>
                <Link to="/games/join" className={styles.button}>
                    Rejoindre une partie
                </Link>
            </section>
        </div>
    );
}
