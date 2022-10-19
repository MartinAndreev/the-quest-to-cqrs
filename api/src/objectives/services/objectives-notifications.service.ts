import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ObjectivesNotificationsService {
  private subject = new Subject<{ event: string; payload: any }>();

  public getObservable(): Observable<{ event: string; payload: any }> {
    return this.subject.asObservable();
  }

  public emit(event: string, payload: any): void {
    this.subject.next({ event, payload });
  }
}
