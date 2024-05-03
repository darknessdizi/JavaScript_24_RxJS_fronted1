(async () => {
  console.log('запрос');
  const response = await fetch('http://localhost:9000/posts/latest');
  let json = await response.text();
  console.log('response', json);
})();

(async () => {
  console.log('запрос');
  const response = await fetch('http://localhost:9000/posts/3456/comments/latest');
  let json = await response.text();
  console.log('response', json);
})();