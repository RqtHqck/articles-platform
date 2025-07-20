import {Client} from "@elastic/elasticsearch"

const esClient = new Client({
    node: process.env.ELASTIC_URL
});

export default esClient;