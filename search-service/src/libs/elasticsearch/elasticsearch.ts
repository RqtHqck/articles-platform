import {Client} from "@elastic/elasticsearch"
import config from "config";

const esClient = new Client({
    node: config.get<string>('ELASTICSEARCH.URL'),
});

export default esClient;