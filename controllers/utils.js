export function sanitizedOne(document) {
  const { data } = document;
  data.user = data.user.id;
  return data;
}

export function sanitizedAll(documents) {
  return documents.map((document) => {
    const { data } = document;
    data.user = data.user.id;
    data.id = document.ref.id;
    return data;
  });
}
