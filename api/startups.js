import { handleStartupApi } from '../server/startupsApi.js';

export default function startupsApi(req, res) {
  return handleStartupApi(req, res);
}