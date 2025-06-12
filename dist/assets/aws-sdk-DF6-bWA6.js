var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { H as HttpRequest, b as HttpResponse, n as normalizeProvider, S as SignatureV4, m as memoizeIdentityProvider, d as doesIdentityRequireRefresh, i as isIdentityExpired, e as collectBody$1, f as fxpExports, g as getValueFromTextNode, h as isArrayBuffer, A as AwsCrc32, j as AwsCrc32c, k as toUint8Array, l as createBufferedReadable, o as createChecksumStream, p as normalizeProvider$1, N as NoOpLogger, q as parseRfc7231DateTime, r as httpSigningMiddlewareOptions, s as getSmithyContext, u as splitStream, v as headStream, w as isValidHostLabel, x as isIpAddress, y as customEndpointFunctions, E as EndpointCache, z as resolveEndpoint, B as resolveParams, C as ServiceException, D as SENSITIVE_STRING, F as map, G as isSerializableHeaderValue, I as requestBuilder, J as expectNonNull, K as expectObject, L as getArrayIfSingleItem, M as expectString, O as parseBoolean, P as strictParseInt32, Q as withBaseException, R as decorateServiceException, T as parseRfc3339DateTimeWithOffset, U as strictParseLong, V as dateToUtcString, W as quoteHeader, X as serializeDateTime, Y as Command, Z as getSerdePlugin, _ as getEndpointPlugin, $ as Bowser, a0 as toUtf8, a1 as fromUtf8, a2 as parseUrl, a3 as sdkStreamMixin, a4 as getAwsChunkedEncodingStream, a5 as toBase64, a6 as fromBase64, a7 as resolveDefaultsModeConfig, a8 as blobHasher, a9 as streamCollector, aa as Sha256, ab as Sha1, ac as DEFAULT_RETRY_MODE, ad as FetchHttpHandler, ae as invalidProvider, af as Md5, ag as DEFAULT_MAX_ATTEMPTS, ah as eventStreamSerdeProvider, ai as calculateBodyLength, aj as DEFAULT_USE_FIPS_ENDPOINT, ak as DEFAULT_USE_DUALSTACK_ENDPOINT, al as loadConfigsForDefaultMode, am as getDefaultExtensionConfiguration, an as getHttpHandlerExtensionConfiguration, ao as resolveDefaultRuntimeConfig, ap as resolveHttpHandlerRuntimeConfig, aq as Client, ar as resolveRetryConfig, as as resolveRegionConfig, at as resolveEndpointConfig, au as resolveEventStreamSerdeConfig, av as getRetryPlugin, aw as getContentLengthPlugin, ax as getHttpAuthSchemeEndpointRuleSetPlugin, ay as getHttpSigningPlugin, az as DefaultIdentityProviderConfig, aA as buildQueryString, aB as getEndpointFromInstructions } from "./vendor-ChWeSoXy.js";
function addExpectContinueMiddleware(options) {
  return (next) => async (args) => {
    var _a, _b;
    const { request } = args;
    if (HttpRequest.isInstance(request) && request.body && options.runtime === "node") {
      if (((_b = (_a = options.requestHandler) == null ? void 0 : _a.constructor) == null ? void 0 : _b.name) !== "FetchHttpHandler") {
        request.headers = {
          ...request.headers,
          Expect: "100-continue"
        };
      }
    }
    return next({
      ...args,
      request
    });
  };
}
const addExpectContinueMiddlewareOptions = {
  step: "build",
  tags: ["SET_EXPECT_HEADER", "EXPECT_HEADER"],
  name: "addExpectContinueMiddleware",
  override: true
};
const getAddExpectContinuePlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(addExpectContinueMiddleware(options), addExpectContinueMiddlewareOptions);
  }
});
const RequestChecksumCalculation = {
  WHEN_SUPPORTED: "WHEN_SUPPORTED",
  WHEN_REQUIRED: "WHEN_REQUIRED"
};
const DEFAULT_REQUEST_CHECKSUM_CALCULATION = RequestChecksumCalculation.WHEN_SUPPORTED;
const ResponseChecksumValidation = {
  WHEN_SUPPORTED: "WHEN_SUPPORTED",
  WHEN_REQUIRED: "WHEN_REQUIRED"
};
const DEFAULT_RESPONSE_CHECKSUM_VALIDATION = RequestChecksumCalculation.WHEN_SUPPORTED;
var ChecksumAlgorithm;
(function(ChecksumAlgorithm2) {
  ChecksumAlgorithm2["MD5"] = "MD5";
  ChecksumAlgorithm2["CRC32"] = "CRC32";
  ChecksumAlgorithm2["CRC32C"] = "CRC32C";
  ChecksumAlgorithm2["CRC64NVME"] = "CRC64NVME";
  ChecksumAlgorithm2["SHA1"] = "SHA1";
  ChecksumAlgorithm2["SHA256"] = "SHA256";
})(ChecksumAlgorithm || (ChecksumAlgorithm = {}));
var ChecksumLocation;
(function(ChecksumLocation2) {
  ChecksumLocation2["HEADER"] = "header";
  ChecksumLocation2["TRAILER"] = "trailer";
})(ChecksumLocation || (ChecksumLocation = {}));
const DEFAULT_CHECKSUM_ALGORITHM = ChecksumAlgorithm.CRC32;
var SelectorType;
(function(SelectorType2) {
  SelectorType2["ENV"] = "env";
  SelectorType2["CONFIG"] = "shared config entry";
})(SelectorType || (SelectorType = {}));
function setCredentialFeature(credentials, feature, value) {
  if (!credentials.$source) {
    credentials.$source = {};
  }
  credentials.$source[feature] = value;
  return credentials;
}
function setFeature(context, feature, value) {
  if (!context.__aws_sdk_context) {
    context.__aws_sdk_context = {
      features: {}
    };
  } else if (!context.__aws_sdk_context.features) {
    context.__aws_sdk_context.features = {};
  }
  context.__aws_sdk_context.features[feature] = value;
}
const getDateHeader = (response) => {
  var _a, _b;
  return HttpResponse.isInstance(response) ? ((_a = response.headers) == null ? void 0 : _a.date) ?? ((_b = response.headers) == null ? void 0 : _b.Date) : void 0;
};
const getSkewCorrectedDate = (systemClockOffset) => new Date(Date.now() + systemClockOffset);
const isClockSkewed = (clockTime, systemClockOffset) => Math.abs(getSkewCorrectedDate(systemClockOffset).getTime() - clockTime) >= 3e5;
const getUpdatedSystemClockOffset = (clockTime, currentSystemClockOffset) => {
  const clockTimeInMs = Date.parse(clockTime);
  if (isClockSkewed(clockTimeInMs, currentSystemClockOffset)) {
    return clockTimeInMs - Date.now();
  }
  return currentSystemClockOffset;
};
const throwSigningPropertyError = (name, property) => {
  if (!property) {
    throw new Error(`Property \`${name}\` is not resolved for AWS SDK SigV4Auth`);
  }
  return property;
};
const validateSigningProperties = async (signingProperties) => {
  var _a, _b, _c;
  const context = throwSigningPropertyError("context", signingProperties.context);
  const config = throwSigningPropertyError("config", signingProperties.config);
  const authScheme = (_c = (_b = (_a = context.endpointV2) == null ? void 0 : _a.properties) == null ? void 0 : _b.authSchemes) == null ? void 0 : _c[0];
  const signerFunction = throwSigningPropertyError("signer", config.signer);
  const signer = await signerFunction(authScheme);
  const signingRegion = signingProperties == null ? void 0 : signingProperties.signingRegion;
  const signingRegionSet = signingProperties == null ? void 0 : signingProperties.signingRegionSet;
  const signingName = signingProperties == null ? void 0 : signingProperties.signingName;
  return {
    config,
    signer,
    signingRegion,
    signingRegionSet,
    signingName
  };
};
class AwsSdkSigV4Signer {
  async sign(httpRequest, identity, signingProperties) {
    var _a;
    if (!HttpRequest.isInstance(httpRequest)) {
      throw new Error("The request is not an instance of `HttpRequest` and cannot be signed");
    }
    const validatedProps = await validateSigningProperties(signingProperties);
    const { config, signer } = validatedProps;
    let { signingRegion, signingName } = validatedProps;
    const handlerExecutionContext = signingProperties.context;
    if (((_a = handlerExecutionContext == null ? void 0 : handlerExecutionContext.authSchemes) == null ? void 0 : _a.length) ?? 0 > 1) {
      const [first, second] = handlerExecutionContext.authSchemes;
      if ((first == null ? void 0 : first.name) === "sigv4a" && (second == null ? void 0 : second.name) === "sigv4") {
        signingRegion = (second == null ? void 0 : second.signingRegion) ?? signingRegion;
        signingName = (second == null ? void 0 : second.signingName) ?? signingName;
      }
    }
    const signedRequest = await signer.sign(httpRequest, {
      signingDate: getSkewCorrectedDate(config.systemClockOffset),
      signingRegion,
      signingService: signingName
    });
    return signedRequest;
  }
  errorHandler(signingProperties) {
    return (error) => {
      const serverTime = error.ServerTime ?? getDateHeader(error.$response);
      if (serverTime) {
        const config = throwSigningPropertyError("config", signingProperties.config);
        const initialSystemClockOffset = config.systemClockOffset;
        config.systemClockOffset = getUpdatedSystemClockOffset(serverTime, config.systemClockOffset);
        const clockSkewCorrected = config.systemClockOffset !== initialSystemClockOffset;
        if (clockSkewCorrected && error.$metadata) {
          error.$metadata.clockSkewCorrected = true;
        }
      }
      throw error;
    };
  }
  successHandler(httpResponse, signingProperties) {
    const dateHeader = getDateHeader(httpResponse);
    if (dateHeader) {
      const config = throwSigningPropertyError("config", signingProperties.config);
      config.systemClockOffset = getUpdatedSystemClockOffset(dateHeader, config.systemClockOffset);
    }
  }
}
class AwsSdkSigV4ASigner extends AwsSdkSigV4Signer {
  async sign(httpRequest, identity, signingProperties) {
    var _a;
    if (!HttpRequest.isInstance(httpRequest)) {
      throw new Error("The request is not an instance of `HttpRequest` and cannot be signed");
    }
    const { config, signer, signingRegion, signingRegionSet, signingName } = await validateSigningProperties(signingProperties);
    const configResolvedSigningRegionSet = await ((_a = config.sigv4aSigningRegionSet) == null ? void 0 : _a.call(config));
    const multiRegionOverride = (configResolvedSigningRegionSet ?? signingRegionSet ?? [signingRegion]).join(",");
    const signedRequest = await signer.sign(httpRequest, {
      signingDate: getSkewCorrectedDate(config.systemClockOffset),
      signingRegion: multiRegionOverride,
      signingService: signingName
    });
    return signedRequest;
  }
}
const resolveAwsSdkSigV4AConfig = (config) => {
  config.sigv4aSigningRegionSet = normalizeProvider(config.sigv4aSigningRegionSet);
  return config;
};
const resolveAwsSdkSigV4Config = (config) => {
  let inputCredentials = config.credentials;
  let isUserSupplied = !!config.credentials;
  let resolvedCredentials = void 0;
  Object.defineProperty(config, "credentials", {
    set(credentials) {
      if (credentials && credentials !== inputCredentials && credentials !== resolvedCredentials) {
        isUserSupplied = true;
      }
      inputCredentials = credentials;
      const memoizedProvider = normalizeCredentialProvider(config, {
        credentials: inputCredentials,
        credentialDefaultProvider: config.credentialDefaultProvider
      });
      const boundProvider = bindCallerConfig(config, memoizedProvider);
      if (isUserSupplied && !boundProvider.attributed) {
        resolvedCredentials = async (options) => boundProvider(options).then((creds) => setCredentialFeature(creds, "CREDENTIALS_CODE", "e"));
        resolvedCredentials.memoized = boundProvider.memoized;
        resolvedCredentials.configBound = boundProvider.configBound;
        resolvedCredentials.attributed = true;
      } else {
        resolvedCredentials = boundProvider;
      }
    },
    get() {
      return resolvedCredentials;
    },
    enumerable: true,
    configurable: true
  });
  config.credentials = inputCredentials;
  const { signingEscapePath = true, systemClockOffset = config.systemClockOffset || 0, sha256 } = config;
  let signer;
  if (config.signer) {
    signer = normalizeProvider(config.signer);
  } else if (config.regionInfoProvider) {
    signer = () => normalizeProvider(config.region)().then(async (region) => [
      await config.regionInfoProvider(region, {
        useFipsEndpoint: await config.useFipsEndpoint(),
        useDualstackEndpoint: await config.useDualstackEndpoint()
      }) || {},
      region
    ]).then(([regionInfo, region]) => {
      const { signingRegion, signingService } = regionInfo;
      config.signingRegion = config.signingRegion || signingRegion || region;
      config.signingName = config.signingName || signingService || config.serviceId;
      const params = {
        ...config,
        credentials: config.credentials,
        region: config.signingRegion,
        service: config.signingName,
        sha256,
        uriEscapePath: signingEscapePath
      };
      const SignerCtor = config.signerConstructor || SignatureV4;
      return new SignerCtor(params);
    });
  } else {
    signer = async (authScheme) => {
      authScheme = Object.assign({}, {
        name: "sigv4",
        signingName: config.signingName || config.defaultSigningName,
        signingRegion: await normalizeProvider(config.region)(),
        properties: {}
      }, authScheme);
      const signingRegion = authScheme.signingRegion;
      const signingService = authScheme.signingName;
      config.signingRegion = config.signingRegion || signingRegion;
      config.signingName = config.signingName || signingService || config.serviceId;
      const params = {
        ...config,
        credentials: config.credentials,
        region: config.signingRegion,
        service: config.signingName,
        sha256,
        uriEscapePath: signingEscapePath
      };
      const SignerCtor = config.signerConstructor || SignatureV4;
      return new SignerCtor(params);
    };
  }
  const resolvedConfig = Object.assign(config, {
    systemClockOffset,
    signingEscapePath,
    signer
  });
  return resolvedConfig;
};
function normalizeCredentialProvider(config, { credentials, credentialDefaultProvider }) {
  let credentialsProvider;
  if (credentials) {
    if (!(credentials == null ? void 0 : credentials.memoized)) {
      credentialsProvider = memoizeIdentityProvider(credentials, isIdentityExpired, doesIdentityRequireRefresh);
    } else {
      credentialsProvider = credentials;
    }
  } else {
    if (credentialDefaultProvider) {
      credentialsProvider = normalizeProvider(credentialDefaultProvider(Object.assign({}, config, {
        parentClientConfig: config
      })));
    } else {
      credentialsProvider = async () => {
        throw new Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.");
      };
    }
  }
  credentialsProvider.memoized = true;
  return credentialsProvider;
}
function bindCallerConfig(config, credentialsProvider) {
  if (credentialsProvider.configBound) {
    return credentialsProvider;
  }
  const fn = async (options) => credentialsProvider({ ...options, callerClientConfig: config });
  fn.memoized = credentialsProvider.memoized;
  fn.configBound = true;
  return fn;
}
const collectBodyString = (streamBody, context) => collectBody$1(streamBody, context).then((body) => context.utf8Encoder(body));
const parseXmlBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
  if (encoded.length) {
    const parser = new fxpExports.XMLParser({
      attributeNamePrefix: "",
      htmlEntities: true,
      ignoreAttributes: false,
      ignoreDeclaration: true,
      parseTagValue: false,
      trimValues: false,
      tagValueProcessor: (_, val) => val.trim() === "" && val.includes("\n") ? "" : void 0
    });
    parser.addEntity("#xD", "\r");
    parser.addEntity("#10", "\n");
    let parsedObj;
    try {
      parsedObj = parser.parse(encoded, true);
    } catch (e2) {
      if (e2 && typeof e2 === "object") {
        Object.defineProperty(e2, "$responseBodyText", {
          value: encoded
        });
      }
      throw e2;
    }
    const textNodeName = "#text";
    const key = Object.keys(parsedObj)[0];
    const parsedObjToReturn = parsedObj[key];
    if (parsedObjToReturn[textNodeName]) {
      parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
      delete parsedObjToReturn[textNodeName];
    }
    return getValueFromTextNode(parsedObjToReturn);
  }
  return {};
});
const parseXmlErrorBody = async (errorBody, context) => {
  const value = await parseXmlBody(errorBody, context);
  if (value.Error) {
    value.Error.message = value.Error.message ?? value.Error.Message;
  }
  return value;
};
const loadRestXmlErrorCode = (output, data) => {
  var _a;
  if (((_a = data == null ? void 0 : data.Error) == null ? void 0 : _a.Code) !== void 0) {
    return data.Error.Code;
  }
  if ((data == null ? void 0 : data.Code) !== void 0) {
    return data.Code;
  }
  if (output.statusCode == 404) {
    return "NotFound";
  }
};
const CLIENT_SUPPORTED_ALGORITHMS = [
  ChecksumAlgorithm.CRC32,
  ChecksumAlgorithm.CRC32C,
  ChecksumAlgorithm.CRC64NVME,
  ChecksumAlgorithm.SHA1,
  ChecksumAlgorithm.SHA256
];
const PRIORITY_ORDER_ALGORITHMS = [
  ChecksumAlgorithm.SHA256,
  ChecksumAlgorithm.SHA1,
  ChecksumAlgorithm.CRC32,
  ChecksumAlgorithm.CRC32C,
  ChecksumAlgorithm.CRC64NVME
];
const getChecksumAlgorithmForRequest = (input, { requestChecksumRequired, requestAlgorithmMember, requestChecksumCalculation }) => {
  if (!requestAlgorithmMember) {
    return requestChecksumCalculation === RequestChecksumCalculation.WHEN_SUPPORTED || requestChecksumRequired ? DEFAULT_CHECKSUM_ALGORITHM : void 0;
  }
  if (!input[requestAlgorithmMember]) {
    return void 0;
  }
  const checksumAlgorithm = input[requestAlgorithmMember];
  if (!CLIENT_SUPPORTED_ALGORITHMS.includes(checksumAlgorithm)) {
    throw new Error(`The checksum algorithm "${checksumAlgorithm}" is not supported by the client. Select one of ${CLIENT_SUPPORTED_ALGORITHMS}.`);
  }
  return checksumAlgorithm;
};
const getChecksumLocationName = (algorithm) => algorithm === ChecksumAlgorithm.MD5 ? "content-md5" : `x-amz-checksum-${algorithm.toLowerCase()}`;
const hasHeader = (header, headers) => {
  const soughtHeader = header.toLowerCase();
  for (const headerName of Object.keys(headers)) {
    if (soughtHeader === headerName.toLowerCase()) {
      return true;
    }
  }
  return false;
};
const hasHeaderWithPrefix = (headerPrefix, headers) => {
  const soughtHeaderPrefix = headerPrefix.toLowerCase();
  for (const headerName of Object.keys(headers)) {
    if (headerName.toLowerCase().startsWith(soughtHeaderPrefix)) {
      return true;
    }
  }
  return false;
};
const isStreaming = (body) => body !== void 0 && typeof body !== "string" && !ArrayBuffer.isView(body) && !isArrayBuffer(body);
const getCrc32ChecksumAlgorithmFunction = () => AwsCrc32;
const selectChecksumAlgorithmFunction = (checksumAlgorithm, config) => {
  switch (checksumAlgorithm) {
    case ChecksumAlgorithm.MD5:
      return config.md5;
    case ChecksumAlgorithm.CRC32:
      return getCrc32ChecksumAlgorithmFunction();
    case ChecksumAlgorithm.CRC32C:
      return AwsCrc32c;
    case ChecksumAlgorithm.CRC64NVME: {
      throw new Error(`Please check whether you have installed the "@aws-sdk/crc64-nvme-crt" package explicitly. 
You must also register the package by calling [require("@aws-sdk/crc64-nvme-crt");] or an ESM equivalent such as [import "@aws-sdk/crc64-nvme-crt";]. 
For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt`);
    }
    case ChecksumAlgorithm.SHA1:
      return config.sha1;
    case ChecksumAlgorithm.SHA256:
      return config.sha256;
    default:
      throw new Error(`Unsupported checksum algorithm: ${checksumAlgorithm}`);
  }
};
const stringHasher = (checksumAlgorithmFn, body) => {
  const hash = new checksumAlgorithmFn();
  hash.update(toUint8Array(body || ""));
  return hash.digest();
};
const flexibleChecksumsMiddlewareOptions = {
  name: "flexibleChecksumsMiddleware",
  step: "build",
  tags: ["BODY_CHECKSUM"],
  override: true
};
const flexibleChecksumsMiddleware = (config, middlewareConfig) => (next, context) => async (args) => {
  if (!HttpRequest.isInstance(args.request)) {
    return next(args);
  }
  if (hasHeaderWithPrefix("x-amz-checksum-", args.request.headers)) {
    return next(args);
  }
  const { request, input } = args;
  const { body: requestBody, headers } = request;
  const { base64Encoder, streamHasher } = config;
  const { requestChecksumRequired, requestAlgorithmMember } = middlewareConfig;
  const requestChecksumCalculation = await config.requestChecksumCalculation();
  const requestAlgorithmMemberName = requestAlgorithmMember == null ? void 0 : requestAlgorithmMember.name;
  const requestAlgorithmMemberHttpHeader = requestAlgorithmMember == null ? void 0 : requestAlgorithmMember.httpHeader;
  if (requestAlgorithmMemberName && !input[requestAlgorithmMemberName]) {
    if (requestChecksumCalculation === RequestChecksumCalculation.WHEN_SUPPORTED || requestChecksumRequired) {
      input[requestAlgorithmMemberName] = DEFAULT_CHECKSUM_ALGORITHM;
      if (requestAlgorithmMemberHttpHeader) {
        headers[requestAlgorithmMemberHttpHeader] = DEFAULT_CHECKSUM_ALGORITHM;
      }
    }
  }
  const checksumAlgorithm = getChecksumAlgorithmForRequest(input, {
    requestChecksumRequired,
    requestAlgorithmMember: requestAlgorithmMember == null ? void 0 : requestAlgorithmMember.name,
    requestChecksumCalculation
  });
  let updatedBody = requestBody;
  let updatedHeaders = headers;
  if (checksumAlgorithm) {
    switch (checksumAlgorithm) {
      case ChecksumAlgorithm.CRC32:
        setFeature(context, "FLEXIBLE_CHECKSUMS_REQ_CRC32", "U");
        break;
      case ChecksumAlgorithm.CRC32C:
        setFeature(context, "FLEXIBLE_CHECKSUMS_REQ_CRC32C", "V");
        break;
      case ChecksumAlgorithm.CRC64NVME:
        setFeature(context, "FLEXIBLE_CHECKSUMS_REQ_CRC64", "W");
        break;
      case ChecksumAlgorithm.SHA1:
        setFeature(context, "FLEXIBLE_CHECKSUMS_REQ_SHA1", "X");
        break;
      case ChecksumAlgorithm.SHA256:
        setFeature(context, "FLEXIBLE_CHECKSUMS_REQ_SHA256", "Y");
        break;
    }
    const checksumLocationName = getChecksumLocationName(checksumAlgorithm);
    const checksumAlgorithmFn = selectChecksumAlgorithmFunction(checksumAlgorithm, config);
    if (isStreaming(requestBody)) {
      const { getAwsChunkedEncodingStream: getAwsChunkedEncodingStream2, bodyLengthChecker } = config;
      updatedBody = getAwsChunkedEncodingStream2(typeof config.requestStreamBufferSize === "number" && config.requestStreamBufferSize >= 8 * 1024 ? createBufferedReadable(requestBody, config.requestStreamBufferSize, context.logger) : requestBody, {
        base64Encoder,
        bodyLengthChecker,
        checksumLocationName,
        checksumAlgorithmFn,
        streamHasher
      });
      updatedHeaders = {
        ...headers,
        "content-encoding": headers["content-encoding"] ? `${headers["content-encoding"]},aws-chunked` : "aws-chunked",
        "transfer-encoding": "chunked",
        "x-amz-decoded-content-length": headers["content-length"],
        "x-amz-content-sha256": "STREAMING-UNSIGNED-PAYLOAD-TRAILER",
        "x-amz-trailer": checksumLocationName
      };
      delete updatedHeaders["content-length"];
    } else if (!hasHeader(checksumLocationName, headers)) {
      const rawChecksum = await stringHasher(checksumAlgorithmFn, requestBody);
      updatedHeaders = {
        ...headers,
        [checksumLocationName]: base64Encoder(rawChecksum)
      };
    }
  }
  const result = await next({
    ...args,
    request: {
      ...request,
      headers: updatedHeaders,
      body: updatedBody
    }
  });
  return result;
};
const flexibleChecksumsInputMiddlewareOptions = {
  name: "flexibleChecksumsInputMiddleware",
  toMiddleware: "serializerMiddleware",
  relation: "before",
  tags: ["BODY_CHECKSUM"],
  override: true
};
const flexibleChecksumsInputMiddleware = (config, middlewareConfig) => (next, context) => async (args) => {
  const input = args.input;
  const { requestValidationModeMember } = middlewareConfig;
  const requestChecksumCalculation = await config.requestChecksumCalculation();
  const responseChecksumValidation = await config.responseChecksumValidation();
  switch (requestChecksumCalculation) {
    case RequestChecksumCalculation.WHEN_REQUIRED:
      setFeature(context, "FLEXIBLE_CHECKSUMS_REQ_WHEN_REQUIRED", "a");
      break;
    case RequestChecksumCalculation.WHEN_SUPPORTED:
      setFeature(context, "FLEXIBLE_CHECKSUMS_REQ_WHEN_SUPPORTED", "Z");
      break;
  }
  switch (responseChecksumValidation) {
    case ResponseChecksumValidation.WHEN_REQUIRED:
      setFeature(context, "FLEXIBLE_CHECKSUMS_RES_WHEN_REQUIRED", "c");
      break;
    case ResponseChecksumValidation.WHEN_SUPPORTED:
      setFeature(context, "FLEXIBLE_CHECKSUMS_RES_WHEN_SUPPORTED", "b");
      break;
  }
  if (requestValidationModeMember && !input[requestValidationModeMember]) {
    if (responseChecksumValidation === ResponseChecksumValidation.WHEN_SUPPORTED) {
      input[requestValidationModeMember] = "ENABLED";
    }
  }
  return next(args);
};
const getChecksumAlgorithmListForResponse = (responseAlgorithms = []) => {
  const validChecksumAlgorithms = [];
  for (const algorithm of PRIORITY_ORDER_ALGORITHMS) {
    if (!responseAlgorithms.includes(algorithm) || !CLIENT_SUPPORTED_ALGORITHMS.includes(algorithm)) {
      continue;
    }
    validChecksumAlgorithms.push(algorithm);
  }
  return validChecksumAlgorithms;
};
const isChecksumWithPartNumber = (checksum) => {
  const lastHyphenIndex = checksum.lastIndexOf("-");
  if (lastHyphenIndex !== -1) {
    const numberPart = checksum.slice(lastHyphenIndex + 1);
    if (!numberPart.startsWith("0")) {
      const number = parseInt(numberPart, 10);
      if (!isNaN(number) && number >= 1 && number <= 1e4) {
        return true;
      }
    }
  }
  return false;
};
const getChecksum = async (body, { checksumAlgorithmFn, base64Encoder }) => base64Encoder(await stringHasher(checksumAlgorithmFn, body));
const validateChecksumFromResponse = async (response, { config, responseAlgorithms, logger }) => {
  const checksumAlgorithms = getChecksumAlgorithmListForResponse(responseAlgorithms);
  const { body: responseBody, headers: responseHeaders } = response;
  for (const algorithm of checksumAlgorithms) {
    const responseHeader = getChecksumLocationName(algorithm);
    const checksumFromResponse = responseHeaders[responseHeader];
    if (checksumFromResponse) {
      let checksumAlgorithmFn;
      try {
        checksumAlgorithmFn = selectChecksumAlgorithmFunction(algorithm, config);
      } catch (error) {
        if (algorithm === ChecksumAlgorithm.CRC64NVME) {
          logger == null ? void 0 : logger.warn(`Skipping ${ChecksumAlgorithm.CRC64NVME} checksum validation: ${error.message}`);
          continue;
        }
        throw error;
      }
      const { base64Encoder } = config;
      if (isStreaming(responseBody)) {
        response.body = createChecksumStream({
          expectedChecksum: checksumFromResponse,
          checksumSourceLocation: responseHeader,
          checksum: new checksumAlgorithmFn(),
          source: responseBody,
          base64Encoder
        });
        return;
      }
      const checksum = await getChecksum(responseBody, { checksumAlgorithmFn, base64Encoder });
      if (checksum === checksumFromResponse) {
        break;
      }
      throw new Error(`Checksum mismatch: expected "${checksum}" but received "${checksumFromResponse}" in response header "${responseHeader}".`);
    }
  }
};
const flexibleChecksumsResponseMiddlewareOptions = {
  name: "flexibleChecksumsResponseMiddleware",
  toMiddleware: "deserializerMiddleware",
  relation: "after",
  tags: ["BODY_CHECKSUM"],
  override: true
};
const flexibleChecksumsResponseMiddleware = (config, middlewareConfig) => (next, context) => async (args) => {
  if (!HttpRequest.isInstance(args.request)) {
    return next(args);
  }
  const input = args.input;
  const result = await next(args);
  const response = result.response;
  const { requestValidationModeMember, responseAlgorithms } = middlewareConfig;
  if (requestValidationModeMember && input[requestValidationModeMember] === "ENABLED") {
    const { clientName, commandName } = context;
    const isS3WholeObjectMultipartGetResponseChecksum = clientName === "S3Client" && commandName === "GetObjectCommand" && getChecksumAlgorithmListForResponse(responseAlgorithms).every((algorithm) => {
      const responseHeader = getChecksumLocationName(algorithm);
      const checksumFromResponse = response.headers[responseHeader];
      return !checksumFromResponse || isChecksumWithPartNumber(checksumFromResponse);
    });
    if (isS3WholeObjectMultipartGetResponseChecksum) {
      return result;
    }
    await validateChecksumFromResponse(response, {
      config,
      responseAlgorithms,
      logger: context.logger
    });
  }
  return result;
};
const getFlexibleChecksumsPlugin = (config, middlewareConfig) => ({
  applyToStack: (clientStack) => {
    clientStack.add(flexibleChecksumsMiddleware(config, middlewareConfig), flexibleChecksumsMiddlewareOptions);
    clientStack.addRelativeTo(flexibleChecksumsInputMiddleware(config, middlewareConfig), flexibleChecksumsInputMiddlewareOptions);
    clientStack.addRelativeTo(flexibleChecksumsResponseMiddleware(config, middlewareConfig), flexibleChecksumsResponseMiddlewareOptions);
  }
});
const resolveFlexibleChecksumsConfig = (input) => {
  const { requestChecksumCalculation, responseChecksumValidation, requestStreamBufferSize } = input;
  return Object.assign(input, {
    requestChecksumCalculation: normalizeProvider$1(requestChecksumCalculation ?? DEFAULT_REQUEST_CHECKSUM_CALCULATION),
    responseChecksumValidation: normalizeProvider$1(responseChecksumValidation ?? DEFAULT_RESPONSE_CHECKSUM_VALIDATION),
    requestStreamBufferSize: Number(requestStreamBufferSize ?? 0)
  });
};
function resolveHostHeaderConfig(input) {
  return input;
}
const hostHeaderMiddleware = (options) => (next) => async (args) => {
  if (!HttpRequest.isInstance(args.request))
    return next(args);
  const { request } = args;
  const { handlerProtocol = "" } = options.requestHandler.metadata || {};
  if (handlerProtocol.indexOf("h2") >= 0 && !request.headers[":authority"]) {
    delete request.headers["host"];
    request.headers[":authority"] = request.hostname + (request.port ? ":" + request.port : "");
  } else if (!request.headers["host"]) {
    let host = request.hostname;
    if (request.port != null)
      host += `:${request.port}`;
    request.headers["host"] = host;
  }
  return next(args);
};
const hostHeaderMiddlewareOptions = {
  name: "hostHeaderMiddleware",
  step: "build",
  priority: "low",
  tags: ["HOST"],
  override: true
};
const getHostHeaderPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(hostHeaderMiddleware(options), hostHeaderMiddlewareOptions);
  }
});
const loggerMiddleware = () => (next, context) => async (args) => {
  var _a, _b;
  try {
    const response = await next(args);
    const { clientName, commandName, logger, dynamoDbDocumentClientOptions = {} } = context;
    const { overrideInputFilterSensitiveLog, overrideOutputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
    const outputFilterSensitiveLog = overrideOutputFilterSensitiveLog ?? context.outputFilterSensitiveLog;
    const { $metadata, ...outputWithoutMetadata } = response.output;
    (_a = logger == null ? void 0 : logger.info) == null ? void 0 : _a.call(logger, {
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      output: outputFilterSensitiveLog(outputWithoutMetadata),
      metadata: $metadata
    });
    return response;
  } catch (error) {
    const { clientName, commandName, logger, dynamoDbDocumentClientOptions = {} } = context;
    const { overrideInputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
    (_b = logger == null ? void 0 : logger.error) == null ? void 0 : _b.call(logger, {
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      error,
      metadata: error.$metadata
    });
    throw error;
  }
};
const loggerMiddlewareOptions = {
  name: "loggerMiddleware",
  tags: ["LOGGER"],
  step: "initialize",
  override: true
};
const getLoggerPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(loggerMiddleware(), loggerMiddlewareOptions);
  }
});
var define_process_env_default = {};
const TRACE_ID_HEADER_NAME = "X-Amzn-Trace-Id";
const ENV_LAMBDA_FUNCTION_NAME = "AWS_LAMBDA_FUNCTION_NAME";
const ENV_TRACE_ID = "_X_AMZN_TRACE_ID";
const recursionDetectionMiddleware = (options) => (next) => async (args) => {
  const { request } = args;
  if (!HttpRequest.isInstance(request) || options.runtime !== "node") {
    return next(args);
  }
  const traceIdHeader = Object.keys(request.headers ?? {}).find((h2) => h2.toLowerCase() === TRACE_ID_HEADER_NAME.toLowerCase()) ?? TRACE_ID_HEADER_NAME;
  if (request.headers.hasOwnProperty(traceIdHeader)) {
    return next(args);
  }
  const functionName = define_process_env_default[ENV_LAMBDA_FUNCTION_NAME];
  const traceId = define_process_env_default[ENV_TRACE_ID];
  const nonEmptyString = (str) => typeof str === "string" && str.length > 0;
  if (nonEmptyString(functionName) && nonEmptyString(traceId)) {
    request.headers[TRACE_ID_HEADER_NAME] = traceId;
  }
  return next({
    ...args,
    request
  });
};
const addRecursionDetectionMiddlewareOptions = {
  step: "build",
  tags: ["RECURSION_DETECTION"],
  name: "recursionDetectionMiddleware",
  override: true,
  priority: "low"
};
const getRecursionDetectionPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(recursionDetectionMiddleware(options), addRecursionDetectionMiddlewareOptions);
  }
});
const CONTENT_LENGTH_HEADER = "content-length";
const DECODED_CONTENT_LENGTH_HEADER = "x-amz-decoded-content-length";
function checkContentLengthHeader() {
  return (next, context) => async (args) => {
    var _a;
    const { request } = args;
    if (HttpRequest.isInstance(request)) {
      if (!(CONTENT_LENGTH_HEADER in request.headers) && !(DECODED_CONTENT_LENGTH_HEADER in request.headers)) {
        const message = `Are you using a Stream of unknown length as the Body of a PutObject request? Consider using Upload instead from @aws-sdk/lib-storage.`;
        if (typeof ((_a = context == null ? void 0 : context.logger) == null ? void 0 : _a.warn) === "function" && !(context.logger instanceof NoOpLogger)) {
          context.logger.warn(message);
        } else {
          console.warn(message);
        }
      }
    }
    return next({ ...args });
  };
}
const checkContentLengthHeaderMiddlewareOptions = {
  step: "finalizeRequest",
  tags: ["CHECK_CONTENT_LENGTH_HEADER"],
  name: "getCheckContentLengthHeaderPlugin",
  override: true
};
const getCheckContentLengthHeaderPlugin = (unused) => ({
  applyToStack: (clientStack) => {
    clientStack.add(checkContentLengthHeader(), checkContentLengthHeaderMiddlewareOptions);
  }
});
const regionRedirectEndpointMiddleware = (config) => {
  return (next, context) => async (args) => {
    const originalRegion = await config.region();
    const regionProviderRef = config.region;
    let unlock = () => {
    };
    if (context.__s3RegionRedirect) {
      Object.defineProperty(config, "region", {
        writable: false,
        value: async () => {
          return context.__s3RegionRedirect;
        }
      });
      unlock = () => Object.defineProperty(config, "region", {
        writable: true,
        value: regionProviderRef
      });
    }
    try {
      const result = await next(args);
      if (context.__s3RegionRedirect) {
        unlock();
        const region = await config.region();
        if (originalRegion !== region) {
          throw new Error("Region was not restored following S3 region redirect.");
        }
      }
      return result;
    } catch (e2) {
      unlock();
      throw e2;
    }
  };
};
const regionRedirectEndpointMiddlewareOptions = {
  tags: ["REGION_REDIRECT", "S3"],
  name: "regionRedirectEndpointMiddleware",
  override: true,
  relation: "before",
  toMiddleware: "endpointV2Middleware"
};
function regionRedirectMiddleware(clientConfig) {
  return (next, context) => async (args) => {
    var _a, _b, _c;
    try {
      return await next(args);
    } catch (err) {
      if (clientConfig.followRegionRedirects) {
        if (((_a = err == null ? void 0 : err.$metadata) == null ? void 0 : _a.httpStatusCode) === 301 || ((_b = err == null ? void 0 : err.$metadata) == null ? void 0 : _b.httpStatusCode) === 400 && (err == null ? void 0 : err.name) === "IllegalLocationConstraintException") {
          try {
            const actualRegion = err.$response.headers["x-amz-bucket-region"];
            (_c = context.logger) == null ? void 0 : _c.debug(`Redirecting from ${await clientConfig.region()} to ${actualRegion}`);
            context.__s3RegionRedirect = actualRegion;
          } catch (e2) {
            throw new Error("Region redirect failed: " + e2);
          }
          return next(args);
        }
      }
      throw err;
    }
  };
}
const regionRedirectMiddlewareOptions = {
  step: "initialize",
  tags: ["REGION_REDIRECT", "S3"],
  name: "regionRedirectMiddleware",
  override: true
};
const getRegionRedirectMiddlewarePlugin = (clientConfig) => ({
  applyToStack: (clientStack) => {
    clientStack.add(regionRedirectMiddleware(clientConfig), regionRedirectMiddlewareOptions);
    clientStack.addRelativeTo(regionRedirectEndpointMiddleware(clientConfig), regionRedirectEndpointMiddlewareOptions);
  }
});
const s3ExpiresMiddleware = (config) => {
  return (next, context) => async (args) => {
    var _a;
    const result = await next(args);
    const { response } = result;
    if (HttpResponse.isInstance(response)) {
      if (response.headers.expires) {
        response.headers.expiresstring = response.headers.expires;
        try {
          parseRfc7231DateTime(response.headers.expires);
        } catch (e2) {
          (_a = context.logger) == null ? void 0 : _a.warn(`AWS SDK Warning for ${context.clientName}::${context.commandName} response parsing (${response.headers.expires}): ${e2}`);
          delete response.headers.expires;
        }
      }
    }
    return result;
  };
};
const s3ExpiresMiddlewareOptions = {
  tags: ["S3"],
  name: "s3ExpiresMiddleware",
  override: true,
  relation: "after",
  toMiddleware: "deserializerMiddleware"
};
const getS3ExpiresMiddlewarePlugin = (clientConfig) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(s3ExpiresMiddleware(), s3ExpiresMiddlewareOptions);
  }
});
const _S3ExpressIdentityCache = class _S3ExpressIdentityCache {
  constructor(data = {}) {
    __publicField(this, "data");
    __publicField(this, "lastPurgeTime", Date.now());
    this.data = data;
  }
  get(key) {
    const entry = this.data[key];
    if (!entry) {
      return;
    }
    return entry;
  }
  set(key, entry) {
    this.data[key] = entry;
    return entry;
  }
  delete(key) {
    delete this.data[key];
  }
  async purgeExpired() {
    const now = Date.now();
    if (this.lastPurgeTime + _S3ExpressIdentityCache.EXPIRED_CREDENTIAL_PURGE_INTERVAL_MS > now) {
      return;
    }
    for (const key in this.data) {
      const entry = this.data[key];
      if (!entry.isRefreshing) {
        const credential = await entry.identity;
        if (credential.expiration) {
          if (credential.expiration.getTime() < now) {
            delete this.data[key];
          }
        }
      }
    }
  }
};
__publicField(_S3ExpressIdentityCache, "EXPIRED_CREDENTIAL_PURGE_INTERVAL_MS", 3e4);
let S3ExpressIdentityCache = _S3ExpressIdentityCache;
class S3ExpressIdentityCacheEntry {
  constructor(_identity, isRefreshing = false, accessed = Date.now()) {
    __publicField(this, "_identity");
    __publicField(this, "isRefreshing");
    __publicField(this, "accessed");
    this._identity = _identity;
    this.isRefreshing = isRefreshing;
    this.accessed = accessed;
  }
  get identity() {
    this.accessed = Date.now();
    return this._identity;
  }
}
const _S3ExpressIdentityProviderImpl = class _S3ExpressIdentityProviderImpl {
  constructor(createSessionFn, cache2 = new S3ExpressIdentityCache()) {
    __publicField(this, "createSessionFn");
    __publicField(this, "cache");
    this.createSessionFn = createSessionFn;
    this.cache = cache2;
  }
  async getS3ExpressIdentity(awsIdentity, identityProperties) {
    const key = identityProperties.Bucket;
    const { cache: cache2 } = this;
    const entry = cache2.get(key);
    if (entry) {
      return entry.identity.then((identity) => {
        var _a, _b;
        const isExpired = (((_a = identity.expiration) == null ? void 0 : _a.getTime()) ?? 0) < Date.now();
        if (isExpired) {
          return cache2.set(key, new S3ExpressIdentityCacheEntry(this.getIdentity(key))).identity;
        }
        const isExpiringSoon = (((_b = identity.expiration) == null ? void 0 : _b.getTime()) ?? 0) < Date.now() + _S3ExpressIdentityProviderImpl.REFRESH_WINDOW_MS;
        if (isExpiringSoon && !entry.isRefreshing) {
          entry.isRefreshing = true;
          this.getIdentity(key).then((id) => {
            cache2.set(key, new S3ExpressIdentityCacheEntry(Promise.resolve(id)));
          });
        }
        return identity;
      });
    }
    return cache2.set(key, new S3ExpressIdentityCacheEntry(this.getIdentity(key))).identity;
  }
  async getIdentity(key) {
    var _a, _b;
    await this.cache.purgeExpired().catch((error) => {
      console.warn("Error while clearing expired entries in S3ExpressIdentityCache: \n" + error);
    });
    const session = await this.createSessionFn(key);
    if (!((_a = session.Credentials) == null ? void 0 : _a.AccessKeyId) || !((_b = session.Credentials) == null ? void 0 : _b.SecretAccessKey)) {
      throw new Error("s3#createSession response credential missing AccessKeyId or SecretAccessKey.");
    }
    const identity = {
      accessKeyId: session.Credentials.AccessKeyId,
      secretAccessKey: session.Credentials.SecretAccessKey,
      sessionToken: session.Credentials.SessionToken,
      expiration: session.Credentials.Expiration ? new Date(session.Credentials.Expiration) : void 0
    };
    return identity;
  }
};
__publicField(_S3ExpressIdentityProviderImpl, "REFRESH_WINDOW_MS", 6e4);
let S3ExpressIdentityProviderImpl = _S3ExpressIdentityProviderImpl;
const S3_EXPRESS_BUCKET_TYPE = "Directory";
const S3_EXPRESS_BACKEND = "S3Express";
const S3_EXPRESS_AUTH_SCHEME = "sigv4-s3express";
const SESSION_TOKEN_QUERY_PARAM = "X-Amz-S3session-Token";
const SESSION_TOKEN_HEADER = SESSION_TOKEN_QUERY_PARAM.toLowerCase();
class SignatureV4S3Express extends SignatureV4 {
  async signWithCredentials(requestToSign, credentials, options) {
    const credentialsWithoutSessionToken = getCredentialsWithoutSessionToken(credentials);
    requestToSign.headers[SESSION_TOKEN_HEADER] = credentials.sessionToken;
    const privateAccess = this;
    setSingleOverride(privateAccess, credentialsWithoutSessionToken);
    return privateAccess.signRequest(requestToSign, options ?? {});
  }
  async presignWithCredentials(requestToSign, credentials, options) {
    const credentialsWithoutSessionToken = getCredentialsWithoutSessionToken(credentials);
    delete requestToSign.headers[SESSION_TOKEN_HEADER];
    requestToSign.headers[SESSION_TOKEN_QUERY_PARAM] = credentials.sessionToken;
    requestToSign.query = requestToSign.query ?? {};
    requestToSign.query[SESSION_TOKEN_QUERY_PARAM] = credentials.sessionToken;
    const privateAccess = this;
    setSingleOverride(privateAccess, credentialsWithoutSessionToken);
    return this.presign(requestToSign, options);
  }
}
function getCredentialsWithoutSessionToken(credentials) {
  const credentialsWithoutSessionToken = {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    expiration: credentials.expiration
  };
  return credentialsWithoutSessionToken;
}
function setSingleOverride(privateAccess, credentialsWithoutSessionToken) {
  const id = setTimeout(() => {
    throw new Error("SignatureV4S3Express credential override was created but not called.");
  }, 10);
  const currentCredentialProvider = privateAccess.credentialProvider;
  const overrideCredentialsProviderOnce = () => {
    clearTimeout(id);
    privateAccess.credentialProvider = currentCredentialProvider;
    return Promise.resolve(credentialsWithoutSessionToken);
  };
  privateAccess.credentialProvider = overrideCredentialsProviderOnce;
}
const s3ExpressMiddleware = (options) => {
  return (next, context) => async (args) => {
    var _a, _b, _c, _d, _e2;
    if (context.endpointV2) {
      const endpoint = context.endpointV2;
      const isS3ExpressAuth = ((_c = (_b = (_a = endpoint.properties) == null ? void 0 : _a.authSchemes) == null ? void 0 : _b[0]) == null ? void 0 : _c.name) === S3_EXPRESS_AUTH_SCHEME;
      const isS3ExpressBucket = ((_d = endpoint.properties) == null ? void 0 : _d.backend) === S3_EXPRESS_BACKEND || ((_e2 = endpoint.properties) == null ? void 0 : _e2.bucketType) === S3_EXPRESS_BUCKET_TYPE;
      if (isS3ExpressBucket) {
        setFeature(context, "S3_EXPRESS_BUCKET", "J");
        context.isS3ExpressBucket = true;
      }
      if (isS3ExpressAuth) {
        const requestBucket = args.input.Bucket;
        if (requestBucket) {
          const s3ExpressIdentity = await options.s3ExpressIdentityProvider.getS3ExpressIdentity(await options.credentials(), {
            Bucket: requestBucket
          });
          context.s3ExpressIdentity = s3ExpressIdentity;
          if (HttpRequest.isInstance(args.request) && s3ExpressIdentity.sessionToken) {
            args.request.headers[SESSION_TOKEN_HEADER] = s3ExpressIdentity.sessionToken;
          }
        }
      }
    }
    return next(args);
  };
};
const s3ExpressMiddlewareOptions = {
  name: "s3ExpressMiddleware",
  step: "build",
  tags: ["S3", "S3_EXPRESS"],
  override: true
};
const getS3ExpressPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(s3ExpressMiddleware(options), s3ExpressMiddlewareOptions);
  }
});
const signS3Express = async (s3ExpressIdentity, signingOptions, request, sigV4MultiRegionSigner) => {
  const signedRequest = await sigV4MultiRegionSigner.signWithCredentials(request, s3ExpressIdentity, {});
  if (signedRequest.headers["X-Amz-Security-Token"] || signedRequest.headers["x-amz-security-token"]) {
    throw new Error("X-Amz-Security-Token must not be set for s3-express requests.");
  }
  return signedRequest;
};
const defaultErrorHandler = (signingProperties) => (error) => {
  throw error;
};
const defaultSuccessHandler = (httpResponse, signingProperties) => {
};
const s3ExpressHttpSigningMiddleware = (config) => (next, context) => async (args) => {
  if (!HttpRequest.isInstance(args.request)) {
    return next(args);
  }
  const smithyContext = getSmithyContext(context);
  const scheme = smithyContext.selectedHttpAuthScheme;
  if (!scheme) {
    throw new Error(`No HttpAuthScheme was selected: unable to sign request`);
  }
  const { httpAuthOption: { signingProperties = {} }, identity, signer } = scheme;
  let request;
  if (context.s3ExpressIdentity) {
    request = await signS3Express(context.s3ExpressIdentity, signingProperties, args.request, await config.signer());
  } else {
    request = await signer.sign(args.request, identity, signingProperties);
  }
  const output = await next({
    ...args,
    request
  }).catch((signer.errorHandler || defaultErrorHandler)(signingProperties));
  (signer.successHandler || defaultSuccessHandler)(output.response, signingProperties);
  return output;
};
const getS3ExpressHttpSigningPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(s3ExpressHttpSigningMiddleware(config), httpSigningMiddlewareOptions);
  }
});
const resolveS3Config = (input, { session }) => {
  const [s3ClientProvider, CreateSessionCommandCtor] = session;
  const { forcePathStyle, useAccelerateEndpoint, disableMultiregionAccessPoints, followRegionRedirects, s3ExpressIdentityProvider, bucketEndpoint } = input;
  return Object.assign(input, {
    forcePathStyle: forcePathStyle ?? false,
    useAccelerateEndpoint: useAccelerateEndpoint ?? false,
    disableMultiregionAccessPoints: disableMultiregionAccessPoints ?? false,
    followRegionRedirects: followRegionRedirects ?? false,
    s3ExpressIdentityProvider: s3ExpressIdentityProvider ?? new S3ExpressIdentityProviderImpl(async (key) => s3ClientProvider().send(new CreateSessionCommandCtor({
      Bucket: key
    }))),
    bucketEndpoint: bucketEndpoint ?? false
  });
};
const THROW_IF_EMPTY_BODY = {
  CopyObjectCommand: true,
  UploadPartCopyCommand: true,
  CompleteMultipartUploadCommand: true
};
const MAX_BYTES_TO_INSPECT = 3e3;
const throw200ExceptionsMiddleware = (config) => (next, context) => async (args) => {
  const result = await next(args);
  const { response } = result;
  if (!HttpResponse.isInstance(response)) {
    return result;
  }
  const { statusCode, body: sourceBody } = response;
  if (statusCode < 200 || statusCode >= 300) {
    return result;
  }
  const isSplittableStream = typeof (sourceBody == null ? void 0 : sourceBody.stream) === "function" || typeof (sourceBody == null ? void 0 : sourceBody.pipe) === "function" || typeof (sourceBody == null ? void 0 : sourceBody.tee) === "function";
  if (!isSplittableStream) {
    return result;
  }
  let bodyCopy = sourceBody;
  let body = sourceBody;
  if (sourceBody && typeof sourceBody === "object" && !(sourceBody instanceof Uint8Array)) {
    [bodyCopy, body] = await splitStream(sourceBody);
  }
  response.body = body;
  const bodyBytes = await collectBody(bodyCopy, {
    streamCollector: async (stream) => {
      return headStream(stream, MAX_BYTES_TO_INSPECT);
    }
  });
  if (typeof (bodyCopy == null ? void 0 : bodyCopy.destroy) === "function") {
    bodyCopy.destroy();
  }
  const bodyStringTail = config.utf8Encoder(bodyBytes.subarray(bodyBytes.length - 16));
  if (bodyBytes.length === 0 && THROW_IF_EMPTY_BODY[context.commandName]) {
    const err = new Error("S3 aborted request");
    err.name = "InternalError";
    throw err;
  }
  if (bodyStringTail && bodyStringTail.endsWith("</Error>")) {
    response.statusCode = 400;
  }
  return result;
};
const collectBody = (streamBody = new Uint8Array(), context) => {
  if (streamBody instanceof Uint8Array) {
    return Promise.resolve(streamBody);
  }
  return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
};
const throw200ExceptionsMiddlewareOptions = {
  relation: "after",
  toMiddleware: "deserializerMiddleware",
  tags: ["THROW_200_EXCEPTIONS", "S3"],
  name: "throw200ExceptionsMiddleware",
  override: true
};
const getThrow200ExceptionsPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(throw200ExceptionsMiddleware(config), throw200ExceptionsMiddlewareOptions);
  }
});
const validate = (str) => typeof str === "string" && str.indexOf("arn:") === 0 && str.split(":").length >= 6;
function bucketEndpointMiddleware(options) {
  return (next, context) => async (args) => {
    var _a, _b, _c, _d;
    if (options.bucketEndpoint) {
      const endpoint = context.endpointV2;
      if (endpoint) {
        const bucket = args.input.Bucket;
        if (typeof bucket === "string") {
          try {
            const bucketEndpointUrl = new URL(bucket);
            context.endpointV2 = {
              ...endpoint,
              url: bucketEndpointUrl
            };
          } catch (e2) {
            const warning = `@aws-sdk/middleware-sdk-s3: bucketEndpoint=true was set but Bucket=${bucket} could not be parsed as URL.`;
            if (((_b = (_a = context.logger) == null ? void 0 : _a.constructor) == null ? void 0 : _b.name) === "NoOpLogger") {
              console.warn(warning);
            } else {
              (_d = (_c = context.logger) == null ? void 0 : _c.warn) == null ? void 0 : _d.call(_c, warning);
            }
            throw e2;
          }
        }
      }
    }
    return next(args);
  };
}
const bucketEndpointMiddlewareOptions = {
  name: "bucketEndpointMiddleware",
  override: true,
  relation: "after",
  toMiddleware: "endpointV2Middleware"
};
function validateBucketNameMiddleware({ bucketEndpoint }) {
  return (next) => async (args) => {
    const { input: { Bucket } } = args;
    if (!bucketEndpoint && typeof Bucket === "string" && !validate(Bucket) && Bucket.indexOf("/") >= 0) {
      const err = new Error(`Bucket name shouldn't contain '/', received '${Bucket}'`);
      err.name = "InvalidBucketName";
      throw err;
    }
    return next({ ...args });
  };
}
const validateBucketNameMiddlewareOptions = {
  step: "initialize",
  tags: ["VALIDATE_BUCKET_NAME"],
  name: "validateBucketNameMiddleware",
  override: true
};
const getValidateBucketNamePlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(validateBucketNameMiddleware(options), validateBucketNameMiddlewareOptions);
    clientStack.addRelativeTo(bucketEndpointMiddleware(options), bucketEndpointMiddlewareOptions);
  }
});
const DEFAULT_UA_APP_ID = void 0;
function isValidUserAgentAppId(appId) {
  if (appId === void 0) {
    return true;
  }
  return typeof appId === "string" && appId.length <= 50;
}
function resolveUserAgentConfig(input) {
  const normalizedAppIdProvider = normalizeProvider(input.userAgentAppId ?? DEFAULT_UA_APP_ID);
  const { customUserAgent } = input;
  return Object.assign(input, {
    customUserAgent: typeof customUserAgent === "string" ? [[customUserAgent]] : customUserAgent,
    userAgentAppId: async () => {
      var _a, _b;
      const appId = await normalizedAppIdProvider();
      if (!isValidUserAgentAppId(appId)) {
        const logger = ((_b = (_a = input.logger) == null ? void 0 : _a.constructor) == null ? void 0 : _b.name) === "NoOpLogger" || !input.logger ? console : input.logger;
        if (typeof appId !== "string") {
          logger == null ? void 0 : logger.warn("userAgentAppId must be a string or undefined.");
        } else if (appId.length > 50) {
          logger == null ? void 0 : logger.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.");
        }
      }
      return appId;
    }
  });
}
const isVirtualHostableS3Bucket = (value, allowSubDomains = false) => {
  if (allowSubDomains) {
    for (const label of value.split(".")) {
      if (!isVirtualHostableS3Bucket(label)) {
        return false;
      }
    }
    return true;
  }
  if (!isValidHostLabel(value)) {
    return false;
  }
  if (value.length < 3 || value.length > 63) {
    return false;
  }
  if (value !== value.toLowerCase()) {
    return false;
  }
  if (isIpAddress(value)) {
    return false;
  }
  return true;
};
const ARN_DELIMITER = ":";
const RESOURCE_DELIMITER = "/";
const parseArn = (value) => {
  const segments = value.split(ARN_DELIMITER);
  if (segments.length < 6)
    return null;
  const [arn, partition2, service, region, accountId, ...resourcePath] = segments;
  if (arn !== "arn" || partition2 === "" || service === "" || resourcePath.join(ARN_DELIMITER) === "")
    return null;
  const resourceId = resourcePath.map((resource) => resource.split(RESOURCE_DELIMITER)).flat();
  return {
    partition: partition2,
    service,
    region,
    accountId,
    resourceId
  };
};
const partitions = [{ "id": "aws", "outputs": { "dnsSuffix": "amazonaws.com", "dualStackDnsSuffix": "api.aws", "implicitGlobalRegion": "us-east-1", "name": "aws", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^(us|eu|ap|sa|ca|me|af|il|mx)\\-\\w+\\-\\d+$", "regions": { "af-south-1": { "description": "Africa (Cape Town)" }, "ap-east-1": { "description": "Asia Pacific (Hong Kong)" }, "ap-northeast-1": { "description": "Asia Pacific (Tokyo)" }, "ap-northeast-2": { "description": "Asia Pacific (Seoul)" }, "ap-northeast-3": { "description": "Asia Pacific (Osaka)" }, "ap-south-1": { "description": "Asia Pacific (Mumbai)" }, "ap-south-2": { "description": "Asia Pacific (Hyderabad)" }, "ap-southeast-1": { "description": "Asia Pacific (Singapore)" }, "ap-southeast-2": { "description": "Asia Pacific (Sydney)" }, "ap-southeast-3": { "description": "Asia Pacific (Jakarta)" }, "ap-southeast-4": { "description": "Asia Pacific (Melbourne)" }, "ap-southeast-5": { "description": "Asia Pacific (Malaysia)" }, "ap-southeast-7": { "description": "Asia Pacific (Thailand)" }, "aws-global": { "description": "AWS Standard global region" }, "ca-central-1": { "description": "Canada (Central)" }, "ca-west-1": { "description": "Canada West (Calgary)" }, "eu-central-1": { "description": "Europe (Frankfurt)" }, "eu-central-2": { "description": "Europe (Zurich)" }, "eu-north-1": { "description": "Europe (Stockholm)" }, "eu-south-1": { "description": "Europe (Milan)" }, "eu-south-2": { "description": "Europe (Spain)" }, "eu-west-1": { "description": "Europe (Ireland)" }, "eu-west-2": { "description": "Europe (London)" }, "eu-west-3": { "description": "Europe (Paris)" }, "il-central-1": { "description": "Israel (Tel Aviv)" }, "me-central-1": { "description": "Middle East (UAE)" }, "me-south-1": { "description": "Middle East (Bahrain)" }, "mx-central-1": { "description": "Mexico (Central)" }, "sa-east-1": { "description": "South America (Sao Paulo)" }, "us-east-1": { "description": "US East (N. Virginia)" }, "us-east-2": { "description": "US East (Ohio)" }, "us-west-1": { "description": "US West (N. California)" }, "us-west-2": { "description": "US West (Oregon)" } } }, { "id": "aws-cn", "outputs": { "dnsSuffix": "amazonaws.com.cn", "dualStackDnsSuffix": "api.amazonwebservices.com.cn", "implicitGlobalRegion": "cn-northwest-1", "name": "aws-cn", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^cn\\-\\w+\\-\\d+$", "regions": { "aws-cn-global": { "description": "AWS China global region" }, "cn-north-1": { "description": "China (Beijing)" }, "cn-northwest-1": { "description": "China (Ningxia)" } } }, { "id": "aws-us-gov", "outputs": { "dnsSuffix": "amazonaws.com", "dualStackDnsSuffix": "api.aws", "implicitGlobalRegion": "us-gov-west-1", "name": "aws-us-gov", "supportsDualStack": true, "supportsFIPS": true }, "regionRegex": "^us\\-gov\\-\\w+\\-\\d+$", "regions": { "aws-us-gov-global": { "description": "AWS GovCloud (US) global region" }, "us-gov-east-1": { "description": "AWS GovCloud (US-East)" }, "us-gov-west-1": { "description": "AWS GovCloud (US-West)" } } }, { "id": "aws-iso", "outputs": { "dnsSuffix": "c2s.ic.gov", "dualStackDnsSuffix": "c2s.ic.gov", "implicitGlobalRegion": "us-iso-east-1", "name": "aws-iso", "supportsDualStack": false, "supportsFIPS": true }, "regionRegex": "^us\\-iso\\-\\w+\\-\\d+$", "regions": { "aws-iso-global": { "description": "AWS ISO (US) global region" }, "us-iso-east-1": { "description": "US ISO East" }, "us-iso-west-1": { "description": "US ISO WEST" } } }, { "id": "aws-iso-b", "outputs": { "dnsSuffix": "sc2s.sgov.gov", "dualStackDnsSuffix": "sc2s.sgov.gov", "implicitGlobalRegion": "us-isob-east-1", "name": "aws-iso-b", "supportsDualStack": false, "supportsFIPS": true }, "regionRegex": "^us\\-isob\\-\\w+\\-\\d+$", "regions": { "aws-iso-b-global": { "description": "AWS ISOB (US) global region" }, "us-isob-east-1": { "description": "US ISOB East (Ohio)" } } }, { "id": "aws-iso-e", "outputs": { "dnsSuffix": "cloud.adc-e.uk", "dualStackDnsSuffix": "cloud.adc-e.uk", "implicitGlobalRegion": "eu-isoe-west-1", "name": "aws-iso-e", "supportsDualStack": false, "supportsFIPS": true }, "regionRegex": "^eu\\-isoe\\-\\w+\\-\\d+$", "regions": { "aws-iso-e-global": { "description": "AWS ISOE (Europe) global region" }, "eu-isoe-west-1": { "description": "EU ISOE West" } } }, { "id": "aws-iso-f", "outputs": { "dnsSuffix": "csp.hci.ic.gov", "dualStackDnsSuffix": "csp.hci.ic.gov", "implicitGlobalRegion": "us-isof-south-1", "name": "aws-iso-f", "supportsDualStack": false, "supportsFIPS": true }, "regionRegex": "^us\\-isof\\-\\w+\\-\\d+$", "regions": { "aws-iso-f-global": { "description": "AWS ISOF global region" }, "us-isof-east-1": { "description": "US ISOF EAST" }, "us-isof-south-1": { "description": "US ISOF SOUTH" } } }, { "id": "aws-eusc", "outputs": { "dnsSuffix": "amazonaws.eu", "dualStackDnsSuffix": "amazonaws.eu", "implicitGlobalRegion": "eusc-de-east-1", "name": "aws-eusc", "supportsDualStack": false, "supportsFIPS": true }, "regionRegex": "^eusc\\-(de)\\-\\w+\\-\\d+$", "regions": { "eusc-de-east-1": { "description": "EU (Germany)" } } }];
const partitionsInfo = {
  partitions
};
let selectedPartitionsInfo = partitionsInfo;
const partition = (value) => {
  const { partitions: partitions2 } = selectedPartitionsInfo;
  for (const partition2 of partitions2) {
    const { regions, outputs } = partition2;
    for (const [region, regionData] of Object.entries(regions)) {
      if (region === value) {
        return {
          ...outputs,
          ...regionData
        };
      }
    }
  }
  for (const partition2 of partitions2) {
    const { regionRegex, outputs } = partition2;
    if (new RegExp(regionRegex).test(value)) {
      return {
        ...outputs
      };
    }
  }
  const DEFAULT_PARTITION = partitions2.find((partition2) => partition2.id === "aws");
  if (!DEFAULT_PARTITION) {
    throw new Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
  }
  return {
    ...DEFAULT_PARTITION.outputs
  };
};
const awsEndpointFunctions = {
  isVirtualHostableS3Bucket,
  parseArn,
  partition
};
customEndpointFunctions.aws = awsEndpointFunctions;
const ACCOUNT_ID_ENDPOINT_REGEX = /\d{12}\.ddb/;
async function checkFeatures(context, config, args) {
  var _a, _b, _c, _d, _e2, _f, _g;
  const request = args.request;
  if (((_a = request == null ? void 0 : request.headers) == null ? void 0 : _a["smithy-protocol"]) === "rpc-v2-cbor") {
    setFeature(context, "PROTOCOL_RPC_V2_CBOR", "M");
  }
  if (typeof config.retryStrategy === "function") {
    const retryStrategy = await config.retryStrategy();
    if (typeof retryStrategy.acquireInitialRetryToken === "function") {
      if ((_c = (_b = retryStrategy.constructor) == null ? void 0 : _b.name) == null ? void 0 : _c.includes("Adaptive")) {
        setFeature(context, "RETRY_MODE_ADAPTIVE", "F");
      } else {
        setFeature(context, "RETRY_MODE_STANDARD", "E");
      }
    } else {
      setFeature(context, "RETRY_MODE_LEGACY", "D");
    }
  }
  if (typeof config.accountIdEndpointMode === "function") {
    const endpointV2 = context.endpointV2;
    if (String((_d = endpointV2 == null ? void 0 : endpointV2.url) == null ? void 0 : _d.hostname).match(ACCOUNT_ID_ENDPOINT_REGEX)) {
      setFeature(context, "ACCOUNT_ID_ENDPOINT", "O");
    }
    switch (await ((_e2 = config.accountIdEndpointMode) == null ? void 0 : _e2.call(config))) {
      case "disabled":
        setFeature(context, "ACCOUNT_ID_MODE_DISABLED", "Q");
        break;
      case "preferred":
        setFeature(context, "ACCOUNT_ID_MODE_PREFERRED", "P");
        break;
      case "required":
        setFeature(context, "ACCOUNT_ID_MODE_REQUIRED", "R");
        break;
    }
  }
  const identity = (_g = (_f = context.__smithy_context) == null ? void 0 : _f.selectedHttpAuthScheme) == null ? void 0 : _g.identity;
  if (identity == null ? void 0 : identity.$source) {
    const credentials = identity;
    if (credentials.accountId) {
      setFeature(context, "RESOLVED_ACCOUNT_ID", "T");
    }
    for (const [key, value] of Object.entries(credentials.$source ?? {})) {
      setFeature(context, key, value);
    }
  }
}
const USER_AGENT = "user-agent";
const X_AMZ_USER_AGENT = "x-amz-user-agent";
const SPACE = " ";
const UA_NAME_SEPARATOR = "/";
const UA_NAME_ESCAPE_REGEX = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g;
const UA_VALUE_ESCAPE_REGEX = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w\#]/g;
const UA_ESCAPE_CHAR = "-";
const BYTE_LIMIT = 1024;
function encodeFeatures(features) {
  let buffer = "";
  for (const key in features) {
    const val = features[key];
    if (buffer.length + val.length + 1 <= BYTE_LIMIT) {
      if (buffer.length) {
        buffer += "," + val;
      } else {
        buffer += val;
      }
      continue;
    }
    break;
  }
  return buffer;
}
const userAgentMiddleware = (options) => (next, context) => async (args) => {
  var _a, _b, _c, _d;
  const { request } = args;
  if (!HttpRequest.isInstance(request)) {
    return next(args);
  }
  const { headers } = request;
  const userAgent = ((_a = context == null ? void 0 : context.userAgent) == null ? void 0 : _a.map(escapeUserAgent)) || [];
  const defaultUserAgent = (await options.defaultUserAgentProvider()).map(escapeUserAgent);
  await checkFeatures(context, options, args);
  const awsContext = context;
  defaultUserAgent.push(`m/${encodeFeatures(Object.assign({}, (_b = context.__smithy_context) == null ? void 0 : _b.features, (_c = awsContext.__aws_sdk_context) == null ? void 0 : _c.features))}`);
  const customUserAgent = ((_d = options == null ? void 0 : options.customUserAgent) == null ? void 0 : _d.map(escapeUserAgent)) || [];
  const appId = await options.userAgentAppId();
  if (appId) {
    defaultUserAgent.push(escapeUserAgent([`app/${appId}`]));
  }
  const sdkUserAgentValue = [].concat([...defaultUserAgent, ...userAgent, ...customUserAgent]).join(SPACE);
  const normalUAValue = [
    ...defaultUserAgent.filter((section) => section.startsWith("aws-sdk-")),
    ...customUserAgent
  ].join(SPACE);
  if (options.runtime !== "browser") {
    if (normalUAValue) {
      headers[X_AMZ_USER_AGENT] = headers[X_AMZ_USER_AGENT] ? `${headers[USER_AGENT]} ${normalUAValue}` : normalUAValue;
    }
    headers[USER_AGENT] = sdkUserAgentValue;
  } else {
    headers[X_AMZ_USER_AGENT] = sdkUserAgentValue;
  }
  return next({
    ...args,
    request
  });
};
const escapeUserAgent = (userAgentPair) => {
  var _a;
  const name = userAgentPair[0].split(UA_NAME_SEPARATOR).map((part) => part.replace(UA_NAME_ESCAPE_REGEX, UA_ESCAPE_CHAR)).join(UA_NAME_SEPARATOR);
  const version2 = (_a = userAgentPair[1]) == null ? void 0 : _a.replace(UA_VALUE_ESCAPE_REGEX, UA_ESCAPE_CHAR);
  const prefixSeparatorIndex = name.indexOf(UA_NAME_SEPARATOR);
  const prefix = name.substring(0, prefixSeparatorIndex);
  let uaName = name.substring(prefixSeparatorIndex + 1);
  if (prefix === "api") {
    uaName = uaName.toLowerCase();
  }
  return [prefix, uaName, version2].filter((item) => item && item.length > 0).reduce((acc, item, index) => {
    switch (index) {
      case 0:
        return item;
      case 1:
        return `${acc}/${item}`;
      default:
        return `${acc}#${item}`;
    }
  }, "");
};
const getUserAgentMiddlewareOptions = {
  name: "getUserAgentMiddleware",
  step: "build",
  priority: "low",
  tags: ["SET_USER_AGENT", "USER_AGENT"],
  override: true
};
const getUserAgentPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.add(userAgentMiddleware(config), getUserAgentMiddlewareOptions);
  }
});
class SignatureV4MultiRegion {
  constructor(options) {
    __publicField(this, "sigv4aSigner");
    __publicField(this, "sigv4Signer");
    __publicField(this, "signerOptions");
    this.sigv4Signer = new SignatureV4S3Express(options);
    this.signerOptions = options;
  }
  static sigv4aDependency() {
    return "none";
  }
  async sign(requestToSign, options = {}) {
    if (options.signingRegion === "*") {
      return this.getSigv4aSigner().sign(requestToSign, options);
    }
    return this.sigv4Signer.sign(requestToSign, options);
  }
  async signWithCredentials(requestToSign, credentials, options = {}) {
    if (options.signingRegion === "*") {
      this.getSigv4aSigner();
      {
        throw new Error(`signWithCredentials with signingRegion '*' is only supported when using the CRT dependency @aws-sdk/signature-v4-crt. Please check whether you have installed the "@aws-sdk/signature-v4-crt" package explicitly. You must also register the package by calling [require("@aws-sdk/signature-v4-crt");] or an ESM equivalent such as [import "@aws-sdk/signature-v4-crt";]. For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt`);
      }
    }
    return this.sigv4Signer.signWithCredentials(requestToSign, credentials, options);
  }
  async presign(originalRequest, options = {}) {
    if (options.signingRegion === "*") {
      this.getSigv4aSigner();
      {
        throw new Error(`presign with signingRegion '*' is only supported when using the CRT dependency @aws-sdk/signature-v4-crt. Please check whether you have installed the "@aws-sdk/signature-v4-crt" package explicitly. You must also register the package by calling [require("@aws-sdk/signature-v4-crt");] or an ESM equivalent such as [import "@aws-sdk/signature-v4-crt";]. For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt`);
      }
    }
    return this.sigv4Signer.presign(originalRequest, options);
  }
  async presignWithCredentials(originalRequest, credentials, options = {}) {
    if (options.signingRegion === "*") {
      throw new Error("Method presignWithCredentials is not supported for [signingRegion=*].");
    }
    return this.sigv4Signer.presignWithCredentials(originalRequest, credentials, options);
  }
  getSigv4aSigner() {
    if (!this.sigv4aSigner) {
      if (this.signerOptions.runtime === "node") {
        {
          throw new Error("Neither CRT nor JS SigV4a implementation is available. Please load either @aws-sdk/signature-v4-crt or @aws-sdk/signature-v4a. For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt");
        }
      } else {
        {
          throw new Error("JS SigV4a implementation is not available or not a valid constructor. Please check whether you have installed the @aws-sdk/signature-v4a package explicitly. The CRT implementation is not available for browsers. You must also register the package by calling [require('@aws-sdk/signature-v4a');] or an ESM equivalent such as [import '@aws-sdk/signature-v4a';]. For more information please go to https://github.com/aws/aws-sdk-js-v3#using-javascript-non-crt-implementation-of-sigv4a");
        }
      }
    }
    return this.sigv4aSigner;
  }
}
const cp = "required", cq = "type", cr = "rules", cs = "conditions", ct = "fn", cu = "argv", cv = "ref", cw = "assign", cx = "url", cy = "properties", cz = "backend", cA = "authSchemes", cB = "disableDoubleEncoding", cC = "signingName", cD = "signingRegion", cE = "headers", cF = "signingRegionSet";
const a = 6, b = false, c = true, d = "isSet", e = "booleanEquals", f = "error", g = "aws.partition", h = "stringEquals", i = "getAttr", j = "name", k = "substring", l = "bucketSuffix", m = "parseURL", n = "endpoint", o = "tree", p = "aws.isVirtualHostableS3Bucket", q = "{url#scheme}://{Bucket}.{url#authority}{url#path}", r = "not", s = "accessPointSuffix", t = "{url#scheme}://{url#authority}{url#path}", u = "hardwareType", v = "regionPrefix", w = "bucketAliasSuffix", x = "outpostId", y = "isValidHostLabel", z = "sigv4a", A = "s3-outposts", B = "s3", C = "{url#scheme}://{url#authority}{url#normalizedPath}{Bucket}", D = "https://{Bucket}.s3-accelerate.{partitionResult#dnsSuffix}", E = "https://{Bucket}.s3.{partitionResult#dnsSuffix}", F = "aws.parseArn", G = "bucketArn", H = "arnType", I = "", J = "s3-object-lambda", K = "accesspoint", L = "accessPointName", M = "{url#scheme}://{accessPointName}-{bucketArn#accountId}.{url#authority}{url#path}", N = "mrapPartition", O = "outpostType", P = "arnPrefix", Q = "{url#scheme}://{url#authority}{url#normalizedPath}{uri_encoded_bucket}", R = "https://s3.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", S = "https://s3.{partitionResult#dnsSuffix}", T = { [cp]: false, [cq]: "String" }, U = { [cp]: true, "default": false, [cq]: "Boolean" }, V = { [cp]: false, [cq]: "Boolean" }, W = { [ct]: e, [cu]: [{ [cv]: "Accelerate" }, true] }, X = { [ct]: e, [cu]: [{ [cv]: "UseFIPS" }, true] }, Y = { [ct]: e, [cu]: [{ [cv]: "UseDualStack" }, true] }, Z = { [ct]: d, [cu]: [{ [cv]: "Endpoint" }] }, aa = { [ct]: g, [cu]: [{ [cv]: "Region" }], [cw]: "partitionResult" }, ab = { [ct]: h, [cu]: [{ [ct]: i, [cu]: [{ [cv]: "partitionResult" }, j] }, "aws-cn"] }, ac = { [ct]: d, [cu]: [{ [cv]: "Bucket" }] }, ad = { [cv]: "Bucket" }, ae = { [cs]: [Y], [f]: "S3Express does not support Dual-stack.", [cq]: f }, af = { [cs]: [W], [f]: "S3Express does not support S3 Accelerate.", [cq]: f }, ag = { [cs]: [Z, { [ct]: m, [cu]: [{ [cv]: "Endpoint" }], [cw]: "url" }], [cr]: [{ [cs]: [{ [ct]: d, [cu]: [{ [cv]: "DisableS3ExpressSessionAuth" }] }, { [ct]: e, [cu]: [{ [cv]: "DisableS3ExpressSessionAuth" }, true] }], [cr]: [{ [cs]: [{ [ct]: e, [cu]: [{ [ct]: i, [cu]: [{ [cv]: "url" }, "isIp"] }, true] }], [cr]: [{ [cs]: [{ [ct]: "uriEncode", [cu]: [ad], [cw]: "uri_encoded_bucket" }], [cr]: [{ [n]: { [cx]: "{url#scheme}://{url#authority}/{uri_encoded_bucket}{url#path}", [cy]: { [cz]: "S3Express", [cA]: [{ [cB]: true, [j]: "sigv4", [cC]: "s3express", [cD]: "{Region}" }] }, [cE]: {} }, [cq]: n }], [cq]: o }], [cq]: o }, { [cs]: [{ [ct]: p, [cu]: [ad, false] }], [cr]: [{ [n]: { [cx]: q, [cy]: { [cz]: "S3Express", [cA]: [{ [cB]: true, [j]: "sigv4", [cC]: "s3express", [cD]: "{Region}" }] }, [cE]: {} }, [cq]: n }], [cq]: o }, { [f]: "S3Express bucket name is not a valid virtual hostable name.", [cq]: f }], [cq]: o }, { [cs]: [{ [ct]: e, [cu]: [{ [ct]: i, [cu]: [{ [cv]: "url" }, "isIp"] }, true] }], [cr]: [{ [cs]: [{ [ct]: "uriEncode", [cu]: [ad], [cw]: "uri_encoded_bucket" }], [cr]: [{ [n]: { [cx]: "{url#scheme}://{url#authority}/{uri_encoded_bucket}{url#path}", [cy]: { [cz]: "S3Express", [cA]: [{ [cB]: true, [j]: "sigv4-s3express", [cC]: "s3express", [cD]: "{Region}" }] }, [cE]: {} }, [cq]: n }], [cq]: o }], [cq]: o }, { [cs]: [{ [ct]: p, [cu]: [ad, false] }], [cr]: [{ [n]: { [cx]: q, [cy]: { [cz]: "S3Express", [cA]: [{ [cB]: true, [j]: "sigv4-s3express", [cC]: "s3express", [cD]: "{Region}" }] }, [cE]: {} }, [cq]: n }], [cq]: o }, { [f]: "S3Express bucket name is not a valid virtual hostable name.", [cq]: f }], [cq]: o }, ah = { [ct]: m, [cu]: [{ [cv]: "Endpoint" }], [cw]: "url" }, ai = { [ct]: e, [cu]: [{ [ct]: i, [cu]: [{ [cv]: "url" }, "isIp"] }, true] }, aj = { [cv]: "url" }, ak = { [ct]: "uriEncode", [cu]: [ad], [cw]: "uri_encoded_bucket" }, al = { [cz]: "S3Express", [cA]: [{ [cB]: true, [j]: "sigv4", [cC]: "s3express", [cD]: "{Region}" }] }, am = {}, an = { [ct]: p, [cu]: [ad, false] }, ao = { [f]: "S3Express bucket name is not a valid virtual hostable name.", [cq]: f }, ap = { [ct]: d, [cu]: [{ [cv]: "UseS3ExpressControlEndpoint" }] }, aq = { [ct]: e, [cu]: [{ [cv]: "UseS3ExpressControlEndpoint" }, true] }, ar = { [ct]: r, [cu]: [Z] }, as = { [f]: "Unrecognized S3Express bucket name format.", [cq]: f }, at = { [ct]: r, [cu]: [ac] }, au = { [cv]: u }, av = { [cs]: [ar], [f]: "Expected a endpoint to be specified but no endpoint was found", [cq]: f }, aw = { [cA]: [{ [cB]: true, [j]: z, [cC]: A, [cF]: ["*"] }, { [cB]: true, [j]: "sigv4", [cC]: A, [cD]: "{Region}" }] }, ax = { [ct]: e, [cu]: [{ [cv]: "ForcePathStyle" }, false] }, ay = { [cv]: "ForcePathStyle" }, az = { [ct]: e, [cu]: [{ [cv]: "Accelerate" }, false] }, aA = { [ct]: h, [cu]: [{ [cv]: "Region" }, "aws-global"] }, aB = { [cA]: [{ [cB]: true, [j]: "sigv4", [cC]: B, [cD]: "us-east-1" }] }, aC = { [ct]: r, [cu]: [aA] }, aD = { [ct]: e, [cu]: [{ [cv]: "UseGlobalEndpoint" }, true] }, aE = { [cx]: "https://{Bucket}.s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}", [cy]: { [cA]: [{ [cB]: true, [j]: "sigv4", [cC]: B, [cD]: "{Region}" }] }, [cE]: {} }, aF = { [cA]: [{ [cB]: true, [j]: "sigv4", [cC]: B, [cD]: "{Region}" }] }, aG = { [ct]: e, [cu]: [{ [cv]: "UseGlobalEndpoint" }, false] }, aH = { [ct]: e, [cu]: [{ [cv]: "UseDualStack" }, false] }, aI = { [cx]: "https://{Bucket}.s3-fips.{Region}.{partitionResult#dnsSuffix}", [cy]: aF, [cE]: {} }, aJ = { [ct]: e, [cu]: [{ [cv]: "UseFIPS" }, false] }, aK = { [cx]: "https://{Bucket}.s3-accelerate.dualstack.{partitionResult#dnsSuffix}", [cy]: aF, [cE]: {} }, aL = { [cx]: "https://{Bucket}.s3.dualstack.{Region}.{partitionResult#dnsSuffix}", [cy]: aF, [cE]: {} }, aM = { [ct]: e, [cu]: [{ [ct]: i, [cu]: [aj, "isIp"] }, false] }, aN = { [cx]: C, [cy]: aF, [cE]: {} }, aO = { [cx]: q, [cy]: aF, [cE]: {} }, aP = { [n]: aO, [cq]: n }, aQ = { [cx]: D, [cy]: aF, [cE]: {} }, aR = { [cx]: "https://{Bucket}.s3.{Region}.{partitionResult#dnsSuffix}", [cy]: aF, [cE]: {} }, aS = { [f]: "Invalid region: region was not a valid DNS name.", [cq]: f }, aT = { [cv]: G }, aU = { [cv]: H }, aV = { [ct]: i, [cu]: [aT, "service"] }, aW = { [cv]: L }, aX = { [cs]: [Y], [f]: "S3 Object Lambda does not support Dual-stack", [cq]: f }, aY = { [cs]: [W], [f]: "S3 Object Lambda does not support S3 Accelerate", [cq]: f }, aZ = { [cs]: [{ [ct]: d, [cu]: [{ [cv]: "DisableAccessPoints" }] }, { [ct]: e, [cu]: [{ [cv]: "DisableAccessPoints" }, true] }], [f]: "Access points are not supported for this operation", [cq]: f }, ba = { [cs]: [{ [ct]: d, [cu]: [{ [cv]: "UseArnRegion" }] }, { [ct]: e, [cu]: [{ [cv]: "UseArnRegion" }, false] }, { [ct]: r, [cu]: [{ [ct]: h, [cu]: [{ [ct]: i, [cu]: [aT, "region"] }, "{Region}"] }] }], [f]: "Invalid configuration: region from ARN `{bucketArn#region}` does not match client region `{Region}` and UseArnRegion is `false`", [cq]: f }, bb = { [ct]: i, [cu]: [{ [cv]: "bucketPartition" }, j] }, bc = { [ct]: i, [cu]: [aT, "accountId"] }, bd = { [cA]: [{ [cB]: true, [j]: "sigv4", [cC]: J, [cD]: "{bucketArn#region}" }] }, be = { [f]: "Invalid ARN: The access point name may only contain a-z, A-Z, 0-9 and `-`. Found: `{accessPointName}`", [cq]: f }, bf = { [f]: "Invalid ARN: The account id may only contain a-z, A-Z, 0-9 and `-`. Found: `{bucketArn#accountId}`", [cq]: f }, bg = { [f]: "Invalid region in ARN: `{bucketArn#region}` (invalid DNS name)", [cq]: f }, bh = { [f]: "Client was configured for partition `{partitionResult#name}` but ARN (`{Bucket}`) has `{bucketPartition#name}`", [cq]: f }, bi = { [f]: "Invalid ARN: The ARN may only contain a single resource component after `accesspoint`.", [cq]: f }, bj = { [f]: "Invalid ARN: Expected a resource of the format `accesspoint:<accesspoint name>` but no name was provided", [cq]: f }, bk = { [cA]: [{ [cB]: true, [j]: "sigv4", [cC]: B, [cD]: "{bucketArn#region}" }] }, bl = { [cA]: [{ [cB]: true, [j]: z, [cC]: A, [cF]: ["*"] }, { [cB]: true, [j]: "sigv4", [cC]: A, [cD]: "{bucketArn#region}" }] }, bm = { [ct]: F, [cu]: [ad] }, bn = { [cx]: "https://s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cy]: aF, [cE]: {} }, bo = { [cx]: "https://s3-fips.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cy]: aF, [cE]: {} }, bp = { [cx]: "https://s3.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cy]: aF, [cE]: {} }, bq = { [cx]: Q, [cy]: aF, [cE]: {} }, br = { [cx]: "https://s3.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cy]: aF, [cE]: {} }, bs = { [cv]: "UseObjectLambdaEndpoint" }, bt = { [cA]: [{ [cB]: true, [j]: "sigv4", [cC]: J, [cD]: "{Region}" }] }, bu = { [cx]: "https://s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}", [cy]: aF, [cE]: {} }, bv = { [cx]: "https://s3-fips.{Region}.{partitionResult#dnsSuffix}", [cy]: aF, [cE]: {} }, bw = { [cx]: "https://s3.dualstack.{Region}.{partitionResult#dnsSuffix}", [cy]: aF, [cE]: {} }, bx = { [cx]: t, [cy]: aF, [cE]: {} }, by = { [cx]: "https://s3.{Region}.{partitionResult#dnsSuffix}", [cy]: aF, [cE]: {} }, bz = [{ [cv]: "Region" }], bA = [{ [cv]: "Endpoint" }], bB = [ad], bC = [Y], bD = [W], bE = [Z, ah], bF = [{ [ct]: d, [cu]: [{ [cv]: "DisableS3ExpressSessionAuth" }] }, { [ct]: e, [cu]: [{ [cv]: "DisableS3ExpressSessionAuth" }, true] }], bG = [ak], bH = [an], bI = [aa], bJ = [X], bK = [{ [ct]: k, [cu]: [ad, 6, 14, true], [cw]: "s3expressAvailabilityZoneId" }, { [ct]: k, [cu]: [ad, 14, 16, true], [cw]: "s3expressAvailabilityZoneDelim" }, { [ct]: h, [cu]: [{ [cv]: "s3expressAvailabilityZoneDelim" }, "--"] }], bL = [{ [cs]: [X], [n]: { [cx]: "https://{Bucket}.s3express-fips-{s3expressAvailabilityZoneId}.{Region}.{partitionResult#dnsSuffix}", [cy]: al, [cE]: {} }, [cq]: n }, { [n]: { [cx]: "https://{Bucket}.s3express-{s3expressAvailabilityZoneId}.{Region}.{partitionResult#dnsSuffix}", [cy]: al, [cE]: {} }, [cq]: n }], bM = [{ [ct]: k, [cu]: [ad, 6, 15, true], [cw]: "s3expressAvailabilityZoneId" }, { [ct]: k, [cu]: [ad, 15, 17, true], [cw]: "s3expressAvailabilityZoneDelim" }, { [ct]: h, [cu]: [{ [cv]: "s3expressAvailabilityZoneDelim" }, "--"] }], bN = [{ [ct]: k, [cu]: [ad, 6, 19, true], [cw]: "s3expressAvailabilityZoneId" }, { [ct]: k, [cu]: [ad, 19, 21, true], [cw]: "s3expressAvailabilityZoneDelim" }, { [ct]: h, [cu]: [{ [cv]: "s3expressAvailabilityZoneDelim" }, "--"] }], bO = [{ [ct]: k, [cu]: [ad, 6, 20, true], [cw]: "s3expressAvailabilityZoneId" }, { [ct]: k, [cu]: [ad, 20, 22, true], [cw]: "s3expressAvailabilityZoneDelim" }, { [ct]: h, [cu]: [{ [cv]: "s3expressAvailabilityZoneDelim" }, "--"] }], bP = [{ [ct]: k, [cu]: [ad, 6, 26, true], [cw]: "s3expressAvailabilityZoneId" }, { [ct]: k, [cu]: [ad, 26, 28, true], [cw]: "s3expressAvailabilityZoneDelim" }, { [ct]: h, [cu]: [{ [cv]: "s3expressAvailabilityZoneDelim" }, "--"] }], bQ = [{ [cs]: [X], [n]: { [cx]: "https://{Bucket}.s3express-fips-{s3expressAvailabilityZoneId}.{Region}.{partitionResult#dnsSuffix}", [cy]: { [cz]: "S3Express", [cA]: [{ [cB]: true, [j]: "sigv4-s3express", [cC]: "s3express", [cD]: "{Region}" }] }, [cE]: {} }, [cq]: n }, { [n]: { [cx]: "https://{Bucket}.s3express-{s3expressAvailabilityZoneId}.{Region}.{partitionResult#dnsSuffix}", [cy]: { [cz]: "S3Express", [cA]: [{ [cB]: true, [j]: "sigv4-s3express", [cC]: "s3express", [cD]: "{Region}" }] }, [cE]: {} }, [cq]: n }], bR = [ad, 0, 7, true], bS = [{ [ct]: k, [cu]: [ad, 7, 15, true], [cw]: "s3expressAvailabilityZoneId" }, { [ct]: k, [cu]: [ad, 15, 17, true], [cw]: "s3expressAvailabilityZoneDelim" }, { [ct]: h, [cu]: [{ [cv]: "s3expressAvailabilityZoneDelim" }, "--"] }], bT = [{ [ct]: k, [cu]: [ad, 7, 16, true], [cw]: "s3expressAvailabilityZoneId" }, { [ct]: k, [cu]: [ad, 16, 18, true], [cw]: "s3expressAvailabilityZoneDelim" }, { [ct]: h, [cu]: [{ [cv]: "s3expressAvailabilityZoneDelim" }, "--"] }], bU = [{ [ct]: k, [cu]: [ad, 7, 20, true], [cw]: "s3expressAvailabilityZoneId" }, { [ct]: k, [cu]: [ad, 20, 22, true], [cw]: "s3expressAvailabilityZoneDelim" }, { [ct]: h, [cu]: [{ [cv]: "s3expressAvailabilityZoneDelim" }, "--"] }], bV = [{ [ct]: k, [cu]: [ad, 7, 21, true], [cw]: "s3expressAvailabilityZoneId" }, { [ct]: k, [cu]: [ad, 21, 23, true], [cw]: "s3expressAvailabilityZoneDelim" }, { [ct]: h, [cu]: [{ [cv]: "s3expressAvailabilityZoneDelim" }, "--"] }], bW = [{ [ct]: k, [cu]: [ad, 7, 27, true], [cw]: "s3expressAvailabilityZoneId" }, { [ct]: k, [cu]: [ad, 27, 29, true], [cw]: "s3expressAvailabilityZoneDelim" }, { [ct]: h, [cu]: [{ [cv]: "s3expressAvailabilityZoneDelim" }, "--"] }], bX = [ac], bY = [{ [ct]: y, [cu]: [{ [cv]: x }, false] }], bZ = [{ [ct]: h, [cu]: [{ [cv]: v }, "beta"] }], ca = ["*"], cb = [{ [ct]: y, [cu]: [{ [cv]: "Region" }, false] }], cc = [{ [ct]: h, [cu]: [{ [cv]: "Region" }, "us-east-1"] }], cd = [{ [ct]: h, [cu]: [aU, K] }], ce = [{ [ct]: i, [cu]: [aT, "resourceId[1]"], [cw]: L }, { [ct]: r, [cu]: [{ [ct]: h, [cu]: [aW, I] }] }], cf = [aT, "resourceId[1]"], cg = [{ [ct]: r, [cu]: [{ [ct]: h, [cu]: [{ [ct]: i, [cu]: [aT, "region"] }, I] }] }], ch = [{ [ct]: r, [cu]: [{ [ct]: d, [cu]: [{ [ct]: i, [cu]: [aT, "resourceId[2]"] }] }] }], ci = [aT, "resourceId[2]"], cj = [{ [ct]: g, [cu]: [{ [ct]: i, [cu]: [aT, "region"] }], [cw]: "bucketPartition" }], ck = [{ [ct]: h, [cu]: [bb, { [ct]: i, [cu]: [{ [cv]: "partitionResult" }, j] }] }], cl = [{ [ct]: y, [cu]: [{ [ct]: i, [cu]: [aT, "region"] }, true] }], cm = [{ [ct]: y, [cu]: [bc, false] }], cn = [{ [ct]: y, [cu]: [aW, false] }], co = [{ [ct]: y, [cu]: [{ [cv]: "Region" }, true] }];
const _data = { parameters: { Bucket: T, Region: T, UseFIPS: U, UseDualStack: U, Endpoint: T, ForcePathStyle: U, Accelerate: U, UseGlobalEndpoint: U, UseObjectLambdaEndpoint: V, Key: T, Prefix: T, CopySource: T, DisableAccessPoints: V, DisableMultiRegionAccessPoints: U, UseArnRegion: V, UseS3ExpressControlEndpoint: V, DisableS3ExpressSessionAuth: V }, [cr]: [{ [cs]: [{ [ct]: d, [cu]: bz }], [cr]: [{ [cs]: [W, X], error: "Accelerate cannot be used with FIPS", [cq]: f }, { [cs]: [Y, Z], error: "Cannot set dual-stack in combination with a custom endpoint.", [cq]: f }, { [cs]: [Z, X], error: "A custom endpoint cannot be combined with FIPS", [cq]: f }, { [cs]: [Z, W], error: "A custom endpoint cannot be combined with S3 Accelerate", [cq]: f }, { [cs]: [X, aa, ab], error: "Partition does not support FIPS", [cq]: f }, { [cs]: [ac, { [ct]: k, [cu]: [ad, 0, a, c], [cw]: l }, { [ct]: h, [cu]: [{ [cv]: l }, "--x-s3"] }], [cr]: [ae, af, ag, { [cs]: [ap, aq], [cr]: [{ [cs]: bI, [cr]: [{ [cs]: [ak, ar], [cr]: [{ [cs]: bJ, endpoint: { [cx]: "https://s3express-control-fips.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cy]: al, [cE]: am }, [cq]: n }, { endpoint: { [cx]: "https://s3express-control.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cy]: al, [cE]: am }, [cq]: n }], [cq]: o }], [cq]: o }], [cq]: o }, { [cs]: bH, [cr]: [{ [cs]: bI, [cr]: [{ [cs]: bF, [cr]: [{ [cs]: bK, [cr]: bL, [cq]: o }, { [cs]: bM, [cr]: bL, [cq]: o }, { [cs]: bN, [cr]: bL, [cq]: o }, { [cs]: bO, [cr]: bL, [cq]: o }, { [cs]: bP, [cr]: bL, [cq]: o }, as], [cq]: o }, { [cs]: bK, [cr]: bQ, [cq]: o }, { [cs]: bM, [cr]: bQ, [cq]: o }, { [cs]: bN, [cr]: bQ, [cq]: o }, { [cs]: bO, [cr]: bQ, [cq]: o }, { [cs]: bP, [cr]: bQ, [cq]: o }, as], [cq]: o }], [cq]: o }, ao], [cq]: o }, { [cs]: [ac, { [ct]: k, [cu]: bR, [cw]: s }, { [ct]: h, [cu]: [{ [cv]: s }, "--xa-s3"] }], [cr]: [ae, af, ag, { [cs]: bH, [cr]: [{ [cs]: bI, [cr]: [{ [cs]: bF, [cr]: [{ [cs]: bS, [cr]: bL, [cq]: o }, { [cs]: bT, [cr]: bL, [cq]: o }, { [cs]: bU, [cr]: bL, [cq]: o }, { [cs]: bV, [cr]: bL, [cq]: o }, { [cs]: bW, [cr]: bL, [cq]: o }, as], [cq]: o }, { [cs]: bS, [cr]: bQ, [cq]: o }, { [cs]: bT, [cr]: bQ, [cq]: o }, { [cs]: bU, [cr]: bQ, [cq]: o }, { [cs]: bV, [cr]: bQ, [cq]: o }, { [cs]: bW, [cr]: bQ, [cq]: o }, as], [cq]: o }], [cq]: o }, ao], [cq]: o }, { [cs]: [at, ap, aq], [cr]: [{ [cs]: bI, [cr]: [{ [cs]: bE, endpoint: { [cx]: t, [cy]: al, [cE]: am }, [cq]: n }, { [cs]: bJ, endpoint: { [cx]: "https://s3express-control-fips.{Region}.{partitionResult#dnsSuffix}", [cy]: al, [cE]: am }, [cq]: n }, { endpoint: { [cx]: "https://s3express-control.{Region}.{partitionResult#dnsSuffix}", [cy]: al, [cE]: am }, [cq]: n }], [cq]: o }], [cq]: o }, { [cs]: [ac, { [ct]: k, [cu]: [ad, 49, 50, c], [cw]: u }, { [ct]: k, [cu]: [ad, 8, 12, c], [cw]: v }, { [ct]: k, [cu]: bR, [cw]: w }, { [ct]: k, [cu]: [ad, 32, 49, c], [cw]: x }, { [ct]: g, [cu]: bz, [cw]: "regionPartition" }, { [ct]: h, [cu]: [{ [cv]: w }, "--op-s3"] }], [cr]: [{ [cs]: bY, [cr]: [{ [cs]: [{ [ct]: h, [cu]: [au, "e"] }], [cr]: [{ [cs]: bZ, [cr]: [av, { [cs]: bE, endpoint: { [cx]: "https://{Bucket}.ec2.{url#authority}", [cy]: aw, [cE]: am }, [cq]: n }], [cq]: o }, { endpoint: { [cx]: "https://{Bucket}.ec2.s3-outposts.{Region}.{regionPartition#dnsSuffix}", [cy]: aw, [cE]: am }, [cq]: n }], [cq]: o }, { [cs]: [{ [ct]: h, [cu]: [au, "o"] }], [cr]: [{ [cs]: bZ, [cr]: [av, { [cs]: bE, endpoint: { [cx]: "https://{Bucket}.op-{outpostId}.{url#authority}", [cy]: aw, [cE]: am }, [cq]: n }], [cq]: o }, { endpoint: { [cx]: "https://{Bucket}.op-{outpostId}.s3-outposts.{Region}.{regionPartition#dnsSuffix}", [cy]: aw, [cE]: am }, [cq]: n }], [cq]: o }, { error: 'Unrecognized hardware type: "Expected hardware type o or e but got {hardwareType}"', [cq]: f }], [cq]: o }, { error: "Invalid ARN: The outpost Id must only contain a-z, A-Z, 0-9 and `-`.", [cq]: f }], [cq]: o }, { [cs]: bX, [cr]: [{ [cs]: [Z, { [ct]: r, [cu]: [{ [ct]: d, [cu]: [{ [ct]: m, [cu]: bA }] }] }], error: "Custom endpoint `{Endpoint}` was not a valid URI", [cq]: f }, { [cs]: [ax, an], [cr]: [{ [cs]: bI, [cr]: [{ [cs]: cb, [cr]: [{ [cs]: [W, ab], error: "S3 Accelerate cannot be used in this region", [cq]: f }, { [cs]: [Y, X, az, ar, aA], endpoint: { [cx]: "https://{Bucket}.s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}", [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [Y, X, az, ar, aC, aD], [cr]: [{ endpoint: aE, [cq]: n }], [cq]: o }, { [cs]: [Y, X, az, ar, aC, aG], endpoint: aE, [cq]: n }, { [cs]: [aH, X, az, ar, aA], endpoint: { [cx]: "https://{Bucket}.s3-fips.us-east-1.{partitionResult#dnsSuffix}", [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [aH, X, az, ar, aC, aD], [cr]: [{ endpoint: aI, [cq]: n }], [cq]: o }, { [cs]: [aH, X, az, ar, aC, aG], endpoint: aI, [cq]: n }, { [cs]: [Y, aJ, W, ar, aA], endpoint: { [cx]: "https://{Bucket}.s3-accelerate.dualstack.us-east-1.{partitionResult#dnsSuffix}", [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [Y, aJ, W, ar, aC, aD], [cr]: [{ endpoint: aK, [cq]: n }], [cq]: o }, { [cs]: [Y, aJ, W, ar, aC, aG], endpoint: aK, [cq]: n }, { [cs]: [Y, aJ, az, ar, aA], endpoint: { [cx]: "https://{Bucket}.s3.dualstack.us-east-1.{partitionResult#dnsSuffix}", [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [Y, aJ, az, ar, aC, aD], [cr]: [{ endpoint: aL, [cq]: n }], [cq]: o }, { [cs]: [Y, aJ, az, ar, aC, aG], endpoint: aL, [cq]: n }, { [cs]: [aH, aJ, az, Z, ah, ai, aA], endpoint: { [cx]: C, [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [aH, aJ, az, Z, ah, aM, aA], endpoint: { [cx]: q, [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [aH, aJ, az, Z, ah, ai, aC, aD], [cr]: [{ [cs]: cc, endpoint: aN, [cq]: n }, { endpoint: aN, [cq]: n }], [cq]: o }, { [cs]: [aH, aJ, az, Z, ah, aM, aC, aD], [cr]: [{ [cs]: cc, endpoint: aO, [cq]: n }, aP], [cq]: o }, { [cs]: [aH, aJ, az, Z, ah, ai, aC, aG], endpoint: aN, [cq]: n }, { [cs]: [aH, aJ, az, Z, ah, aM, aC, aG], endpoint: aO, [cq]: n }, { [cs]: [aH, aJ, W, ar, aA], endpoint: { [cx]: D, [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [aH, aJ, W, ar, aC, aD], [cr]: [{ [cs]: cc, endpoint: aQ, [cq]: n }, { endpoint: aQ, [cq]: n }], [cq]: o }, { [cs]: [aH, aJ, W, ar, aC, aG], endpoint: aQ, [cq]: n }, { [cs]: [aH, aJ, az, ar, aA], endpoint: { [cx]: E, [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [aH, aJ, az, ar, aC, aD], [cr]: [{ [cs]: cc, endpoint: { [cx]: E, [cy]: aF, [cE]: am }, [cq]: n }, { endpoint: aR, [cq]: n }], [cq]: o }, { [cs]: [aH, aJ, az, ar, aC, aG], endpoint: aR, [cq]: n }], [cq]: o }, aS], [cq]: o }], [cq]: o }, { [cs]: [Z, ah, { [ct]: h, [cu]: [{ [ct]: i, [cu]: [aj, "scheme"] }, "http"] }, { [ct]: p, [cu]: [ad, c] }, ax, aJ, aH, az], [cr]: [{ [cs]: bI, [cr]: [{ [cs]: cb, [cr]: [aP], [cq]: o }, aS], [cq]: o }], [cq]: o }, { [cs]: [ax, { [ct]: F, [cu]: bB, [cw]: G }], [cr]: [{ [cs]: [{ [ct]: i, [cu]: [aT, "resourceId[0]"], [cw]: H }, { [ct]: r, [cu]: [{ [ct]: h, [cu]: [aU, I] }] }], [cr]: [{ [cs]: [{ [ct]: h, [cu]: [aV, J] }], [cr]: [{ [cs]: cd, [cr]: [{ [cs]: ce, [cr]: [aX, aY, { [cs]: cg, [cr]: [aZ, { [cs]: ch, [cr]: [ba, { [cs]: cj, [cr]: [{ [cs]: bI, [cr]: [{ [cs]: ck, [cr]: [{ [cs]: cl, [cr]: [{ [cs]: [{ [ct]: h, [cu]: [bc, I] }], error: "Invalid ARN: Missing account id", [cq]: f }, { [cs]: cm, [cr]: [{ [cs]: cn, [cr]: [{ [cs]: bE, endpoint: { [cx]: M, [cy]: bd, [cE]: am }, [cq]: n }, { [cs]: bJ, endpoint: { [cx]: "https://{accessPointName}-{bucketArn#accountId}.s3-object-lambda-fips.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cy]: bd, [cE]: am }, [cq]: n }, { endpoint: { [cx]: "https://{accessPointName}-{bucketArn#accountId}.s3-object-lambda.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cy]: bd, [cE]: am }, [cq]: n }], [cq]: o }, be], [cq]: o }, bf], [cq]: o }, bg], [cq]: o }, bh], [cq]: o }], [cq]: o }], [cq]: o }, bi], [cq]: o }, { error: "Invalid ARN: bucket ARN is missing a region", [cq]: f }], [cq]: o }, bj], [cq]: o }, { error: "Invalid ARN: Object Lambda ARNs only support `accesspoint` arn types, but found: `{arnType}`", [cq]: f }], [cq]: o }, { [cs]: cd, [cr]: [{ [cs]: ce, [cr]: [{ [cs]: cg, [cr]: [{ [cs]: cd, [cr]: [{ [cs]: cg, [cr]: [aZ, { [cs]: ch, [cr]: [ba, { [cs]: cj, [cr]: [{ [cs]: bI, [cr]: [{ [cs]: [{ [ct]: h, [cu]: [bb, "{partitionResult#name}"] }], [cr]: [{ [cs]: cl, [cr]: [{ [cs]: [{ [ct]: h, [cu]: [aV, B] }], [cr]: [{ [cs]: cm, [cr]: [{ [cs]: cn, [cr]: [{ [cs]: bD, error: "Access Points do not support S3 Accelerate", [cq]: f }, { [cs]: [X, Y], endpoint: { [cx]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint-fips.dualstack.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cy]: bk, [cE]: am }, [cq]: n }, { [cs]: [X, aH], endpoint: { [cx]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint-fips.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cy]: bk, [cE]: am }, [cq]: n }, { [cs]: [aJ, Y], endpoint: { [cx]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint.dualstack.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cy]: bk, [cE]: am }, [cq]: n }, { [cs]: [aJ, aH, Z, ah], endpoint: { [cx]: M, [cy]: bk, [cE]: am }, [cq]: n }, { [cs]: [aJ, aH], endpoint: { [cx]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cy]: bk, [cE]: am }, [cq]: n }], [cq]: o }, be], [cq]: o }, bf], [cq]: o }, { error: "Invalid ARN: The ARN was not for the S3 service, found: {bucketArn#service}", [cq]: f }], [cq]: o }, bg], [cq]: o }, bh], [cq]: o }], [cq]: o }], [cq]: o }, bi], [cq]: o }], [cq]: o }], [cq]: o }, { [cs]: [{ [ct]: y, [cu]: [aW, c] }], [cr]: [{ [cs]: bC, error: "S3 MRAP does not support dual-stack", [cq]: f }, { [cs]: bJ, error: "S3 MRAP does not support FIPS", [cq]: f }, { [cs]: bD, error: "S3 MRAP does not support S3 Accelerate", [cq]: f }, { [cs]: [{ [ct]: e, [cu]: [{ [cv]: "DisableMultiRegionAccessPoints" }, c] }], error: "Invalid configuration: Multi-Region Access Point ARNs are disabled.", [cq]: f }, { [cs]: [{ [ct]: g, [cu]: bz, [cw]: N }], [cr]: [{ [cs]: [{ [ct]: h, [cu]: [{ [ct]: i, [cu]: [{ [cv]: N }, j] }, { [ct]: i, [cu]: [aT, "partition"] }] }], [cr]: [{ endpoint: { [cx]: "https://{accessPointName}.accesspoint.s3-global.{mrapPartition#dnsSuffix}", [cy]: { [cA]: [{ [cB]: c, name: z, [cC]: B, [cF]: ca }] }, [cE]: am }, [cq]: n }], [cq]: o }, { error: "Client was configured for partition `{mrapPartition#name}` but bucket referred to partition `{bucketArn#partition}`", [cq]: f }], [cq]: o }], [cq]: o }, { error: "Invalid Access Point Name", [cq]: f }], [cq]: o }, bj], [cq]: o }, { [cs]: [{ [ct]: h, [cu]: [aV, A] }], [cr]: [{ [cs]: bC, error: "S3 Outposts does not support Dual-stack", [cq]: f }, { [cs]: bJ, error: "S3 Outposts does not support FIPS", [cq]: f }, { [cs]: bD, error: "S3 Outposts does not support S3 Accelerate", [cq]: f }, { [cs]: [{ [ct]: d, [cu]: [{ [ct]: i, [cu]: [aT, "resourceId[4]"] }] }], error: "Invalid Arn: Outpost Access Point ARN contains sub resources", [cq]: f }, { [cs]: [{ [ct]: i, [cu]: cf, [cw]: x }], [cr]: [{ [cs]: bY, [cr]: [ba, { [cs]: cj, [cr]: [{ [cs]: bI, [cr]: [{ [cs]: ck, [cr]: [{ [cs]: cl, [cr]: [{ [cs]: cm, [cr]: [{ [cs]: [{ [ct]: i, [cu]: ci, [cw]: O }], [cr]: [{ [cs]: [{ [ct]: i, [cu]: [aT, "resourceId[3]"], [cw]: L }], [cr]: [{ [cs]: [{ [ct]: h, [cu]: [{ [cv]: O }, K] }], [cr]: [{ [cs]: bE, endpoint: { [cx]: "https://{accessPointName}-{bucketArn#accountId}.{outpostId}.{url#authority}", [cy]: bl, [cE]: am }, [cq]: n }, { endpoint: { [cx]: "https://{accessPointName}-{bucketArn#accountId}.{outpostId}.s3-outposts.{bucketArn#region}.{bucketPartition#dnsSuffix}", [cy]: bl, [cE]: am }, [cq]: n }], [cq]: o }, { error: "Expected an outpost type `accesspoint`, found {outpostType}", [cq]: f }], [cq]: o }, { error: "Invalid ARN: expected an access point name", [cq]: f }], [cq]: o }, { error: "Invalid ARN: Expected a 4-component resource", [cq]: f }], [cq]: o }, bf], [cq]: o }, bg], [cq]: o }, bh], [cq]: o }], [cq]: o }], [cq]: o }, { error: "Invalid ARN: The outpost Id may only contain a-z, A-Z, 0-9 and `-`. Found: `{outpostId}`", [cq]: f }], [cq]: o }, { error: "Invalid ARN: The Outpost Id was not set", [cq]: f }], [cq]: o }, { error: "Invalid ARN: Unrecognized format: {Bucket} (type: {arnType})", [cq]: f }], [cq]: o }, { error: "Invalid ARN: No ARN type specified", [cq]: f }], [cq]: o }, { [cs]: [{ [ct]: k, [cu]: [ad, 0, 4, b], [cw]: P }, { [ct]: h, [cu]: [{ [cv]: P }, "arn:"] }, { [ct]: r, [cu]: [{ [ct]: d, [cu]: [bm] }] }], error: "Invalid ARN: `{Bucket}` was not a valid ARN", [cq]: f }, { [cs]: [{ [ct]: e, [cu]: [ay, c] }, bm], error: "Path-style addressing cannot be used with ARN buckets", [cq]: f }, { [cs]: bG, [cr]: [{ [cs]: bI, [cr]: [{ [cs]: [az], [cr]: [{ [cs]: [Y, ar, X, aA], endpoint: { [cx]: "https://s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [Y, ar, X, aC, aD], [cr]: [{ endpoint: bn, [cq]: n }], [cq]: o }, { [cs]: [Y, ar, X, aC, aG], endpoint: bn, [cq]: n }, { [cs]: [aH, ar, X, aA], endpoint: { [cx]: "https://s3-fips.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [aH, ar, X, aC, aD], [cr]: [{ endpoint: bo, [cq]: n }], [cq]: o }, { [cs]: [aH, ar, X, aC, aG], endpoint: bo, [cq]: n }, { [cs]: [Y, ar, aJ, aA], endpoint: { [cx]: "https://s3.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [Y, ar, aJ, aC, aD], [cr]: [{ endpoint: bp, [cq]: n }], [cq]: o }, { [cs]: [Y, ar, aJ, aC, aG], endpoint: bp, [cq]: n }, { [cs]: [aH, Z, ah, aJ, aA], endpoint: { [cx]: Q, [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [aH, Z, ah, aJ, aC, aD], [cr]: [{ [cs]: cc, endpoint: bq, [cq]: n }, { endpoint: bq, [cq]: n }], [cq]: o }, { [cs]: [aH, Z, ah, aJ, aC, aG], endpoint: bq, [cq]: n }, { [cs]: [aH, ar, aJ, aA], endpoint: { [cx]: R, [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [aH, ar, aJ, aC, aD], [cr]: [{ [cs]: cc, endpoint: { [cx]: R, [cy]: aF, [cE]: am }, [cq]: n }, { endpoint: br, [cq]: n }], [cq]: o }, { [cs]: [aH, ar, aJ, aC, aG], endpoint: br, [cq]: n }], [cq]: o }, { error: "Path-style addressing cannot be used with S3 Accelerate", [cq]: f }], [cq]: o }], [cq]: o }], [cq]: o }, { [cs]: [{ [ct]: d, [cu]: [bs] }, { [ct]: e, [cu]: [bs, c] }], [cr]: [{ [cs]: bI, [cr]: [{ [cs]: co, [cr]: [aX, aY, { [cs]: bE, endpoint: { [cx]: t, [cy]: bt, [cE]: am }, [cq]: n }, { [cs]: bJ, endpoint: { [cx]: "https://s3-object-lambda-fips.{Region}.{partitionResult#dnsSuffix}", [cy]: bt, [cE]: am }, [cq]: n }, { endpoint: { [cx]: "https://s3-object-lambda.{Region}.{partitionResult#dnsSuffix}", [cy]: bt, [cE]: am }, [cq]: n }], [cq]: o }, aS], [cq]: o }], [cq]: o }, { [cs]: [at], [cr]: [{ [cs]: bI, [cr]: [{ [cs]: co, [cr]: [{ [cs]: [X, Y, ar, aA], endpoint: { [cx]: "https://s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}", [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [X, Y, ar, aC, aD], [cr]: [{ endpoint: bu, [cq]: n }], [cq]: o }, { [cs]: [X, Y, ar, aC, aG], endpoint: bu, [cq]: n }, { [cs]: [X, aH, ar, aA], endpoint: { [cx]: "https://s3-fips.us-east-1.{partitionResult#dnsSuffix}", [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [X, aH, ar, aC, aD], [cr]: [{ endpoint: bv, [cq]: n }], [cq]: o }, { [cs]: [X, aH, ar, aC, aG], endpoint: bv, [cq]: n }, { [cs]: [aJ, Y, ar, aA], endpoint: { [cx]: "https://s3.dualstack.us-east-1.{partitionResult#dnsSuffix}", [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [aJ, Y, ar, aC, aD], [cr]: [{ endpoint: bw, [cq]: n }], [cq]: o }, { [cs]: [aJ, Y, ar, aC, aG], endpoint: bw, [cq]: n }, { [cs]: [aJ, aH, Z, ah, aA], endpoint: { [cx]: t, [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [aJ, aH, Z, ah, aC, aD], [cr]: [{ [cs]: cc, endpoint: bx, [cq]: n }, { endpoint: bx, [cq]: n }], [cq]: o }, { [cs]: [aJ, aH, Z, ah, aC, aG], endpoint: bx, [cq]: n }, { [cs]: [aJ, aH, ar, aA], endpoint: { [cx]: S, [cy]: aB, [cE]: am }, [cq]: n }, { [cs]: [aJ, aH, ar, aC, aD], [cr]: [{ [cs]: cc, endpoint: { [cx]: S, [cy]: aF, [cE]: am }, [cq]: n }, { endpoint: by, [cq]: n }], [cq]: o }, { [cs]: [aJ, aH, ar, aC, aG], endpoint: by, [cq]: n }], [cq]: o }, aS], [cq]: o }], [cq]: o }], [cq]: o }, { error: "A region must be set when sending requests to S3.", [cq]: f }] };
const ruleSet = _data;
const cache = new EndpointCache({
  size: 50,
  params: [
    "Accelerate",
    "Bucket",
    "DisableAccessPoints",
    "DisableMultiRegionAccessPoints",
    "DisableS3ExpressSessionAuth",
    "Endpoint",
    "ForcePathStyle",
    "Region",
    "UseArnRegion",
    "UseDualStack",
    "UseFIPS",
    "UseGlobalEndpoint",
    "UseObjectLambdaEndpoint",
    "UseS3ExpressControlEndpoint"
  ]
});
const defaultEndpointResolver = (endpointParams, context = {}) => {
  return cache.get(endpointParams, () => resolveEndpoint(ruleSet, {
    endpointParams,
    logger: context.logger
  }));
};
customEndpointFunctions.aws = awsEndpointFunctions;
const createEndpointRuleSetHttpAuthSchemeParametersProvider = (defaultHttpAuthSchemeParametersProvider) => async (config, context, input) => {
  var _a, _b, _c;
  if (!input) {
    throw new Error(`Could not find \`input\` for \`defaultEndpointRuleSetHttpAuthSchemeParametersProvider\``);
  }
  const defaultParameters = await defaultHttpAuthSchemeParametersProvider(config, context, input);
  const instructionsFn = (_c = (_b = (_a = getSmithyContext(context)) == null ? void 0 : _a.commandInstance) == null ? void 0 : _b.constructor) == null ? void 0 : _c.getEndpointParameterInstructions;
  if (!instructionsFn) {
    throw new Error(`getEndpointParameterInstructions() is not defined on \`${context.commandName}\``);
  }
  const endpointParameters = await resolveParams(input, { getEndpointParameterInstructions: instructionsFn }, config);
  return Object.assign(defaultParameters, endpointParameters);
};
const _defaultS3HttpAuthSchemeParametersProvider = async (config, context, input) => {
  return {
    operation: getSmithyContext(context).operation,
    region: await normalizeProvider$1(config.region)() || (() => {
      throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
    })()
  };
};
const defaultS3HttpAuthSchemeParametersProvider = createEndpointRuleSetHttpAuthSchemeParametersProvider(_defaultS3HttpAuthSchemeParametersProvider);
function createAwsAuthSigv4HttpAuthOption(authParameters) {
  return {
    schemeId: "aws.auth#sigv4",
    signingProperties: {
      name: "s3",
      region: authParameters.region
    },
    propertiesExtractor: (config, context) => ({
      signingProperties: {
        config,
        context
      }
    })
  };
}
function createAwsAuthSigv4aHttpAuthOption(authParameters) {
  return {
    schemeId: "aws.auth#sigv4a",
    signingProperties: {
      name: "s3",
      region: authParameters.region
    },
    propertiesExtractor: (config, context) => ({
      signingProperties: {
        config,
        context
      }
    })
  };
}
const createEndpointRuleSetHttpAuthSchemeProvider = (defaultEndpointResolver2, defaultHttpAuthSchemeResolver, createHttpAuthOptionFunctions) => {
  const endpointRuleSetHttpAuthSchemeProvider = (authParameters) => {
    var _a;
    const endpoint = defaultEndpointResolver2(authParameters);
    const authSchemes = (_a = endpoint.properties) == null ? void 0 : _a.authSchemes;
    if (!authSchemes) {
      return defaultHttpAuthSchemeResolver(authParameters);
    }
    const options = [];
    for (const scheme of authSchemes) {
      const { name: resolvedName, properties = {}, ...rest } = scheme;
      const name = resolvedName.toLowerCase();
      if (resolvedName !== name) {
        console.warn(`HttpAuthScheme has been normalized with lowercasing: \`${resolvedName}\` to \`${name}\``);
      }
      let schemeId;
      if (name === "sigv4a") {
        schemeId = "aws.auth#sigv4a";
        const sigv4Present = authSchemes.find((s2) => {
          const name2 = s2.name.toLowerCase();
          return name2 !== "sigv4a" && name2.startsWith("sigv4");
        });
        if (SignatureV4MultiRegion.sigv4aDependency() === "none" && sigv4Present) {
          continue;
        }
      } else if (name.startsWith("sigv4")) {
        schemeId = "aws.auth#sigv4";
      } else {
        throw new Error(`Unknown HttpAuthScheme found in \`@smithy.rules#endpointRuleSet\`: \`${name}\``);
      }
      const createOption = createHttpAuthOptionFunctions[schemeId];
      if (!createOption) {
        throw new Error(`Could not find HttpAuthOption create function for \`${schemeId}\``);
      }
      const option = createOption(authParameters);
      option.schemeId = schemeId;
      option.signingProperties = { ...option.signingProperties || {}, ...rest, ...properties };
      options.push(option);
    }
    return options;
  };
  return endpointRuleSetHttpAuthSchemeProvider;
};
const _defaultS3HttpAuthSchemeProvider = (authParameters) => {
  const options = [];
  switch (authParameters.operation) {
    default: {
      options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
      options.push(createAwsAuthSigv4aHttpAuthOption(authParameters));
    }
  }
  return options;
};
const defaultS3HttpAuthSchemeProvider = createEndpointRuleSetHttpAuthSchemeProvider(defaultEndpointResolver, _defaultS3HttpAuthSchemeProvider, {
  "aws.auth#sigv4": createAwsAuthSigv4HttpAuthOption,
  "aws.auth#sigv4a": createAwsAuthSigv4aHttpAuthOption
});
const resolveHttpAuthSchemeConfig = (config) => {
  const config_0 = resolveAwsSdkSigV4Config(config);
  const config_1 = resolveAwsSdkSigV4AConfig(config_0);
  return Object.assign(config_1, {
    authSchemePreference: normalizeProvider$1(config.authSchemePreference ?? [])
  });
};
const resolveClientEndpointParameters = (options) => {
  return Object.assign(options, {
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    forcePathStyle: options.forcePathStyle ?? false,
    useAccelerateEndpoint: options.useAccelerateEndpoint ?? false,
    useGlobalEndpoint: options.useGlobalEndpoint ?? false,
    disableMultiregionAccessPoints: options.disableMultiregionAccessPoints ?? false,
    defaultSigningName: "s3"
  });
};
const commonParams = {
  ForcePathStyle: { type: "clientContextParams", name: "forcePathStyle" },
  UseArnRegion: { type: "clientContextParams", name: "useArnRegion" },
  DisableMultiRegionAccessPoints: { type: "clientContextParams", name: "disableMultiregionAccessPoints" },
  Accelerate: { type: "clientContextParams", name: "useAccelerateEndpoint" },
  DisableS3ExpressSessionAuth: { type: "clientContextParams", name: "disableS3ExpressSessionAuth" },
  UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
  UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
  Endpoint: { type: "builtInParams", name: "endpoint" },
  Region: { type: "builtInParams", name: "region" },
  UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
};
class S3ServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, S3ServiceException.prototype);
  }
}
class NoSuchUpload extends S3ServiceException {
  constructor(opts) {
    super({
      name: "NoSuchUpload",
      $fault: "client",
      ...opts
    });
    __publicField(this, "name", "NoSuchUpload");
    __publicField(this, "$fault", "client");
    Object.setPrototypeOf(this, NoSuchUpload.prototype);
  }
}
class ObjectNotInActiveTierError extends S3ServiceException {
  constructor(opts) {
    super({
      name: "ObjectNotInActiveTierError",
      $fault: "client",
      ...opts
    });
    __publicField(this, "name", "ObjectNotInActiveTierError");
    __publicField(this, "$fault", "client");
    Object.setPrototypeOf(this, ObjectNotInActiveTierError.prototype);
  }
}
class BucketAlreadyExists extends S3ServiceException {
  constructor(opts) {
    super({
      name: "BucketAlreadyExists",
      $fault: "client",
      ...opts
    });
    __publicField(this, "name", "BucketAlreadyExists");
    __publicField(this, "$fault", "client");
    Object.setPrototypeOf(this, BucketAlreadyExists.prototype);
  }
}
class BucketAlreadyOwnedByYou extends S3ServiceException {
  constructor(opts) {
    super({
      name: "BucketAlreadyOwnedByYou",
      $fault: "client",
      ...opts
    });
    __publicField(this, "name", "BucketAlreadyOwnedByYou");
    __publicField(this, "$fault", "client");
    Object.setPrototypeOf(this, BucketAlreadyOwnedByYou.prototype);
  }
}
class NoSuchBucket extends S3ServiceException {
  constructor(opts) {
    super({
      name: "NoSuchBucket",
      $fault: "client",
      ...opts
    });
    __publicField(this, "name", "NoSuchBucket");
    __publicField(this, "$fault", "client");
    Object.setPrototypeOf(this, NoSuchBucket.prototype);
  }
}
var AnalyticsFilter;
(function(AnalyticsFilter2) {
  AnalyticsFilter2.visit = (value, visitor) => {
    if (value.Prefix !== void 0)
      return visitor.Prefix(value.Prefix);
    if (value.Tag !== void 0)
      return visitor.Tag(value.Tag);
    if (value.And !== void 0)
      return visitor.And(value.And);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(AnalyticsFilter || (AnalyticsFilter = {}));
var MetricsFilter;
(function(MetricsFilter2) {
  MetricsFilter2.visit = (value, visitor) => {
    if (value.Prefix !== void 0)
      return visitor.Prefix(value.Prefix);
    if (value.Tag !== void 0)
      return visitor.Tag(value.Tag);
    if (value.AccessPointArn !== void 0)
      return visitor.AccessPointArn(value.AccessPointArn);
    if (value.And !== void 0)
      return visitor.And(value.And);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(MetricsFilter || (MetricsFilter = {}));
class InvalidObjectState extends S3ServiceException {
  constructor(opts) {
    super({
      name: "InvalidObjectState",
      $fault: "client",
      ...opts
    });
    __publicField(this, "name", "InvalidObjectState");
    __publicField(this, "$fault", "client");
    __publicField(this, "StorageClass");
    __publicField(this, "AccessTier");
    Object.setPrototypeOf(this, InvalidObjectState.prototype);
    this.StorageClass = opts.StorageClass;
    this.AccessTier = opts.AccessTier;
  }
}
class NoSuchKey extends S3ServiceException {
  constructor(opts) {
    super({
      name: "NoSuchKey",
      $fault: "client",
      ...opts
    });
    __publicField(this, "name", "NoSuchKey");
    __publicField(this, "$fault", "client");
    Object.setPrototypeOf(this, NoSuchKey.prototype);
  }
}
class NotFound extends S3ServiceException {
  constructor(opts) {
    super({
      name: "NotFound",
      $fault: "client",
      ...opts
    });
    __publicField(this, "name", "NotFound");
    __publicField(this, "$fault", "client");
    Object.setPrototypeOf(this, NotFound.prototype);
  }
}
const SessionCredentialsFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SecretAccessKey && { SecretAccessKey: SENSITIVE_STRING },
  ...obj.SessionToken && { SessionToken: SENSITIVE_STRING }
});
const CreateSessionOutputFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING },
  ...obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING },
  ...obj.Credentials && { Credentials: SessionCredentialsFilterSensitiveLog(obj.Credentials) }
});
const CreateSessionRequestFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING },
  ...obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING }
});
const GetObjectOutputFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING }
});
const GetObjectRequestFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SSECustomerKey && { SSECustomerKey: SENSITIVE_STRING }
});
class EncryptionTypeMismatch extends S3ServiceException {
  constructor(opts) {
    super({
      name: "EncryptionTypeMismatch",
      $fault: "client",
      ...opts
    });
    __publicField(this, "name", "EncryptionTypeMismatch");
    __publicField(this, "$fault", "client");
    Object.setPrototypeOf(this, EncryptionTypeMismatch.prototype);
  }
}
class InvalidRequest extends S3ServiceException {
  constructor(opts) {
    super({
      name: "InvalidRequest",
      $fault: "client",
      ...opts
    });
    __publicField(this, "name", "InvalidRequest");
    __publicField(this, "$fault", "client");
    Object.setPrototypeOf(this, InvalidRequest.prototype);
  }
}
class InvalidWriteOffset extends S3ServiceException {
  constructor(opts) {
    super({
      name: "InvalidWriteOffset",
      $fault: "client",
      ...opts
    });
    __publicField(this, "name", "InvalidWriteOffset");
    __publicField(this, "$fault", "client");
    Object.setPrototypeOf(this, InvalidWriteOffset.prototype);
  }
}
class TooManyParts extends S3ServiceException {
  constructor(opts) {
    super({
      name: "TooManyParts",
      $fault: "client",
      ...opts
    });
    __publicField(this, "name", "TooManyParts");
    __publicField(this, "$fault", "client");
    Object.setPrototypeOf(this, TooManyParts.prototype);
  }
}
class ObjectAlreadyInActiveTierError extends S3ServiceException {
  constructor(opts) {
    super({
      name: "ObjectAlreadyInActiveTierError",
      $fault: "client",
      ...opts
    });
    __publicField(this, "name", "ObjectAlreadyInActiveTierError");
    __publicField(this, "$fault", "client");
    Object.setPrototypeOf(this, ObjectAlreadyInActiveTierError.prototype);
  }
}
var SelectObjectContentEventStream;
(function(SelectObjectContentEventStream2) {
  SelectObjectContentEventStream2.visit = (value, visitor) => {
    if (value.Records !== void 0)
      return visitor.Records(value.Records);
    if (value.Stats !== void 0)
      return visitor.Stats(value.Stats);
    if (value.Progress !== void 0)
      return visitor.Progress(value.Progress);
    if (value.Cont !== void 0)
      return visitor.Cont(value.Cont);
    if (value.End !== void 0)
      return visitor.End(value.End);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(SelectObjectContentEventStream || (SelectObjectContentEventStream = {}));
const PutObjectOutputFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING },
  ...obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING }
});
const PutObjectRequestFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SSECustomerKey && { SSECustomerKey: SENSITIVE_STRING },
  ...obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING },
  ...obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING }
});
const se_CreateSessionCommand = async (input, context) => {
  const b2 = requestBuilder(input, context);
  const headers = map({}, isSerializableHeaderValue, {
    [_xacsm]: input[_SM],
    [_xasse]: input[_SSE],
    [_xasseakki]: input[_SSEKMSKI],
    [_xassec]: input[_SSEKMSEC],
    [_xassebke]: [() => isSerializableHeaderValue(input[_BKE]), () => input[_BKE].toString()]
  });
  b2.bp("/");
  b2.p("Bucket", () => input.Bucket, "{Bucket}", false);
  const query = map({
    [_s]: [, ""]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
};
const se_DeleteObjectCommand = async (input, context) => {
  const b2 = requestBuilder(input, context);
  const headers = map({}, isSerializableHeaderValue, {
    [_xam]: input[_MFA],
    [_xarp]: input[_RP],
    [_xabgr]: [() => isSerializableHeaderValue(input[_BGR]), () => input[_BGR].toString()],
    [_xaebo]: input[_EBO],
    [_im]: input[_IM],
    [_xaimlmt]: [() => isSerializableHeaderValue(input[_IMLMT]), () => dateToUtcString(input[_IMLMT]).toString()],
    [_xaims]: [() => isSerializableHeaderValue(input[_IMS]), () => input[_IMS].toString()]
  });
  b2.bp("/{Key+}");
  b2.p("Bucket", () => input.Bucket, "{Bucket}", false);
  b2.p("Key", () => input.Key, "{Key+}", true);
  const query = map({
    [_xi]: [, "DeleteObject"],
    [_vI]: [, input[_VI]]
  });
  let body;
  b2.m("DELETE").h(headers).q(query).b(body);
  return b2.build();
};
const se_GetObjectCommand = async (input, context) => {
  const b2 = requestBuilder(input, context);
  const headers = map({}, isSerializableHeaderValue, {
    [_im]: input[_IM],
    [_ims]: [() => isSerializableHeaderValue(input[_IMSf]), () => dateToUtcString(input[_IMSf]).toString()],
    [_inm]: input[_INM],
    [_ius]: [() => isSerializableHeaderValue(input[_IUS]), () => dateToUtcString(input[_IUS]).toString()],
    [_ra]: input[_R],
    [_xasseca]: input[_SSECA],
    [_xasseck]: input[_SSECK],
    [_xasseckm]: input[_SSECKMD],
    [_xarp]: input[_RP],
    [_xaebo]: input[_EBO],
    [_xacm]: input[_CM]
  });
  b2.bp("/{Key+}");
  b2.p("Bucket", () => input.Bucket, "{Bucket}", false);
  b2.p("Key", () => input.Key, "{Key+}", true);
  const query = map({
    [_xi]: [, "GetObject"],
    [_rcc]: [, input[_RCC]],
    [_rcd]: [, input[_RCD]],
    [_rce]: [, input[_RCE]],
    [_rcl]: [, input[_RCL]],
    [_rct]: [, input[_RCT]],
    [_re]: [() => input.ResponseExpires !== void 0, () => dateToUtcString(input[_RE]).toString()],
    [_vI]: [, input[_VI]],
    [_pN]: [() => input.PartNumber !== void 0, () => input[_PN].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
};
const se_ListObjectsV2Command = async (input, context) => {
  const b2 = requestBuilder(input, context);
  const headers = map({}, isSerializableHeaderValue, {
    [_xarp]: input[_RP],
    [_xaebo]: input[_EBO],
    [_xaooa]: [() => isSerializableHeaderValue(input[_OOA]), () => (input[_OOA] || []).map(quoteHeader).join(", ")]
  });
  b2.bp("/");
  b2.p("Bucket", () => input.Bucket, "{Bucket}", false);
  const query = map({
    [_lt]: [, "2"],
    [_de]: [, input[_D]],
    [_et]: [, input[_ET]],
    [_mk]: [() => input.MaxKeys !== void 0, () => input[_MK].toString()],
    [_pr]: [, input[_P]],
    [_ct_]: [, input[_CTon]],
    [_fo]: [() => input.FetchOwner !== void 0, () => input[_FO].toString()],
    [_sa]: [, input[_SA]]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
};
const se_PutObjectCommand = async (input, context) => {
  const b2 = requestBuilder(input, context);
  const headers = map({}, isSerializableHeaderValue, {
    ...input.Metadata !== void 0 && Object.keys(input.Metadata).reduce((acc, suffix) => {
      acc[`x-amz-meta-${suffix.toLowerCase()}`] = input.Metadata[suffix];
      return acc;
    }, {}),
    [_ct]: input[_CTo] || "application/octet-stream",
    [_xaa]: input[_ACL],
    [_cc]: input[_CC],
    [_cd]: input[_CD],
    [_ce]: input[_CE],
    [_cl]: input[_CL],
    [_cl_]: [() => isSerializableHeaderValue(input[_CLo]), () => input[_CLo].toString()],
    [_cm]: input[_CMD],
    [_xasca]: input[_CA],
    [_xacc]: input[_CCRC],
    [_xacc_]: input[_CCRCC],
    [_xacc__]: input[_CCRCNVME],
    [_xacs]: input[_CSHA],
    [_xacs_]: input[_CSHAh],
    [_e]: [() => isSerializableHeaderValue(input[_E]), () => dateToUtcString(input[_E]).toString()],
    [_im]: input[_IM],
    [_inm]: input[_INM],
    [_xagfc]: input[_GFC],
    [_xagr]: input[_GR],
    [_xagra]: input[_GRACP],
    [_xagwa]: input[_GWACP],
    [_xawob]: [() => isSerializableHeaderValue(input[_WOB]), () => input[_WOB].toString()],
    [_xasse]: input[_SSE],
    [_xasc]: input[_SC],
    [_xawrl]: input[_WRL],
    [_xasseca]: input[_SSECA],
    [_xasseck]: input[_SSECK],
    [_xasseckm]: input[_SSECKMD],
    [_xasseakki]: input[_SSEKMSKI],
    [_xassec]: input[_SSEKMSEC],
    [_xassebke]: [() => isSerializableHeaderValue(input[_BKE]), () => input[_BKE].toString()],
    [_xarp]: input[_RP],
    [_xat]: input[_T],
    [_xaolm]: input[_OLM],
    [_xaolrud]: [() => isSerializableHeaderValue(input[_OLRUD]), () => serializeDateTime(input[_OLRUD]).toString()],
    [_xaollh]: input[_OLLHS],
    [_xaebo]: input[_EBO]
  });
  b2.bp("/{Key+}");
  b2.p("Bucket", () => input.Bucket, "{Bucket}", false);
  b2.p("Key", () => input.Key, "{Key+}", true);
  const query = map({
    [_xi]: [, "PutObject"]
  });
  let body;
  let contents;
  if (input.Body !== void 0) {
    contents = input.Body;
    body = contents;
  }
  b2.m("PUT").h(headers).q(query).b(body);
  return b2.build();
};
const de_CreateSessionCommand = async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output),
    [_SSE]: [, output.headers[_xasse]],
    [_SSEKMSKI]: [, output.headers[_xasseakki]],
    [_SSEKMSEC]: [, output.headers[_xassec]],
    [_BKE]: [() => void 0 !== output.headers[_xassebke], () => parseBoolean(output.headers[_xassebke])]
  });
  const data = expectNonNull(expectObject(await parseXmlBody(output.body, context)), "body");
  if (data[_C] != null) {
    contents[_C] = de_SessionCredentials(data[_C]);
  }
  return contents;
};
const de_DeleteObjectCommand = async (output, context) => {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output),
    [_DM]: [() => void 0 !== output.headers[_xadm], () => parseBoolean(output.headers[_xadm])],
    [_VI]: [, output.headers[_xavi]],
    [_RC]: [, output.headers[_xarc]]
  });
  await collectBody$1(output.body, context);
  return contents;
};
const de_GetObjectCommand = async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output),
    [_DM]: [() => void 0 !== output.headers[_xadm], () => parseBoolean(output.headers[_xadm])],
    [_AR]: [, output.headers[_ar]],
    [_Exp]: [, output.headers[_xae]],
    [_Re]: [, output.headers[_xar]],
    [_LM]: [() => void 0 !== output.headers[_lm], () => expectNonNull(parseRfc7231DateTime(output.headers[_lm]))],
    [_CLo]: [() => void 0 !== output.headers[_cl_], () => strictParseLong(output.headers[_cl_])],
    [_ETa]: [, output.headers[_eta]],
    [_CCRC]: [, output.headers[_xacc]],
    [_CCRCC]: [, output.headers[_xacc_]],
    [_CCRCNVME]: [, output.headers[_xacc__]],
    [_CSHA]: [, output.headers[_xacs]],
    [_CSHAh]: [, output.headers[_xacs_]],
    [_CT]: [, output.headers[_xact]],
    [_MM]: [() => void 0 !== output.headers[_xamm], () => strictParseInt32(output.headers[_xamm])],
    [_VI]: [, output.headers[_xavi]],
    [_CC]: [, output.headers[_cc]],
    [_CD]: [, output.headers[_cd]],
    [_CE]: [, output.headers[_ce]],
    [_CL]: [, output.headers[_cl]],
    [_CR]: [, output.headers[_cr]],
    [_CTo]: [, output.headers[_ct]],
    [_E]: [() => void 0 !== output.headers[_e], () => expectNonNull(parseRfc7231DateTime(output.headers[_e]))],
    [_ES]: [, output.headers[_ex]],
    [_WRL]: [, output.headers[_xawrl]],
    [_SSE]: [, output.headers[_xasse]],
    [_SSECA]: [, output.headers[_xasseca]],
    [_SSECKMD]: [, output.headers[_xasseckm]],
    [_SSEKMSKI]: [, output.headers[_xasseakki]],
    [_BKE]: [() => void 0 !== output.headers[_xassebke], () => parseBoolean(output.headers[_xassebke])],
    [_SC]: [, output.headers[_xasc]],
    [_RC]: [, output.headers[_xarc]],
    [_RS]: [, output.headers[_xars]],
    [_PC]: [() => void 0 !== output.headers[_xampc], () => strictParseInt32(output.headers[_xampc])],
    [_TC]: [() => void 0 !== output.headers[_xatc], () => strictParseInt32(output.headers[_xatc])],
    [_OLM]: [, output.headers[_xaolm]],
    [_OLRUD]: [
      () => void 0 !== output.headers[_xaolrud],
      () => expectNonNull(parseRfc3339DateTimeWithOffset(output.headers[_xaolrud]))
    ],
    [_OLLHS]: [, output.headers[_xaollh]],
    Metadata: [
      ,
      Object.keys(output.headers).filter((header) => header.startsWith("x-amz-meta-")).reduce((acc, header) => {
        acc[header.substring(11)] = output.headers[header];
        return acc;
      }, {})
    ]
  });
  const data = output.body;
  context.sdkStreamMixin(data);
  contents.Body = data;
  return contents;
};
const de_ListObjectsV2Command = async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output),
    [_RC]: [, output.headers[_xarc]]
  });
  const data = expectNonNull(expectObject(await parseXmlBody(output.body, context)), "body");
  if (data.CommonPrefixes === "") {
    contents[_CP] = [];
  } else if (data[_CP] != null) {
    contents[_CP] = de_CommonPrefixList(getArrayIfSingleItem(data[_CP]));
  }
  if (data.Contents === "") {
    contents[_Co] = [];
  } else if (data[_Co] != null) {
    contents[_Co] = de_ObjectList(getArrayIfSingleItem(data[_Co]));
  }
  if (data[_CTon] != null) {
    contents[_CTon] = expectString(data[_CTon]);
  }
  if (data[_D] != null) {
    contents[_D] = expectString(data[_D]);
  }
  if (data[_ET] != null) {
    contents[_ET] = expectString(data[_ET]);
  }
  if (data[_IT] != null) {
    contents[_IT] = parseBoolean(data[_IT]);
  }
  if (data[_KC] != null) {
    contents[_KC] = strictParseInt32(data[_KC]);
  }
  if (data[_MK] != null) {
    contents[_MK] = strictParseInt32(data[_MK]);
  }
  if (data[_N] != null) {
    contents[_N] = expectString(data[_N]);
  }
  if (data[_NCT] != null) {
    contents[_NCT] = expectString(data[_NCT]);
  }
  if (data[_P] != null) {
    contents[_P] = expectString(data[_P]);
  }
  if (data[_SA] != null) {
    contents[_SA] = expectString(data[_SA]);
  }
  return contents;
};
const de_PutObjectCommand = async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata(output),
    [_Exp]: [, output.headers[_xae]],
    [_ETa]: [, output.headers[_eta]],
    [_CCRC]: [, output.headers[_xacc]],
    [_CCRCC]: [, output.headers[_xacc_]],
    [_CCRCNVME]: [, output.headers[_xacc__]],
    [_CSHA]: [, output.headers[_xacs]],
    [_CSHAh]: [, output.headers[_xacs_]],
    [_CT]: [, output.headers[_xact]],
    [_SSE]: [, output.headers[_xasse]],
    [_VI]: [, output.headers[_xavi]],
    [_SSECA]: [, output.headers[_xasseca]],
    [_SSECKMD]: [, output.headers[_xasseckm]],
    [_SSEKMSKI]: [, output.headers[_xasseakki]],
    [_SSEKMSEC]: [, output.headers[_xassec]],
    [_BKE]: [() => void 0 !== output.headers[_xassebke], () => parseBoolean(output.headers[_xassebke])],
    [_Si]: [() => void 0 !== output.headers[_xaos], () => strictParseLong(output.headers[_xaos])],
    [_RC]: [, output.headers[_xarc]]
  });
  await collectBody$1(output.body, context);
  return contents;
};
const de_CommandError = async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseXmlErrorBody(output.body, context)
  };
  const errorCode = loadRestXmlErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "NoSuchUpload":
    case "com.amazonaws.s3#NoSuchUpload":
      throw await de_NoSuchUploadRes(parsedOutput);
    case "ObjectNotInActiveTierError":
    case "com.amazonaws.s3#ObjectNotInActiveTierError":
      throw await de_ObjectNotInActiveTierErrorRes(parsedOutput);
    case "BucketAlreadyExists":
    case "com.amazonaws.s3#BucketAlreadyExists":
      throw await de_BucketAlreadyExistsRes(parsedOutput);
    case "BucketAlreadyOwnedByYou":
    case "com.amazonaws.s3#BucketAlreadyOwnedByYou":
      throw await de_BucketAlreadyOwnedByYouRes(parsedOutput);
    case "NoSuchBucket":
    case "com.amazonaws.s3#NoSuchBucket":
      throw await de_NoSuchBucketRes(parsedOutput);
    case "InvalidObjectState":
    case "com.amazonaws.s3#InvalidObjectState":
      throw await de_InvalidObjectStateRes(parsedOutput);
    case "NoSuchKey":
    case "com.amazonaws.s3#NoSuchKey":
      throw await de_NoSuchKeyRes(parsedOutput);
    case "NotFound":
    case "com.amazonaws.s3#NotFound":
      throw await de_NotFoundRes(parsedOutput);
    case "EncryptionTypeMismatch":
    case "com.amazonaws.s3#EncryptionTypeMismatch":
      throw await de_EncryptionTypeMismatchRes(parsedOutput);
    case "InvalidRequest":
    case "com.amazonaws.s3#InvalidRequest":
      throw await de_InvalidRequestRes(parsedOutput);
    case "InvalidWriteOffset":
    case "com.amazonaws.s3#InvalidWriteOffset":
      throw await de_InvalidWriteOffsetRes(parsedOutput);
    case "TooManyParts":
    case "com.amazonaws.s3#TooManyParts":
      throw await de_TooManyPartsRes(parsedOutput);
    case "ObjectAlreadyInActiveTierError":
    case "com.amazonaws.s3#ObjectAlreadyInActiveTierError":
      throw await de_ObjectAlreadyInActiveTierErrorRes(parsedOutput);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError({
        output,
        parsedBody,
        errorCode
      });
  }
};
const throwDefaultError = withBaseException(S3ServiceException);
const de_BucketAlreadyExistsRes = async (parsedOutput, context) => {
  const contents = map({});
  parsedOutput.body;
  const exception = new BucketAlreadyExists({
    $metadata: deserializeMetadata(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
const de_BucketAlreadyOwnedByYouRes = async (parsedOutput, context) => {
  const contents = map({});
  parsedOutput.body;
  const exception = new BucketAlreadyOwnedByYou({
    $metadata: deserializeMetadata(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
const de_EncryptionTypeMismatchRes = async (parsedOutput, context) => {
  const contents = map({});
  parsedOutput.body;
  const exception = new EncryptionTypeMismatch({
    $metadata: deserializeMetadata(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
const de_InvalidObjectStateRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  if (data[_AT] != null) {
    contents[_AT] = expectString(data[_AT]);
  }
  if (data[_SC] != null) {
    contents[_SC] = expectString(data[_SC]);
  }
  const exception = new InvalidObjectState({
    $metadata: deserializeMetadata(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
const de_InvalidRequestRes = async (parsedOutput, context) => {
  const contents = map({});
  parsedOutput.body;
  const exception = new InvalidRequest({
    $metadata: deserializeMetadata(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
const de_InvalidWriteOffsetRes = async (parsedOutput, context) => {
  const contents = map({});
  parsedOutput.body;
  const exception = new InvalidWriteOffset({
    $metadata: deserializeMetadata(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
const de_NoSuchBucketRes = async (parsedOutput, context) => {
  const contents = map({});
  parsedOutput.body;
  const exception = new NoSuchBucket({
    $metadata: deserializeMetadata(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
const de_NoSuchKeyRes = async (parsedOutput, context) => {
  const contents = map({});
  parsedOutput.body;
  const exception = new NoSuchKey({
    $metadata: deserializeMetadata(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
const de_NoSuchUploadRes = async (parsedOutput, context) => {
  const contents = map({});
  parsedOutput.body;
  const exception = new NoSuchUpload({
    $metadata: deserializeMetadata(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
const de_NotFoundRes = async (parsedOutput, context) => {
  const contents = map({});
  parsedOutput.body;
  const exception = new NotFound({
    $metadata: deserializeMetadata(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
const de_ObjectAlreadyInActiveTierErrorRes = async (parsedOutput, context) => {
  const contents = map({});
  parsedOutput.body;
  const exception = new ObjectAlreadyInActiveTierError({
    $metadata: deserializeMetadata(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
const de_ObjectNotInActiveTierErrorRes = async (parsedOutput, context) => {
  const contents = map({});
  parsedOutput.body;
  const exception = new ObjectNotInActiveTierError({
    $metadata: deserializeMetadata(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
const de_TooManyPartsRes = async (parsedOutput, context) => {
  const contents = map({});
  parsedOutput.body;
  const exception = new TooManyParts({
    $metadata: deserializeMetadata(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
const de_ChecksumAlgorithmList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return expectString(entry);
  });
};
const de_CommonPrefix = (output, context) => {
  const contents = {};
  if (output[_P] != null) {
    contents[_P] = expectString(output[_P]);
  }
  return contents;
};
const de_CommonPrefixList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_CommonPrefix(entry);
  });
};
const de__Object = (output, context) => {
  const contents = {};
  if (output[_K] != null) {
    contents[_K] = expectString(output[_K]);
  }
  if (output[_LM] != null) {
    contents[_LM] = expectNonNull(parseRfc3339DateTimeWithOffset(output[_LM]));
  }
  if (output[_ETa] != null) {
    contents[_ETa] = expectString(output[_ETa]);
  }
  if (output.ChecksumAlgorithm === "") {
    contents[_CA] = [];
  } else if (output[_CA] != null) {
    contents[_CA] = de_ChecksumAlgorithmList(getArrayIfSingleItem(output[_CA]));
  }
  if (output[_CT] != null) {
    contents[_CT] = expectString(output[_CT]);
  }
  if (output[_Si] != null) {
    contents[_Si] = strictParseLong(output[_Si]);
  }
  if (output[_SC] != null) {
    contents[_SC] = expectString(output[_SC]);
  }
  if (output[_O] != null) {
    contents[_O] = de_Owner(output[_O]);
  }
  if (output[_RSe] != null) {
    contents[_RSe] = de_RestoreStatus(output[_RSe]);
  }
  return contents;
};
const de_ObjectList = (output, context) => {
  return (output || []).filter((e2) => e2 != null).map((entry) => {
    return de__Object(entry);
  });
};
const de_Owner = (output, context) => {
  const contents = {};
  if (output[_DN] != null) {
    contents[_DN] = expectString(output[_DN]);
  }
  if (output[_ID_] != null) {
    contents[_ID_] = expectString(output[_ID_]);
  }
  return contents;
};
const de_RestoreStatus = (output, context) => {
  const contents = {};
  if (output[_IRIP] != null) {
    contents[_IRIP] = parseBoolean(output[_IRIP]);
  }
  if (output[_RED] != null) {
    contents[_RED] = expectNonNull(parseRfc3339DateTimeWithOffset(output[_RED]));
  }
  return contents;
};
const de_SessionCredentials = (output, context) => {
  const contents = {};
  if (output[_AKI] != null) {
    contents[_AKI] = expectString(output[_AKI]);
  }
  if (output[_SAK] != null) {
    contents[_SAK] = expectString(output[_SAK]);
  }
  if (output[_ST] != null) {
    contents[_ST] = expectString(output[_ST]);
  }
  if (output[_Exp] != null) {
    contents[_Exp] = expectNonNull(parseRfc3339DateTimeWithOffset(output[_Exp]));
  }
  return contents;
};
const deserializeMetadata = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
});
const _ACL = "ACL";
const _AKI = "AccessKeyId";
const _AR = "AcceptRanges";
const _AT = "AccessTier";
const _BGR = "BypassGovernanceRetention";
const _BKE = "BucketKeyEnabled";
const _C = "Credentials";
const _CA = "ChecksumAlgorithm";
const _CC = "CacheControl";
const _CCRC = "ChecksumCRC32";
const _CCRCC = "ChecksumCRC32C";
const _CCRCNVME = "ChecksumCRC64NVME";
const _CD = "ContentDisposition";
const _CE = "ContentEncoding";
const _CL = "ContentLanguage";
const _CLo = "ContentLength";
const _CM = "ChecksumMode";
const _CMD = "ContentMD5";
const _CP = "CommonPrefixes";
const _CR = "ContentRange";
const _CSHA = "ChecksumSHA1";
const _CSHAh = "ChecksumSHA256";
const _CT = "ChecksumType";
const _CTo = "ContentType";
const _CTon = "ContinuationToken";
const _Co = "Contents";
const _D = "Delimiter";
const _DM = "DeleteMarker";
const _DN = "DisplayName";
const _E = "Expires";
const _EBO = "ExpectedBucketOwner";
const _ES = "ExpiresString";
const _ET = "EncodingType";
const _ETa = "ETag";
const _Exp = "Expiration";
const _FO = "FetchOwner";
const _GFC = "GrantFullControl";
const _GR = "GrantRead";
const _GRACP = "GrantReadACP";
const _GWACP = "GrantWriteACP";
const _ID_ = "ID";
const _IM = "IfMatch";
const _IMLMT = "IfMatchLastModifiedTime";
const _IMS = "IfMatchSize";
const _IMSf = "IfModifiedSince";
const _INM = "IfNoneMatch";
const _IRIP = "IsRestoreInProgress";
const _IT = "IsTruncated";
const _IUS = "IfUnmodifiedSince";
const _K = "Key";
const _KC = "KeyCount";
const _LM = "LastModified";
const _MFA = "MFA";
const _MK = "MaxKeys";
const _MM = "MissingMeta";
const _N = "Name";
const _NCT = "NextContinuationToken";
const _O = "Owner";
const _OLLHS = "ObjectLockLegalHoldStatus";
const _OLM = "ObjectLockMode";
const _OLRUD = "ObjectLockRetainUntilDate";
const _OOA = "OptionalObjectAttributes";
const _P = "Prefix";
const _PC = "PartsCount";
const _PN = "PartNumber";
const _R = "Range";
const _RC = "RequestCharged";
const _RCC = "ResponseCacheControl";
const _RCD = "ResponseContentDisposition";
const _RCE = "ResponseContentEncoding";
const _RCL = "ResponseContentLanguage";
const _RCT = "ResponseContentType";
const _RE = "ResponseExpires";
const _RED = "RestoreExpiryDate";
const _RP = "RequestPayer";
const _RS = "ReplicationStatus";
const _RSe = "RestoreStatus";
const _Re = "Restore";
const _SA = "StartAfter";
const _SAK = "SecretAccessKey";
const _SC = "StorageClass";
const _SM = "SessionMode";
const _SSE = "ServerSideEncryption";
const _SSECA = "SSECustomerAlgorithm";
const _SSECK = "SSECustomerKey";
const _SSECKMD = "SSECustomerKeyMD5";
const _SSEKMSEC = "SSEKMSEncryptionContext";
const _SSEKMSKI = "SSEKMSKeyId";
const _ST = "SessionToken";
const _Si = "Size";
const _T = "Tagging";
const _TC = "TagCount";
const _VI = "VersionId";
const _WOB = "WriteOffsetBytes";
const _WRL = "WebsiteRedirectLocation";
const _ar = "accept-ranges";
const _cc = "cache-control";
const _cd = "content-disposition";
const _ce = "content-encoding";
const _cl = "content-language";
const _cl_ = "content-length";
const _cm = "content-md5";
const _cr = "content-range";
const _ct = "content-type";
const _ct_ = "continuation-token";
const _de = "delimiter";
const _e = "expires";
const _et = "encoding-type";
const _eta = "etag";
const _ex = "expiresstring";
const _fo = "fetch-owner";
const _im = "if-match";
const _ims = "if-modified-since";
const _inm = "if-none-match";
const _ius = "if-unmodified-since";
const _lm = "last-modified";
const _lt = "list-type";
const _mk = "max-keys";
const _pN = "partNumber";
const _pr = "prefix";
const _ra = "range";
const _rcc = "response-cache-control";
const _rcd = "response-content-disposition";
const _rce = "response-content-encoding";
const _rcl = "response-content-language";
const _rct = "response-content-type";
const _re = "response-expires";
const _s = "session";
const _sa = "start-after";
const _vI = "versionId";
const _xaa = "x-amz-acl";
const _xabgr = "x-amz-bypass-governance-retention";
const _xacc = "x-amz-checksum-crc32";
const _xacc_ = "x-amz-checksum-crc32c";
const _xacc__ = "x-amz-checksum-crc64nvme";
const _xacm = "x-amz-checksum-mode";
const _xacs = "x-amz-checksum-sha1";
const _xacs_ = "x-amz-checksum-sha256";
const _xacsm = "x-amz-create-session-mode";
const _xact = "x-amz-checksum-type";
const _xadm = "x-amz-delete-marker";
const _xae = "x-amz-expiration";
const _xaebo = "x-amz-expected-bucket-owner";
const _xagfc = "x-amz-grant-full-control";
const _xagr = "x-amz-grant-read";
const _xagra = "x-amz-grant-read-acp";
const _xagwa = "x-amz-grant-write-acp";
const _xaimlmt = "x-amz-if-match-last-modified-time";
const _xaims = "x-amz-if-match-size";
const _xam = "x-amz-mfa";
const _xamm = "x-amz-missing-meta";
const _xampc = "x-amz-mp-parts-count";
const _xaollh = "x-amz-object-lock-legal-hold";
const _xaolm = "x-amz-object-lock-mode";
const _xaolrud = "x-amz-object-lock-retain-until-date";
const _xaooa = "x-amz-optional-object-attributes";
const _xaos = "x-amz-object-size";
const _xar = "x-amz-restore";
const _xarc = "x-amz-request-charged";
const _xarp = "x-amz-request-payer";
const _xars = "x-amz-replication-status";
const _xasc = "x-amz-storage-class";
const _xasca = "x-amz-sdk-checksum-algorithm";
const _xasse = "x-amz-server-side-encryption";
const _xasseakki = "x-amz-server-side-encryption-aws-kms-key-id";
const _xassebke = "x-amz-server-side-encryption-bucket-key-enabled";
const _xassec = "x-amz-server-side-encryption-context";
const _xasseca = "x-amz-server-side-encryption-customer-algorithm";
const _xasseck = "x-amz-server-side-encryption-customer-key";
const _xasseckm = "x-amz-server-side-encryption-customer-key-md5";
const _xat = "x-amz-tagging";
const _xatc = "x-amz-tagging-count";
const _xavi = "x-amz-version-id";
const _xawob = "x-amz-write-offset-bytes";
const _xawrl = "x-amz-website-redirect-location";
const _xi = "x-id";
class CreateSessionCommand extends Command.classBuilder().ep({
  ...commonParams,
  DisableS3ExpressSessionAuth: { type: "staticContextParams", value: true },
  Bucket: { type: "contextParams", name: "Bucket" }
}).m(function(Command2, cs2, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions()),
    getThrow200ExceptionsPlugin(config)
  ];
}).s("AmazonS3", "CreateSession", {}).n("S3Client", "CreateSessionCommand").f(CreateSessionRequestFilterSensitiveLog, CreateSessionOutputFilterSensitiveLog).ser(se_CreateSessionCommand).de(de_CreateSessionCommand).build() {
}
const version = "3.826.0";
const packageInfo = {
  version
};
const fallbackWindow = {};
function locateWindow() {
  if (typeof window !== "undefined") {
    return window;
  } else if (typeof self !== "undefined") {
    return self;
  }
  return fallbackWindow;
}
const createDefaultUserAgentProvider = ({ serviceId, clientVersion }) => async (config) => {
  var _a, _b, _c, _d, _e2, _f;
  const parsedUA = typeof window !== "undefined" && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) ? Bowser.parse(window.navigator.userAgent) : void 0;
  const sections = [
    ["aws-sdk-js", clientVersion],
    ["ua", "2.1"],
    [`os/${((_b = parsedUA == null ? void 0 : parsedUA.os) == null ? void 0 : _b.name) || "other"}`, (_c = parsedUA == null ? void 0 : parsedUA.os) == null ? void 0 : _c.version],
    ["lang/js"],
    ["md/browser", `${((_d = parsedUA == null ? void 0 : parsedUA.browser) == null ? void 0 : _d.name) ?? "unknown"}_${((_e2 = parsedUA == null ? void 0 : parsedUA.browser) == null ? void 0 : _e2.version) ?? "unknown"}`]
  ];
  if (serviceId) {
    sections.push([`api/${serviceId}`, clientVersion]);
  }
  const appId = await ((_f = config == null ? void 0 : config.userAgentAppId) == null ? void 0 : _f.call(config));
  if (appId) {
    sections.push([`app/${appId}`]);
  }
  return sections;
};
const getRuntimeConfig$1 = (config) => {
  return {
    apiVersion: "2006-03-01",
    base64Decoder: (config == null ? void 0 : config.base64Decoder) ?? fromBase64,
    base64Encoder: (config == null ? void 0 : config.base64Encoder) ?? toBase64,
    disableHostPrefix: (config == null ? void 0 : config.disableHostPrefix) ?? false,
    endpointProvider: (config == null ? void 0 : config.endpointProvider) ?? defaultEndpointResolver,
    extensions: (config == null ? void 0 : config.extensions) ?? [],
    getAwsChunkedEncodingStream: (config == null ? void 0 : config.getAwsChunkedEncodingStream) ?? getAwsChunkedEncodingStream,
    httpAuthSchemeProvider: (config == null ? void 0 : config.httpAuthSchemeProvider) ?? defaultS3HttpAuthSchemeProvider,
    httpAuthSchemes: (config == null ? void 0 : config.httpAuthSchemes) ?? [
      {
        schemeId: "aws.auth#sigv4",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
        signer: new AwsSdkSigV4Signer()
      },
      {
        schemeId: "aws.auth#sigv4a",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4a"),
        signer: new AwsSdkSigV4ASigner()
      }
    ],
    logger: (config == null ? void 0 : config.logger) ?? new NoOpLogger(),
    sdkStreamMixin: (config == null ? void 0 : config.sdkStreamMixin) ?? sdkStreamMixin,
    serviceId: (config == null ? void 0 : config.serviceId) ?? "S3",
    signerConstructor: (config == null ? void 0 : config.signerConstructor) ?? SignatureV4MultiRegion,
    signingEscapePath: (config == null ? void 0 : config.signingEscapePath) ?? false,
    urlParser: (config == null ? void 0 : config.urlParser) ?? parseUrl,
    useArnRegion: (config == null ? void 0 : config.useArnRegion) ?? false,
    utf8Decoder: (config == null ? void 0 : config.utf8Decoder) ?? fromUtf8,
    utf8Encoder: (config == null ? void 0 : config.utf8Encoder) ?? toUtf8
  };
};
const getRuntimeConfig = (config) => {
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode);
  const clientSharedValues = getRuntimeConfig$1(config);
  return {
    ...clientSharedValues,
    ...config,
    runtime: "browser",
    defaultsMode,
    bodyLengthChecker: (config == null ? void 0 : config.bodyLengthChecker) ?? calculateBodyLength,
    credentialDefaultProvider: (config == null ? void 0 : config.credentialDefaultProvider) ?? ((_) => () => Promise.reject(new Error("Credential is missing"))),
    defaultUserAgentProvider: (config == null ? void 0 : config.defaultUserAgentProvider) ?? createDefaultUserAgentProvider({ serviceId: clientSharedValues.serviceId, clientVersion: packageInfo.version }),
    eventStreamSerdeProvider: (config == null ? void 0 : config.eventStreamSerdeProvider) ?? eventStreamSerdeProvider,
    maxAttempts: (config == null ? void 0 : config.maxAttempts) ?? DEFAULT_MAX_ATTEMPTS,
    md5: (config == null ? void 0 : config.md5) ?? Md5,
    region: (config == null ? void 0 : config.region) ?? invalidProvider("Region is missing"),
    requestHandler: FetchHttpHandler.create((config == null ? void 0 : config.requestHandler) ?? defaultConfigProvider),
    retryMode: (config == null ? void 0 : config.retryMode) ?? (async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE),
    sha1: (config == null ? void 0 : config.sha1) ?? Sha1,
    sha256: (config == null ? void 0 : config.sha256) ?? Sha256,
    streamCollector: (config == null ? void 0 : config.streamCollector) ?? streamCollector,
    streamHasher: (config == null ? void 0 : config.streamHasher) ?? blobHasher,
    useDualstackEndpoint: (config == null ? void 0 : config.useDualstackEndpoint) ?? (() => Promise.resolve(DEFAULT_USE_DUALSTACK_ENDPOINT)),
    useFipsEndpoint: (config == null ? void 0 : config.useFipsEndpoint) ?? (() => Promise.resolve(DEFAULT_USE_FIPS_ENDPOINT))
  };
};
const getAwsRegionExtensionConfiguration = (runtimeConfig) => {
  return {
    setRegion(region) {
      runtimeConfig.region = region;
    },
    region() {
      return runtimeConfig.region;
    }
  };
};
const resolveAwsRegionExtensionConfiguration = (awsRegionExtensionConfiguration) => {
  return {
    region: awsRegionExtensionConfiguration.region()
  };
};
const getHttpAuthExtensionConfiguration = (runtimeConfig) => {
  const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
  let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
  let _credentials = runtimeConfig.credentials;
  return {
    setHttpAuthScheme(httpAuthScheme) {
      const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
      if (index === -1) {
        _httpAuthSchemes.push(httpAuthScheme);
      } else {
        _httpAuthSchemes.splice(index, 1, httpAuthScheme);
      }
    },
    httpAuthSchemes() {
      return _httpAuthSchemes;
    },
    setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
      _httpAuthSchemeProvider = httpAuthSchemeProvider;
    },
    httpAuthSchemeProvider() {
      return _httpAuthSchemeProvider;
    },
    setCredentials(credentials) {
      _credentials = credentials;
    },
    credentials() {
      return _credentials;
    }
  };
};
const resolveHttpAuthRuntimeConfig = (config) => {
  return {
    httpAuthSchemes: config.httpAuthSchemes(),
    httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
    credentials: config.credentials()
  };
};
const resolveRuntimeExtensions = (runtimeConfig, extensions) => {
  const extensionConfiguration = Object.assign(getAwsRegionExtensionConfiguration(runtimeConfig), getDefaultExtensionConfiguration(runtimeConfig), getHttpHandlerExtensionConfiguration(runtimeConfig), getHttpAuthExtensionConfiguration(runtimeConfig));
  extensions.forEach((extension) => extension.configure(extensionConfiguration));
  return Object.assign(runtimeConfig, resolveAwsRegionExtensionConfiguration(extensionConfiguration), resolveDefaultRuntimeConfig(extensionConfiguration), resolveHttpHandlerRuntimeConfig(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
};
class S3Client extends Client {
  constructor(...[configuration]) {
    const _config_0 = getRuntimeConfig(configuration || {});
    super(_config_0);
    __publicField(this, "config");
    this.initConfig = _config_0;
    const _config_1 = resolveClientEndpointParameters(_config_0);
    const _config_2 = resolveUserAgentConfig(_config_1);
    const _config_3 = resolveFlexibleChecksumsConfig(_config_2);
    const _config_4 = resolveRetryConfig(_config_3);
    const _config_5 = resolveRegionConfig(_config_4);
    const _config_6 = resolveHostHeaderConfig(_config_5);
    const _config_7 = resolveEndpointConfig(_config_6);
    const _config_8 = resolveEventStreamSerdeConfig(_config_7);
    const _config_9 = resolveHttpAuthSchemeConfig(_config_8);
    const _config_10 = resolveS3Config(_config_9, { session: [() => this, CreateSessionCommand] });
    const _config_11 = resolveRuntimeExtensions(_config_10, (configuration == null ? void 0 : configuration.extensions) || []);
    this.config = _config_11;
    this.middlewareStack.use(getUserAgentPlugin(this.config));
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
      httpAuthSchemeParametersProvider: defaultS3HttpAuthSchemeParametersProvider,
      identityProviderConfigProvider: async (config) => new DefaultIdentityProviderConfig({
        "aws.auth#sigv4": config.credentials,
        "aws.auth#sigv4a": config.credentials
      })
    }));
    this.middlewareStack.use(getHttpSigningPlugin(this.config));
    this.middlewareStack.use(getValidateBucketNamePlugin(this.config));
    this.middlewareStack.use(getAddExpectContinuePlugin(this.config));
    this.middlewareStack.use(getRegionRedirectMiddlewarePlugin(this.config));
    this.middlewareStack.use(getS3ExpressPlugin(this.config));
    this.middlewareStack.use(getS3ExpressHttpSigningPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
}
function ssecMiddleware(options) {
  return (next) => async (args) => {
    const input = { ...args.input };
    const properties = [
      {
        target: "SSECustomerKey",
        hash: "SSECustomerKeyMD5"
      },
      {
        target: "CopySourceSSECustomerKey",
        hash: "CopySourceSSECustomerKeyMD5"
      }
    ];
    for (const prop of properties) {
      const value = input[prop.target];
      if (value) {
        let valueForHash;
        if (typeof value === "string") {
          if (isValidBase64EncodedSSECustomerKey(value, options)) {
            valueForHash = options.base64Decoder(value);
          } else {
            valueForHash = options.utf8Decoder(value);
            input[prop.target] = options.base64Encoder(valueForHash);
          }
        } else {
          valueForHash = ArrayBuffer.isView(value) ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength) : new Uint8Array(value);
          input[prop.target] = options.base64Encoder(valueForHash);
        }
        const hash = new options.md5();
        hash.update(valueForHash);
        input[prop.hash] = options.base64Encoder(await hash.digest());
      }
    }
    return next({
      ...args,
      input
    });
  };
}
const ssecMiddlewareOptions = {
  name: "ssecMiddleware",
  step: "initialize",
  tags: ["SSE"],
  override: true
};
const getSsecPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.add(ssecMiddleware(config), ssecMiddlewareOptions);
  }
});
function isValidBase64EncodedSSECustomerKey(str, options) {
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  if (!base64Regex.test(str))
    return false;
  try {
    const decodedBytes = options.base64Decoder(str);
    return decodedBytes.length === 32;
  } catch {
    return false;
  }
}
class DeleteObjectCommand extends Command.classBuilder().ep({
  ...commonParams,
  Bucket: { type: "contextParams", name: "Bucket" },
  Key: { type: "contextParams", name: "Key" }
}).m(function(Command2, cs2, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions()),
    getThrow200ExceptionsPlugin(config)
  ];
}).s("AmazonS3", "DeleteObject", {}).n("S3Client", "DeleteObjectCommand").f(void 0, void 0).ser(se_DeleteObjectCommand).de(de_DeleteObjectCommand).build() {
}
class GetObjectCommand extends Command.classBuilder().ep({
  ...commonParams,
  Bucket: { type: "contextParams", name: "Bucket" },
  Key: { type: "contextParams", name: "Key" }
}).m(function(Command2, cs2, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions()),
    getFlexibleChecksumsPlugin(config, {
      requestChecksumRequired: false,
      requestValidationModeMember: "ChecksumMode",
      responseAlgorithms: ["CRC64NVME", "CRC32", "CRC32C", "SHA256", "SHA1"]
    }),
    getSsecPlugin(config),
    getS3ExpiresMiddlewarePlugin()
  ];
}).s("AmazonS3", "GetObject", {}).n("S3Client", "GetObjectCommand").f(GetObjectRequestFilterSensitiveLog, GetObjectOutputFilterSensitiveLog).ser(se_GetObjectCommand).de(de_GetObjectCommand).build() {
}
class ListObjectsV2Command extends Command.classBuilder().ep({
  ...commonParams,
  Bucket: { type: "contextParams", name: "Bucket" },
  Prefix: { type: "contextParams", name: "Prefix" }
}).m(function(Command2, cs2, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions()),
    getThrow200ExceptionsPlugin(config)
  ];
}).s("AmazonS3", "ListObjectsV2", {}).n("S3Client", "ListObjectsV2Command").f(void 0, void 0).ser(se_ListObjectsV2Command).de(de_ListObjectsV2Command).build() {
}
class PutObjectCommand extends Command.classBuilder().ep({
  ...commonParams,
  Bucket: { type: "contextParams", name: "Bucket" },
  Key: { type: "contextParams", name: "Key" }
}).m(function(Command2, cs2, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions()),
    getFlexibleChecksumsPlugin(config, {
      requestAlgorithmMember: { httpHeader: "x-amz-sdk-checksum-algorithm", name: "ChecksumAlgorithm" },
      requestChecksumRequired: false
    }),
    getCheckContentLengthHeaderPlugin(),
    getThrow200ExceptionsPlugin(config),
    getSsecPlugin(config)
  ];
}).s("AmazonS3", "PutObject", {}).n("S3Client", "PutObjectCommand").f(PutObjectRequestFilterSensitiveLog, PutObjectOutputFilterSensitiveLog).ser(se_PutObjectCommand).de(de_PutObjectCommand).build() {
}
function formatUrl(request) {
  const { port, query } = request;
  let { protocol, path, hostname } = request;
  if (protocol && protocol.slice(-1) !== ":") {
    protocol += ":";
  }
  if (port) {
    hostname += `:${port}`;
  }
  if (path && path.charAt(0) !== "/") {
    path = `/${path}`;
  }
  let queryString = query ? buildQueryString(query) : "";
  if (queryString && queryString[0] !== "?") {
    queryString = `?${queryString}`;
  }
  let auth = "";
  if (request.username != null || request.password != null) {
    const username = request.username ?? "";
    const password = request.password ?? "";
    auth = `${username}:${password}@`;
  }
  let fragment = "";
  if (request.fragment) {
    fragment = `#${request.fragment}`;
  }
  return `${protocol}//${auth}${hostname}${path}${queryString}${fragment}`;
}
const UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
const SHA256_HEADER = "X-Amz-Content-Sha256";
class S3RequestPresigner {
  constructor(options) {
    __publicField(this, "signer");
    const resolvedOptions = {
      service: options.signingName || options.service || "s3",
      uriEscapePath: options.uriEscapePath || false,
      applyChecksum: options.applyChecksum || false,
      ...options
    };
    this.signer = new SignatureV4MultiRegion(resolvedOptions);
  }
  presign(requestToSign, { unsignableHeaders = /* @__PURE__ */ new Set(), hoistableHeaders = /* @__PURE__ */ new Set(), unhoistableHeaders = /* @__PURE__ */ new Set(), ...options } = {}) {
    this.prepareRequest(requestToSign, {
      unsignableHeaders,
      unhoistableHeaders,
      hoistableHeaders
    });
    return this.signer.presign(requestToSign, {
      expiresIn: 900,
      unsignableHeaders,
      unhoistableHeaders,
      ...options
    });
  }
  presignWithCredentials(requestToSign, credentials, { unsignableHeaders = /* @__PURE__ */ new Set(), hoistableHeaders = /* @__PURE__ */ new Set(), unhoistableHeaders = /* @__PURE__ */ new Set(), ...options } = {}) {
    this.prepareRequest(requestToSign, {
      unsignableHeaders,
      unhoistableHeaders,
      hoistableHeaders
    });
    return this.signer.presignWithCredentials(requestToSign, credentials, {
      expiresIn: 900,
      unsignableHeaders,
      unhoistableHeaders,
      ...options
    });
  }
  prepareRequest(requestToSign, { unsignableHeaders = /* @__PURE__ */ new Set(), unhoistableHeaders = /* @__PURE__ */ new Set(), hoistableHeaders = /* @__PURE__ */ new Set() } = {}) {
    unsignableHeaders.add("content-type");
    Object.keys(requestToSign.headers).map((header) => header.toLowerCase()).filter((header) => header.startsWith("x-amz-server-side-encryption")).forEach((header) => {
      if (!hoistableHeaders.has(header)) {
        unhoistableHeaders.add(header);
      }
    });
    requestToSign.headers[SHA256_HEADER] = UNSIGNED_PAYLOAD;
    const currentHostHeader = requestToSign.headers.host;
    const port = requestToSign.port;
    const expectedHostHeader = `${requestToSign.hostname}${requestToSign.port != null ? ":" + port : ""}`;
    if (!currentHostHeader || currentHostHeader === requestToSign.hostname && requestToSign.port != null) {
      requestToSign.headers.host = expectedHostHeader;
    }
  }
}
const getSignedUrl = async (client, command, options = {}) => {
  var _a, _b, _c;
  let s3Presigner;
  let region;
  if (typeof client.config.endpointProvider === "function") {
    const endpointV2 = await getEndpointFromInstructions(command.input, command.constructor, client.config);
    const authScheme = (_b = (_a = endpointV2.properties) == null ? void 0 : _a.authSchemes) == null ? void 0 : _b[0];
    if ((authScheme == null ? void 0 : authScheme.name) === "sigv4a") {
      region = (_c = authScheme == null ? void 0 : authScheme.signingRegionSet) == null ? void 0 : _c.join(",");
    } else {
      region = authScheme == null ? void 0 : authScheme.signingRegion;
    }
    s3Presigner = new S3RequestPresigner({
      ...client.config,
      signingName: authScheme == null ? void 0 : authScheme.signingName,
      region: async () => region
    });
  } else {
    s3Presigner = new S3RequestPresigner(client.config);
  }
  const presignInterceptMiddleware = (next, context) => async (args) => {
    const { request } = args;
    if (!HttpRequest.isInstance(request)) {
      throw new Error("Request to be presigned is not an valid HTTP request.");
    }
    delete request.headers["amz-sdk-invocation-id"];
    delete request.headers["amz-sdk-request"];
    delete request.headers["x-amz-user-agent"];
    let presigned2;
    const presignerOptions = {
      ...options,
      signingRegion: options.signingRegion ?? context["signing_region"] ?? region,
      signingService: options.signingService ?? context["signing_service"]
    };
    if (context.s3ExpressIdentity) {
      presigned2 = await s3Presigner.presignWithCredentials(request, context.s3ExpressIdentity, presignerOptions);
    } else {
      presigned2 = await s3Presigner.presign(request, presignerOptions);
    }
    return {
      response: {},
      output: {
        $metadata: { httpStatusCode: 200 },
        presigned: presigned2
      }
    };
  };
  const middlewareName = "presignInterceptMiddleware";
  const clientStack = client.middlewareStack.clone();
  clientStack.addRelativeTo(presignInterceptMiddleware, {
    name: middlewareName,
    relation: "before",
    toMiddleware: "awsAuthMiddleware",
    override: true
  });
  const handler = command.resolveMiddleware(clientStack, client.config, {});
  const { output } = await handler({ input: command.input });
  const { presigned } = output;
  return formatUrl(presigned);
};
export {
  DeleteObjectCommand as D,
  GetObjectCommand as G,
  ListObjectsV2Command as L,
  PutObjectCommand as P,
  S3Client as S,
  getSignedUrl as g,
  locateWindow as l
};
