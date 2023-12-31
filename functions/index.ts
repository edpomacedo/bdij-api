import { FastifyInstance, FastifyReply, FastifyRequest, FastifyServerOptions } from 'fastify';
import fastifyCors, { FastifyCorsOptions } from '@fastify/cors';
import axios from 'axios';

interface IQueryString {
  resource: string;
}

interface CustomRouteGenericQuery {
  Querystring: IQueryString;
}

export default async function (instance: FastifyInstance, opts: FastifyServerOptions, done) {
  // Define your CORS options
  const corsOptions: FastifyCorsOptions = {
    origin: '*', // You can customize this based on your requirements
    methods: ['GET', 'POST'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    // Add other CORS options as needed
  };

  // Register @fastify/cors plugin with the defined options
  instance.register(fastifyCors, corsOptions);

  instance.get('/', async (req: FastifyRequest, res: FastifyReply) => {
    res.status(200).send('Bem-vindo à sua aplicação FastAPI!');
  });

  instance.get('/rest', async (req: FastifyRequest<CustomRouteGenericQuery>, res: FastifyReply) => {
    try {
      const { resource } = req.query;
      if (!resource) {
        res.status(400).send({ error: 'Parameter "resource" is required.' });
      }

      const apiUrl = `https://web.bdij.com.br/w/rest.php/v1/page/${resource}`;
      const { data } = await axios.get(apiUrl);

      res.send(data);
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });

  instance.get('/api', async (req: FastifyRequest<CustomRouteGenericQuery>, res: FastifyReply) => {
    try {
      const { resource } = req.query;
      if (!resource) {
        res.status(400).send({ error: 'Parameter "resource" is required.' });
      }

      const apiUrl = `https://web.bdij.com.br/w/api.php/${resource}`;
      const { data } = await axios.get(apiUrl);

      res.send(data);
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });

  done();
}
