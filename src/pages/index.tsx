import Head from 'next/head';
import { Inter } from 'next/font/google';
import FormVehicle from '@/components/form-vehicle/form-vehicle';
import FormGarage from '@/components/form-garage/form-garage';
import ParkingList from '@/components/parking-list/parking-list';
import LevelDropdown from '@/components/level-dropdown/level-dropdown';
import classNames from 'classnames';
import { GetStaticProps } from 'next';
import db from '../../database.config';
import { useSelectedLevel } from '@/contexts/level-context';

const inter = Inter({ subsets: ['latin'] });

const Home = () => {
    const { selectedLevel, setSelectedLevelInInput } = useSelectedLevel();

    return (
        <>
            <Head>
                <title>Parking Management</title>
                <meta name="description" content="Application for managing a Venice's parking lot" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={classNames(inter.className, 'df-fxdc-aic')}>
                <h1>Parking Management</h1>

                <div className="df-fxdr-jcc">
                    <section>
                        <LevelDropdown value={selectedLevel} onChange={setSelectedLevelInInput} />
                        <ParkingList />
                    </section>
                    <section className="sticky">
                        <FormGarage />
                        {selectedLevel && <FormVehicle />}
                    </section>
                </div>
            </main>
        </>
    );
};

export const getStaticProps: GetStaticProps = () => {
    db.open();

    return { props: {} };
};

export default Home;
