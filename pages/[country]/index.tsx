import axios from 'axios';
import { GetServerSideProps } from 'next'
import Link from 'next/link'

interface ShowType {
	id: number;
	name: string;
	imageUrl: string;
}

interface CountryProps {
    shows: ShowType[];
    country: string;
}

const ShowsByCountry: React.FC<CountryProps> = ({ shows, country }) => {
    // console.log(shows)

    return (
        <main className="container">
            <div className="row mt-3">
          { shows?.slice(0, 12).map((show: ShowType) => (
            <div className="col-md-3 col-sm-6" key={show.id}>
              <div className="card">
                <Link href={`/${country}/${show.id}`}>
                  <img className="img-fluid" src={show.imageUrl} alt={show.name}></img>
                </Link>
              </div>
              <div className="mt-3">
                <p style={{ fontWeight: "bolder" }}>{show.name}</p>
              </div>
            </div>
          ))} 
            </div>
        </main>
    )
}

// https://api.tvmaze.com/schedule?country=us&date=1960-12-01
export const getServerSideProps: GetServerSideProps = async (context) => {
    // console.log(context)

    const country = context.query.country || 'us'
    const {data} = await axios.get(
        `https://api.tvmaze.com/schedule?country=${country}&date=2014-12-01`
    );

    const modifiedData: ShowType[] = data.map(({show}) => ({
        id: show.id,
        name: show.name,
        imageUrl: ((show.image && show.image.medium) || '')
    }))

    return {
        props: {
            shows: modifiedData,
            country
        }
    }
  };

export default ShowsByCountry