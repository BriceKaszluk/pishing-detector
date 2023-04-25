import { useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosResponse } from 'axios';

interface GoogleSafeBrowsingResponse {
  matches?: Array<{
    threatType: string;
    platformType: string;
    threat: {
      url: string;
    };
    cacheDuration: string;
    threatEntryType: string;
  }>;
}

const URLChecker: React.FC = () => {
  const [url, setURL] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setURL(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

    const requestBody = {
      client: {
        clientId: 'yourcompanyname',
        clientVersion: '1.0',
      },
      threatInfo: {
        threatTypes: [
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION',
        ],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }],
      },      
    };

    try {
      const response: AxiosResponse<GoogleSafeBrowsingResponse> = await axios.post(apiUrl, requestBody);
      setStatus(response.data.matches ? 'Dangereux' : 'Sûr');
    } catch (error) {
      console.error(error);
      setStatus('Erreur lors de la vérification de l\'URL');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="flex items-center border-b border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Entrez l'URL"
            value={url}
            onChange={handleChange}
          />
          <button
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Vérifier
          </button>
        </div>
      </form>
      {status && (
        <div className="mt-4">
          <p>
            L'URL est{' '}
            <span
              className={`font-bold ${
                status === 'Sûr' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {status}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default URLChecker;
