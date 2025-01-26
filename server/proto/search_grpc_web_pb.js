/**
 * @fileoverview gRPC-Web generated client stub for search
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.5.0
// 	protoc              v5.29.3
// source: search.proto


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.search = require('./search_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.search.SearchServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname.replace(/\/+$/, '');

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.search.SearchServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname.replace(/\/+$/, '');

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.search.SearchRequest,
 *   !proto.search.SearchResponse>}
 */
const methodDescriptor_SearchService_GetSearchSuggestions = new grpc.web.MethodDescriptor(
  '/search.SearchService/GetSearchSuggestions',
  grpc.web.MethodType.UNARY,
  proto.search.SearchRequest,
  proto.search.SearchResponse,
  /**
   * @param {!proto.search.SearchRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.search.SearchResponse.deserializeBinary
);


/**
 * @param {!proto.search.SearchRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.search.SearchResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.search.SearchResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.search.SearchServiceClient.prototype.getSearchSuggestions =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/search.SearchService/GetSearchSuggestions',
      request,
      metadata || {},
      methodDescriptor_SearchService_GetSearchSuggestions,
      callback);
};


/**
 * @param {!proto.search.SearchRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.search.SearchResponse>}
 *     Promise that resolves to the response
 */
proto.search.SearchServicePromiseClient.prototype.getSearchSuggestions =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/search.SearchService/GetSearchSuggestions',
      request,
      metadata || {},
      methodDescriptor_SearchService_GetSearchSuggestions);
};


module.exports = proto.search;

