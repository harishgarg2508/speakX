import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../../../server/proto/quiz.proto');

class GrpcClient {
  constructor() {
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });

    const proto = grpc.loadPackageDefinition(packageDefinition).quiz;
    this.client = new proto.QuizService(
      'localhost:50051',
      grpc.credentials.createInsecure()
    );
  }

  getQuestions(limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      this.client.getQuestions({ limit, offset }, (err, response) => {
        if (err) reject(err);
        else resolve(response.questions);
      });
    });
  }

  getQuestionsByType(type) {
    return new Promise((resolve, reject) => {
      this.client.getQuestionsByType({ type }, (err, response) => {
        if (err) reject(err);
        else resolve(response.questions);
      });
    });
  }
}

export default new GrpcClient();