import axios from 'axios';
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Head from 'next/head'

export interface CastType {
  name: string;
  imageUrl?: string;
  character: string;
}

interface ShowDetailsType {
	name: string;
  imageUrl: string;
  summary: string;
  casts: CastType[];
}

interface ShowDetailsProps {
  country: string;
  details: ShowDetailsType;
}

const ShowDetails: React.FC<ShowDetailsProps> = ({country, details}) => {
  return (
    <main className="container">
      <div className="row mt-2">
        <Head>
          <title>TV Show | {details.name}</title>
          <meta name="description" content={details.name} />
        </Head>

        <div className="col text-center" style={{ width: "100%" }}>
          <h1>{details.name}</h1>
          <div className="text-container" dangerouslySetInnerHTML={{ __html: details.summary }} />
          <div>
            <Link href={`/${country}`}>
              <p style={{ cursor: "pointer", color: "#5a606b", fontWeight: "bolder" }}>Back Home</p>
            </Link>
          </div>
          
          <img
            // className="img-fluid"
         width="30%"
            src={details.imageUrl}
            alt={details.name}
          ></img>

          <div
            className="carousel-caption"
            style={{ textAlign: "center", fontSize: 35 }}
          >
            {details.name}
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col">
          <p style={{ color: "#5a606b", fontWeight: "bolder" }}>CASTS</p>
        </div>
      </div>
      <div className="row mt-3">
      {details.casts && details.casts.slice(0, 4).map((cast) => (
        <div className="col-md-3 text-center" key={cast.name}>
          {cast.imageUrl && <img
            className="img-fluid rounded-circle mx-auto d-block"
            src={cast.imageUrl}
            alt={cast.name}
          ></img>}
          <p className="font-weight-bold text-center">{cast.name}</p>
        
          <p
            className="font-weight-light text-center"
            style={{ color: "#5a606b" }}
          >
            {cast.character}
          </p>
        </div>
      ))} 
      </div>
    
      </main>
  )
}

// {
//   id: 3221,
//   name: 'Mystery Diners',
//   imageUrl: 'https://static.tvmaze.com/uploads/images/medium_portrait/17/43517.jpg'
// }

// https://api.tvmaze.com/shows/3221?embed=cast

export const getServerSideProps: GetServerSideProps = async (context) => {
  // console.log(context)
  // { 
  //  ...
  //   query: { country: 'us', showId: '24644' },
  //   resolvedUrl: '/us/24644?country=us&showId=24644',
  //   params: { country: 'us', showId: '24644' },
  //  ...
  // }

  const { country, showId } = context.query;
  const {data} = await axios.get(`https://api.tvmaze.com/shows/${showId}?embed=cast`);

  const casts: CastType[] = data._embedded.cast.map((cast: any) => {
    const name = cast.person.name;
    const imageUrl = (cast.person.image && cast.person.image.medium) || ''
    const character = cast.character.name

    return {
      name,
      imageUrl,
      character
    }
  })

  const modifiedData: ShowDetailsType = {
    name: data.name,
    imageUrl: data.image.original,
    summary: data.summary,
    casts
  }

  return {
      props: {
        details: modifiedData,
        country
      }
  }
}

export default ShowDetails