import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Contributor() {
  const location = useLocation();

  if (!location.state) {
    return <div>Error: Location state is not available</div>;
  }

  const { username, repoName } = location.state;
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contributors`);
        if (!response.ok) {
          throw new Error('Failed to fetch contributors');
        }
        const data = await response.json();
        setContributors(data);
      } catch (error) {
        console.error('Error fetching contributors:', error);
      }
    };

    fetchContributors();
  }, [username, repoName]);

  return (
    <div className='m-10'>
      <h1 className='font-bold text-4xl'>Contributors for {username}/{repoName}</h1>
      <div className='m-10 border-double border-4 border-black shadow-2xl'>
        {contributors.map(contributor => (
          <h1 className='font-bold text-lg' key={contributor.id}>
            {contributor.login} - {contributor.contributions} contributions
          </h1>
        ))}
      </div>
    </div>
  );
}

export default Contributor;
