import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'id-analyzer-v2/2.0 (api/6.1.1)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * List KYC profiles under your account
   *
   * @summary List KYC Profile
   */
  getProfile(): Promise<FetchResponse<200, types.GetProfileResponse200>> {
    return this.core.fetch('/profile', 'get');
  }

  /**
   * Create a new KYC profile, KYC profile allows user to define how the document should be
   * processed, with customizable thresholds that can be adjusted to suit different kind of
   * industries. 
   * Important note: KYC profile can be created under web portal using friendly GUI and
   * wizard.
   *
   * @summary Create New KYC Profile
   */
  postProfile(body: types.PostProfileBodyParam): Promise<FetchResponse<200, types.PostProfileResponse200>> {
    return this.core.fetch('/profile', 'post', body);
  }

  /**
   * Retrieve a list of transactions under your account, every scan and biometric API
   * response will be saved as a transaction if save to cloud option is enabled under KYC
   * profile. 
   *
   * @summary List Transactions
   */
  getTransaction(metadata?: types.GetTransactionMetadataParam): Promise<FetchResponse<200, types.GetTransactionResponse200>> {
    return this.core.fetch('/transaction', 'get', metadata);
  }

  /**
   * Retrieve a list of contract templates
   *
   * @summary List Contract Templates
   */
  getContract(body?: types.GetContractBodyParam, metadata?: types.GetContractMetadataParam): Promise<FetchResponse<200, types.GetContractResponse200>> {
    return this.core.fetch('/contract', 'get', body, metadata);
  }

  /**
   * Create new contract or form template. A template is used for auto-filling and document
   * automation tasks such as generating vehicle rental contract by scanning a driving
   * license.
   * Important note: Templates can be created under web portal using HTML editor.
   *
   * @summary Create Contract Template
   */
  postContract(body?: types.PostContractBodyParam): Promise<FetchResponse<200, types.PostContractResponse200>> {
    return this.core.fetch('/contract', 'post', body);
  }

  /**
   * Retrive a list of webhook sent
   *
   * @summary List Webhook History
   */
  getWebhook(body?: types.GetWebhookBodyParam, metadata?: types.GetWebhookMetadataParam): Promise<FetchResponse<200, types.GetWebhookResponse200>> {
    return this.core.fetch('/webhook', 'get', body, metadata);
  }

  /**
   * Start a new identity document scan or ID to face verification transaction by uploading
   * based64-encoded images. You may also perform AML check and document automation tasks
   * while verifying an identity document with this API function.
   *
   * We have prepared some test samples for you to get started, the samples are designed to
   * trigger most response scenarios to help you get a thorough understand of our API.
   *
   * Document Image: https://www.idanalyzer.com/assets/testsample_id.jpg
   * Face Image: https://www.idanalyzer.com/assets/testsample_face.jpg
   * KYC Profile: https://www.idanalyzer.com/assets/testprofile.json
   *
   * The driving license image was edited in Photoshop with specific information to trigger
   * an AML match, the eye color is intentionally obscured to trigger extra warnings.
   * The face image was recaptured using a phone camera.
   * The KYC profile have all the validations enabled and can be imported into your account
   * through web portal.
   *
   * @summary Standard ID Scan
   * @throws FetchError<400, types.PostScanResponse400> Bad Request
   * @throws FetchError<401, types.PostScanResponse401> Unauthorized
   */
  postScan(body: types.PostScanBodyParam): Promise<FetchResponse<200, types.PostScanResponse200>> {
    return this.core.fetch('/scan', 'post', body);
  }

  /**
   * Generate a document using template and extracted OCR data from a specific transaction
   *
   * @summary Generate Document
   */
  postGenerate(body: types.PostGenerateBodyParam): Promise<FetchResponse<200, types.PostGenerateResponse200>> {
    return this.core.fetch('/generate', 'post', body);
  }

  /**
   * AML search allows you to monitor politically exposed persons (PEPs), and discover person
   * or organization on under sanctions from worldwide governments. Use Standard ID Scan API
   * instead if you want to check for AML database while uploading a document imag.
   *
   * @summary AML Search
   */
  postAml(body?: types.PostAmlBodyParam): Promise<FetchResponse<200, types.PostAmlResponse200>> {
    return this.core.fetch('/aml', 'post', body);
  }

  /**
   * Initiate a quick identity document OCR scan by uploading based64-encoded images. Quick
   * scan is designed for realtime application such as camera feed for rapid document
   * recognition and data extraction without extensive security checks.
   *
   * @summary Quick ID Scan
   * @throws FetchError<400, types.PostQuickscanResponse400> Bad Request
   * @throws FetchError<401, types.PostQuickscanResponse401> Unauthorized
   */
  postQuickscan(body: types.PostQuickscanBodyParam): Promise<FetchResponse<200, types.PostQuickscanResponse200>> {
    return this.core.fetch('/quickscan', 'post', body);
  }

  /**
   * Retrieve a single transaction data
   *
   * @summary Get Transaction
   */
  getTransactionTransactionid(metadata: types.GetTransactionTransactionidMetadataParam): Promise<FetchResponse<200, types.GetTransactionTransactionidResponse200>> {
    return this.core.fetch('/transaction/{transactionId}', 'get', metadata);
  }

  /**
   * Delete a transaction and associated images
   *
   * @summary Delete Transaction
   */
  deleteTransactionTransactionid(metadata: types.DeleteTransactionTransactionidMetadataParam): Promise<FetchResponse<200, types.DeleteTransactionTransactionidResponse200>> {
    return this.core.fetch('/transaction/{transactionId}', 'delete', metadata);
  }

  /**
   * Update transaction decision, updated decision will be relayed to webhook if set.
   *
   * @summary Update Transaction Decision
   */
  patchTransactionTransactionid(body: types.PatchTransactionTransactionidBodyParam, metadata: types.PatchTransactionTransactionidMetadataParam): Promise<FetchResponse<200, types.PatchTransactionTransactionidResponse200>> {
    return this.core.fetch('/transaction/{transactionId}', 'patch', body, metadata);
  }

  /**
   * Retrieve image using a secure image token obtained from saved transaction
   *
   * @summary Download Output Image
   */
  getImagevaultImagetoken(metadata: types.GetImagevaultImagetokenMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/imagevault/{imageToken}', 'get', metadata);
  }

  /**
   * Download file using secured file name obtained from transaction outputFile.fileName
   *
   * @summary Download Output File
   */
  getFilevaultFilename(metadata: types.GetFilevaultFilenameMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/fillevault/{fileName}', 'get', metadata);
  }

  /**
   * Retrieve details of a KYC profile
   *
   * @summary Get KYC Profile
   */
  getProfileProfileid(metadata: types.GetProfileProfileidMetadataParam): Promise<FetchResponse<200, types.GetProfileProfileidResponse200>> {
    return this.core.fetch('/profile/{profileId}', 'get', metadata);
  }

  /**
   * Update a KYC profile with new settings
   *
   * @summary Update  KYC Profile
   */
  putProfileProfileid(body: types.PutProfileProfileidBodyParam, metadata: types.PutProfileProfileidMetadataParam): Promise<FetchResponse<200, types.PutProfileProfileidResponse200>>;
  putProfileProfileid(metadata: types.PutProfileProfileidMetadataParam): Promise<FetchResponse<200, types.PutProfileProfileidResponse200>>;
  putProfileProfileid(body?: types.PutProfileProfileidBodyParam | types.PutProfileProfileidMetadataParam, metadata?: types.PutProfileProfileidMetadataParam): Promise<FetchResponse<200, types.PutProfileProfileidResponse200>> {
    return this.core.fetch('/profile/{profileId}', 'put', body, metadata);
  }

  /**
   * Delete a KYC profile
   *
   * @summary Delete  KYC Profile
   */
  deleteProfileProfileid(metadata: types.DeleteProfileProfileidMetadataParam): Promise<FetchResponse<200, types.DeleteProfileProfileidResponse200>> {
    return this.core.fetch('/profile/{profileId}', 'delete', metadata);
  }

  /**
   * Get current your account information including usage and quota
   *
   * @summary Get Account Information
   */
  getMyaccount(): Promise<FetchResponse<200, types.GetMyaccountResponse200>> {
    return this.core.fetch('/myaccount', 'get');
  }

  /**
   * Perform 1:1 face verification using selfie photo or selfie video, against a reference
   * face image. Liveness check can also be performed depending on your KYC profile settings.
   * Use Standard ID Scan API instead if you want to compare selfie with an identity
   * document.
   *
   * @summary Face Verification
   */
  postFace(body: types.PostFaceBodyParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/face', 'post', body);
  }

  /**
   * Perform standalone liveness check on a selfie photo or video to detect whether the
   * selfie or selfie video is real and authentic.
   *
   * @summary Liveness Verification
   */
  postLiveness(body: types.PostLivenessBodyParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/liveness', 'post', body);
  }

  /**
   * Resend a webhook that has failed to send due to failure to connect to remote server or
   * non-200 response code.
   *
   * @summary Resend Webhook
   */
  postWebhookId(metadata: types.PostWebhookIdMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/webhook/{id}', 'post', metadata);
  }

  /**
   * Delete a webhook
   *
   * @summary Delete Webhook
   */
  deleteWebhookId(metadata: types.DeleteWebhookIdMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/webhook/{id}', 'delete', metadata);
  }

  /**
   * Export transactions into CSV or JSON file
   *
   * @summary Export Transactions
   */
  postExportTransaction(body?: types.PostExportTransactionBodyParam): Promise<FetchResponse<200, types.PostExportTransactionResponse200>> {
    return this.core.fetch('/export/transaction', 'post', body);
  }

  /**
   * Export KYC Profile as JSON, exported profile can be used to create new profiles or
   * imported to another account via web portal.
   *
   * @summary Export KYC Profile
   */
  getExportProfileId(metadata: types.GetExportProfileIdMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/export/profile/{id}', 'get', metadata);
  }

  /**
   * List Docupass links that has been generated under your account
   *
   * @summary List Docupass Links
   */
  getDocupass(metadata?: types.GetDocupassMetadataParam): Promise<FetchResponse<200, types.GetDocupassResponse200>> {
    return this.core.fetch('/docupass', 'get', metadata);
  }

  /**
   * Generate new Docupass link and QR Code for identity verification and/or eSignature. 
   *
   * You can: 
   *
   * - Embed the link in an iframe or fancybox/lightbox on your website
   * - Send the link to your customer
   * - Display the link/QR Code on your website
   * - Redirect user to this link
   * - Embed the link using WebView in Android and iOS 
   *
   * @summary Create Docupass Link
   */
  postDocupass(body?: types.PostDocupassBodyParam): Promise<FetchResponse<200, types.PostDocupassResponse200>> {
    return this.core.fetch('/docupass', 'post', body);
  }

  /**
   * Delete Docupass Link by reference code
   *
   * @summary Delete Docupass Link
   */
  deleteDocupassReference(metadata: types.DeleteDocupassReferenceMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/docupass/{reference}', 'delete', metadata);
  }

  /**
   * Retrieve Docupass details
   *
   * @summary Get Docupass Detail
   */
  getDocupassReference(metadata: types.GetDocupassReferenceMetadataParam): Promise<FetchResponse<200, types.GetDocupassReferenceResponse200>> {
    return this.core.fetch('/docupass/{reference}', 'get', metadata);
  }

  /**
   * Retrieve a contract template
   *
   * @summary Get Template
   */
  getContractTemplateId(metadata: types.GetContractTemplateIdMetadataParam): Promise<FetchResponse<200, types.GetContractTemplateIdResponse200>> {
    return this.core.fetch('/contract/{templateId}', 'get', metadata);
  }

  /**
   * Delete a contract template
   *
   * @summary Delete Template
   */
  deleteContractTemplateId(metadata: types.DeleteContractTemplateIdMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/contract/{templateId}', 'delete', metadata);
  }

  /**
   * Update a contract template
   *
   * @summary Update Template
   */
  postContractTemplateId(body: types.PostContractTemplateIdBodyParam, metadata: types.PostContractTemplateIdMetadataParam): Promise<FetchResponse<number, unknown>>;
  postContractTemplateId(metadata: types.PostContractTemplateIdMetadataParam): Promise<FetchResponse<number, unknown>>;
  postContractTemplateId(body?: types.PostContractTemplateIdBodyParam | types.PostContractTemplateIdMetadataParam, metadata?: types.PostContractTemplateIdMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/contract/{templateId}', 'post', body, metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { DeleteContractTemplateIdMetadataParam, DeleteDocupassReferenceMetadataParam, DeleteProfileProfileidMetadataParam, DeleteProfileProfileidResponse200, DeleteTransactionTransactionidMetadataParam, DeleteTransactionTransactionidResponse200, DeleteWebhookIdMetadataParam, GetContractBodyParam, GetContractMetadataParam, GetContractResponse200, GetContractTemplateIdMetadataParam, GetContractTemplateIdResponse200, GetDocupassMetadataParam, GetDocupassReferenceMetadataParam, GetDocupassReferenceResponse200, GetDocupassResponse200, GetExportProfileIdMetadataParam, GetFilevaultFilenameMetadataParam, GetImagevaultImagetokenMetadataParam, GetMyaccountResponse200, GetProfileProfileidMetadataParam, GetProfileProfileidResponse200, GetProfileResponse200, GetTransactionMetadataParam, GetTransactionResponse200, GetTransactionTransactionidMetadataParam, GetTransactionTransactionidResponse200, GetWebhookBodyParam, GetWebhookMetadataParam, GetWebhookResponse200, PatchTransactionTransactionidBodyParam, PatchTransactionTransactionidMetadataParam, PatchTransactionTransactionidResponse200, PostAmlBodyParam, PostAmlResponse200, PostContractBodyParam, PostContractResponse200, PostContractTemplateIdBodyParam, PostContractTemplateIdMetadataParam, PostDocupassBodyParam, PostDocupassResponse200, PostExportTransactionBodyParam, PostExportTransactionResponse200, PostFaceBodyParam, PostGenerateBodyParam, PostGenerateResponse200, PostLivenessBodyParam, PostProfileBodyParam, PostProfileResponse200, PostQuickscanBodyParam, PostQuickscanResponse200, PostQuickscanResponse400, PostQuickscanResponse401, PostScanBodyParam, PostScanResponse200, PostScanResponse400, PostScanResponse401, PostWebhookIdMetadataParam, PutProfileProfileidBodyParam, PutProfileProfileidMetadataParam, PutProfileProfileidResponse200 } from './types';
