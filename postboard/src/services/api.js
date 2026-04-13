const BASE_URL = 'https://jsonplaceholder.typicode.com';

async function requisicao(endpoint, opcoes = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...opcoes.headers,
    },
    ...opcoes,
  });
  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function getPosts() {
  return requisicao('/posts?_limit=20');
}

export async function getPostsPaginados(page = 1, limit = 10) {
  return requisicao(`/posts?_page=${page}&_limit=${limit}`);
}

export async function getPostPorId(id) {
  return requisicao(`/posts/${id}`);
}

export async function getPostsPorUsuario(userId) {
  return requisicao(`/posts?userId=${userId}`);
}

export async function criarPost(dados) {
  return requisicao('/posts', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export async function atualizarPost(id, dados) {
  return requisicao(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

export async function deletarPost(id) {
  return requisicao(`/posts/${id}`, {
    method: 'DELETE',
  });
}

export async function getUsuarios() {
  return requisicao('/users');
}

export async function getUsuarioPorId(id) {
  return requisicao(`/users/${id}`);
}