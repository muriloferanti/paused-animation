export const createPreference = () => {
    return fetch('http://localhost:3001/create_preference', {
      method: 'POST',
    })
      .then(response => response.json())
      .catch(error => console.log(error));
  };
  