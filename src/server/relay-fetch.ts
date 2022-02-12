import { URL } from 'node:url';
import http from 'node:http';
import { FetchFunction } from 'relay-runtime';

type Props = { graphqlEndpoint: string; graphqlSubscriptions: string };

type FetchFunctionFactory = (props: Props) => FetchFunction;

const fetchFunctionFactory: FetchFunctionFactory = props => {
  const { graphqlEndpoint } = props;
  if (graphqlEndpoint === '') {
    throw new Error(`Invalid GraphQL endpoint. Got «${graphqlEndpoint}»`);
  }

  const { protocol, hostname, port, pathname } = new URL(graphqlEndpoint);

  const fetchFunction: FetchFunction = (operation, variables) =>
    new Promise(resolve => {
      const request = http.request(
        {
          method: 'POST',
          protocol,
          hostname,
          port,
          path: pathname,
          headers: {
            'Content-Type': 'application/json',
          },
        },
        response => {
          let data = '';
          response.on('data', d => {
            data += d;
          });
          response.on('end', () => {
            resolve(JSON.parse(data) as any);
          });
        },
      );
      request.write(
        JSON.stringify({
          documentId: operation.id,
          query: operation.text,
          variables,
        }),
      );
      request.end();
    });

  return fetchFunction;
};

export default fetchFunctionFactory;
