import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { setDoc, doc, FieldValue, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { uuidv4 } from '@firebase/util';

function Home() {
  let navigate = useNavigate();

  const [name, setName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [lugandaName, setLugandaName] = useState('');
  const [number, setNumber] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [description, setDescription] = useState([]);
  const [paragraph, setParagraph] = useState('');
  const [fileSize, setFileSize] = useState();

  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');

  const addSurah = async () => {
    if (englishName === '') {
      console.log('fill in the english name');
      setError('fill in the english name');
      setShowError(true);
    } else if (lugandaName === '') {
      console.log('fill in the luganda name');
      setError('fill in the luganda name');
      setShowError(true);
    } else if (name === '') {
      console.log('fill in the name');
      setError('fill in the surah name');
      setShowError(true);
    } else if (!number) {
      console.log('fill in the surah index');
      setError('fill in the surah index');
      setShowError(true);
    } else if (audioUrl === '') {
      console.log('provide the audio url');
      setError('provide the audio url');
      setShowError(true);
    } else if (description.length === 0) {
      console.log('description cannot be empty');
      setError('description cannot be empty');
      setShowError(true);
    } else if (!fileSize) {
      console.log('what is the download file size');
      setError('fill in the file size of the surah');
      setShowError(true);
    } else {
      console.log(englishName);
      console.log(lugandaName);
      console.log(number);
      console.log(audioUrl);
      console.log(description);
      console.log(fileSize);

      try {
        const surahData = {
          englishName: englishName,
          lugandaName: lugandaName,
          audioUrl: audioUrl,
          number: number,
          description: description,
          fileSize: fileSize,
          name: name,
          timestamp: serverTimestamp(),
          id: uuidv4()
        };
        console.log(surahData);
        await setDoc(doc(db, 'surah', surahData.id), surahData);

        console.log('Success', 'surah uploaded successfully');
      } catch (error) {
        console.log('Error', `Failed to upload due to ${error}`);

        // setLoading(false);
      }

      navigate('/surah');
    }
  };

  return (
    <form>
      <div className='flex items-center justify-center flex-col mt-20 mb-10'>
        {showError && (
          <div className='flex items-center text-white px-3 rounded-full space-x-3 bg-red-400 absolute top-32'>
            <h3 className='text-2xl '>{error}</h3>
            <button className='text-2xl ' onClick={() => setShowError(false)}>
              Ok
            </button>
          </div>
        )}

        <div className='my-2'>
          <label htmlFor='name'>
            Arabic Name:{' '}
            <input
              type='text'
              style={{ padding: 5, outline: 'none', fontSize: 17 }}
              placeholder='Arabic ame'
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
          </label>
        </div>
        <div className='my-2'>
          <label htmlFor='engishName'>
            English Name:{' '}
            <input
              type='text'
              style={{ padding: 5, outline: 'none', fontSize: 17 }}
              placeholder='English name'
              value={englishName}
              onChange={(e) => setEnglishName(e.currentTarget.value)}
            />
          </label>
        </div>
        <div className='my-2'>
          <label htmlFor='lugandaName'>
            Luganda Name:{' '}
            <input
              type='text'
              style={{ padding: 5, outline: 'none', fontSize: 17 }}
              placeholder='Luganda name'
              value={lugandaName}
              onChange={(e) => setLugandaName(e.currentTarget.value)}
            />
          </label>
        </div>
        <div className='my-2'>
          <label htmlFor='number'>
            Number:{' '}
            <input
              type='text'
              style={{ padding: 5, outline: 'none', fontSize: 17 }}
              placeholder='number'
              value={number}
              onChange={(e) => setNumber(e.currentTarget.value)}
            />
          </label>
        </div>
        <div className='my-2'>
          <label htmlFor='audioUrl'>
            Audio URL:{' '}
            <input
              type='text'
              style={{ padding: 5, outline: 'none', fontSize: 17 }}
              placeholder='Audio URI'
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.currentTarget.value)}
            />
          </label>
        </div>
        <div className=' p-2 border-2 my-2'>
          <label htmlFor='description' className='flex flex-col items-center'>
            Description:
            <textarea
              rows={5}
              placeholder='Description'
              style={{ padding: 5, fontSize: 17, outline: 'none' }}
              value={paragraph}
              onChange={(e) => setParagraph(e.currentTarget.value)}
            ></textarea>
            <button
              className='bg-blue-400 px-2 rounded-full text-white'
              onClick={(e) => {
                e.preventDefault();
                setDescription([...description, paragraph]);
                setParagraph('');
              }}
            >
              Add
            </button>
          </label>
        </div>
        <div className='my-2'>
          <label htmlFor='fileSize'>
            File Size:{' '}
            <input
              type='text'
              placeholder='File size'
              style={{ padding: 5, outline: 'none', fontSize: 17 }}
              value={fileSize}
              onChange={(e) => setFileSize(e.currentTarget.value)}
            />
          </label>
        </div>

        <button
          className='bg-yellow-300 px-2 rounded-full'
          onClick={(e) => {
            e.preventDefault();
            addSurah();
          }}
        >
          Add Surah
        </button>
      </div>
    </form>
  );
}

export default Home;
