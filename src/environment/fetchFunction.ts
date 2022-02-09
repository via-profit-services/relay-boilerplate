/* eslint-disable no-console */
import { FetchFunction } from 'relay-runtime';

type FetchFunctionFactory = (graphqlEndpoint: string) => FetchFunction;

const fetchFunction: FetchFunctionFactory =
  graphqlEndpoint => async (operation, variables, _cacheConfig, uploadables) => {
    if (graphqlEndpoint === '') {
      throw new Error(`Invalid GraphQL endpoint. Got «${graphqlEndpoint}»`);
    }

    const request: RequestInit = {
      method: 'POST',
    };

    if (uploadables) {
      if (!window.FormData) {
        console.error('Uploading files without `FormData` not supported.');
      }

      const formData = new FormData();
      const map = {};

      let filesFieldName = 'variables.f';

      Object.keys(uploadables).forEach((_file, index) => {
        Object.entries(variables).forEach(([fieldName, fieldValue]) => {
          if (Array.isArray(fieldValue) && typeof fieldValue[index]?.name === 'string') {
            filesFieldName = `variables.${fieldName}`;
          }
        });

        map[index] = [`${filesFieldName}.${index}`];
      });

      formData.append(
        'operations',
        JSON.stringify({
          query: operation.text,
          documentId: operation.id,
          variables: {
            ...variables,
            files: Object.keys(uploadables).map(() => null),
          },
        }),
      );
      formData.append('map', JSON.stringify(map));

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(uploadables).forEach(([key, fileData], index) => {
        formData.append(String(index), fileData);
      });

      request.body = formData;
    } else {
      request.headers = {
        ...request.headers,
        'Content-Type': 'application/json',
      };

      request.body = JSON.stringify({
        documentId: operation.id,
        query: operation.text,
        variables,
      });
    }

    try {
      console.log(`fetch to ${graphqlEndpoint}`);
      const response = await fetch(graphqlEndpoint, request);
      const body = await response.json();
      // if (process.env.NODE_ENV === 'development') {
      const color = body.data && !body.errors ? '#009627' : '#f44336';
      console.groupCollapsed(
        '%c%s%c%s',
        `color:${color};`,
        '• ',
        'color: orange;',
        'GraphQL',
        `${operation.operationKind} ${operation.name}`,
      );
      console.log('%c%s', `color:${color}`, 'Request ', graphqlEndpoint);
      console.groupCollapsed('%c%s', `color:${color}`, operation.operationKind);
      console.log(operation.text);
      console.groupEnd();

      // variables
      console.groupCollapsed('%c%s', `color:${color}`, 'Variables');
      console.groupCollapsed('as Object');
      console.log(variables);
      console.groupEnd();
      console.groupCollapsed('as JSON string');
      console.log(JSON.stringify(variables));
      console.groupEnd();
      console.groupEnd();

      if (uploadables) {
        const filesArray = Object.values(uploadables);
        console.groupCollapsed('%c%s', `color:${color}`, `Files (${filesArray.length})`);
        console.table(filesArray);
        console.groupEnd();
      }
      if (body.data && !body.errors) {
        console.groupCollapsed('%c%s', `color:${color}`, 'Response');
        console.log(body.data);
        console.groupEnd();
      }

      if (body.errors) {
        console.groupCollapsed('%c%s', `color:${color}`, 'Errors');
        if (Array.isArray(body.errors)) {
          body.errors.forEach(error => {
            console.log('%c%s', `color:${color}`, error.message);
            console.groupCollapsed('%c%s', `color:${color}`, 'Details');
            console.log(error);
            console.groupEnd();
          });
        }
        console.log();
        console.groupEnd();
      }
      console.groupEnd();
      // }

      return body;
    } catch (err) {
      // console.error(err);

      return {
        data: null,
        errors: [
          {
            message: 'Failed to get GraphQL response',
          },
        ],
      };
      // throw new Error('Failed to get GraphQL response');
    }
  };

export default fetchFunction;
