const addAuthHeader = (request: Request) => {
  const token = localStorage.getItem('token');
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
  return request;
};
