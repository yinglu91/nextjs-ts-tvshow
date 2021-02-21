
import { GetServerSideProps } from 'next'

const Home = () => null;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      permanent: false,
      destination: '/us'
    }
  }
};

export default Home;
