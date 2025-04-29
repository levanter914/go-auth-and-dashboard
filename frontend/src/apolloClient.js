import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from "@apollo/client";

const createApolloClient = () => {
  const token = localStorage.getItem("token");  // Get token from localStorage

  const link = new HttpLink({
    uri: "http://localhost:8080/query",  
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
};

export const client = createApolloClient();
