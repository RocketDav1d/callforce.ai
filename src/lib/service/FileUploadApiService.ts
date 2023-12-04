import axios from 'axios';

const FileUploadApiService = {
  async getProperties() {
    console.log('getProperties');
    return axios.get(`/api/hubspot/get`, { withCredentials: true });
  },

  async postExtract(file_key: string) {
    console.log('postExtract');
    return axios.post('/api/extract', {
      s3_key: file_key,
      // other data if needed
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  async postHubspotQuery(properties: any, file_key: string) {
    console.log('postHubspotQuery');
    return axios.post('/api/hubspot/make-query', {
      properties,
      s3_key: file_key,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export default FileUploadApiService;
