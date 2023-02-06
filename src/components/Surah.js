import React, { useEffect, useState } from 'react';
import { getDocs } from 'firebase/firestore';

import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Surah() {
  const [surahs, setSurahs] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  const getData = async () => {
    try {
      let surahList = [];
      const querySnapshot = await getDocs('');
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, ' => ', doc.data());
        surahList.push({ id: doc.id, data: doc.data() });
      });
      setSurahs([...surahList]);
    } catch (error) {
      console.log('error', error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  let navigate = useNavigate();

  console.log(surahs);

  const OneSurah = ({
    number,

    audioUrl,
    englishName,

    fileSize,

    lugandaName,
    description
  }) => {
    return (
      <div className='mt-5'>
        <Button onClick={() => navigate('/')}>Back Home</Button>
        <div className='space-y-3 ml-5 my-14'>
          <h3>Surah index: {number}</h3>

          <h3>English name: {englishName}</h3>
          <h3>Luganda name: {lugandaName}</h3>
          <h3>File size: {fileSize} mbs</h3>
          <h3>Audio URL: {audioUrl}</h3>
          {Array.isArray(description)
            ? description.map((i) => {
                return <p>{i}</p>;
              })
            : 'description'}
        </div>
      </div>
    );
  };

  return (
    <div>
      {surahs.map((item) => {
        const {
          number,
          englishName,
          description,
          fileSize,
          lugandaName,
          name,
          audioUrl
        } = item.data;
        return (
          <div className='px-10'>
            <h3>Surah name: {name}</h3>

            <button onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? 'Hide details' : 'Show details'}
            </button>
            {showDetails && (
              <OneSurah
                number={number}
                englishName={englishName}
                description={description}
                fileSize={fileSize}
                lugandaName={lugandaName}
                name={name}
                audioUrl={audioUrl}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Surah;
