import axios from 'axios';
import { apiUrl } from '../constants';
import { Objective } from '../types';

export class ObjectivesApiService {
  private axios = axios.create({
    baseURL: apiUrl,
  });

  public getSSEUrl(): string {
    return `${apiUrl}objectives/notify`;
  }

  public async getObjectives(): Promise<Objective[]> {
    return (await this.axios.get('objectives')).data;
  }

  public async updateObjective(id: string) {
    return await this.axios.patch(`objectives/${id}`);
  }
}
