import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

const App = ()=> {
  const [owners, setUsers] = useState([]);
  const [pets, setPets] = useState([]);

  useEffect(()=> {
    const fetchOwners = async()=> {
      const response = await axios.get('/api/owners');
      setUsers(response.data); 
    };
    fetchOwners();
  }, []);

  useEffect(()=> {
    const fetchPets = async()=> {
      const response = await axios.get('/api/pets');
      setPets(response.data);
    };
    fetchPets();
  }, []);

  return (
    <div>
      <h1>The Pet Club</h1>
      <main>
        <div>
          <h2>Owners ({ owners.length })</h2>
          <ul>
            {
              owners.map( owner => {
                const ownersPets = pets.filter( pet => pet.owner_id === owner.id );
                return(
                  <li key={ owner.id }>
                    { owner.name }
                    ({ ownersPets.length })
                  </li>
                );
              })
            }
          </ul>
        </div>
        <div>
          <h2>Pets ({ pets.length })</h2>
          <ul>
            {
              pets.map( pet => {
                return(
                  <li key={ pet.id }>
                    { pet.name }
                    <ul>
                      {
                        owners.map( owner => {
                          return(
                            <li key={ owner.id } className={ pet.owner_id === owner.id ? 'owner': ''}>
                              { owner.name }
                            </li>
                          );
                        })
                      }
                    </ul>
                  </li>
                );
              })
            }
          </ul>
        </div>
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
